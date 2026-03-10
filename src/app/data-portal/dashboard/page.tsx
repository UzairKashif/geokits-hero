"use client"

import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { auth } from '@/lib/firebaseClient'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, LogOut, Database, Layers } from 'lucide-react'
import Image from 'next/image'

interface MapLayer {
  id: string
  name?: string
  type: 'vector' | 'raster'
  visible: boolean
  sourceUrl?: string
  sourceLayer?: string
  center?: [number, number]
}

interface LayerRowProps {
  layer: MapLayer
  toggle: (layer: MapLayer) => void
  collapsed: boolean
  opacity: number
  onOpacityChange: (value: number) => void
  onDragStart?: (id: string) => void
  onDrop?: (id: string) => void
}

interface BaseStyle {
  id: string
  name: string
  styleUrl: string
  accent: string
  description?: string
}

type CropSymbologyField = 'Primary_Crop' | 'Secondary_Crop' | 'Kharif_Recommendation' | 'Rabi_Recommendation'

type CropProperties = Record<string, string | number>
type CropFeature = GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon, CropProperties>
type CropFeatureCollection = GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon, CropProperties>

interface CropsApiResponse extends CropFeatureCollection {
  cropValues?: string[]
  availableSymbologyFields?: CropSymbologyField[]
}

const CROP_SOURCE_ID = 'crops-assessment-source'
const CROP_FILL_LAYER_ID = 'crops-assessment-fill'
const CROP_OUTLINE_LAYER_ID = 'crops-assessment-outline'
const CROP_ICON_FALLBACK = '/crop-icons/default.svg'

const CROP_SYMBOLOGY_OPTIONS: { value: CropSymbologyField; label: string }[] = [
  { value: 'Primary_Crop', label: 'Primary Crop' },
  { value: 'Secondary_Crop', label: 'Secondary Crop' },
  { value: 'Kharif_Recommendation', label: 'Kharif Recommendation' },
  { value: 'Rabi_Recommendation', label: 'Rabi Recommendation' }
]

const BASE_STYLES: BaseStyle[] = [
  {
    id: 'geokits-aurora',
    name: 'Aurora',
    styleUrl: 'mapbox://styles/uzairkashif27/cmeihge9s000n01s8dpym8rdv',
    accent: '#32de84',
    description: 'Custom brand style'
  },
  {
    id: 'mapbox-light',
    name: 'Atlas Light',
    styleUrl: 'mapbox://styles/mapbox/light-v11',
    accent: '#d4d4d8',
    description: 'Minimal daylight'
  },
  {
    id: 'mapbox-dark',
    name: 'Orbit Dark',
    styleUrl: 'mapbox://styles/mapbox/dark-v11',
    accent: '#0f172a',
    description: 'High-contrast night'
  },
  {
    id: 'mapbox-satellite',
    name: 'Satellite',
    styleUrl: 'mapbox://styles/mapbox/satellite-streets-v12',
    accent: '#3b82f6',
    description: 'Imagery + labels'
  }
]

type AddExternalLayerOptions = {
  flyOnAdd?: boolean
  opacity?: number
}

const getDefaultOpacity = (layer: MapLayer) => (layer.type === 'raster' ? 0.85 : 0.6)

const applyLayerOpacity = (map: mapboxgl.Map, layerId: string, layerType: MapLayer['type'], value: number) => {
  const paintProp = layerType === 'raster' ? 'raster-opacity' : 'fill-opacity'
  if (map.getLayer(layerId)) {
    map.setPaintProperty(layerId, paintProp, value)
  }
}

// Updated function with the 'nearest' fix
const addExternalLayer = (map: mapboxgl.Map, layer: MapLayer, options: AddExternalLayerOptions = {}) => {
  if (!layer.sourceUrl) return

  const { flyOnAdd = false, opacity } = options
  const sourceId = `source-${layer.id}`
  const layerId = `layer-${layer.id}`
  const targetOpacity = opacity ?? getDefaultOpacity(layer)

  if (!map.getSource(sourceId)) {
    map.addSource(sourceId, {
      type: layer.type === 'raster' ? 'raster' : 'vector',
      url: layer.sourceUrl,
      tileSize: 256
    })
  }

  if (!map.getLayer(layerId)) {
    if (layer.type === 'raster') {
      map.addLayer({
        id: layerId,
        type: 'raster',
        source: sourceId,
        paint: {
          'raster-opacity': targetOpacity,
          // FIX: Force nearest neighbor for pixelated look
          'raster-resampling': 'nearest',
          // FIX: Remove fade for instant sharpness
          'raster-fade-duration': 0
        }
      })
    } else {
      const sourceLayerName = layer.sourceLayer || layer.id.split('.').pop() || layer.id
      map.addLayer({
        id: layerId,
        type: 'fill',
        source: sourceId,
        'source-layer': sourceLayerName,
        paint: {
          'fill-color': '#32de84',
          'fill-opacity': targetOpacity,
          'fill-outline-color': '#fff'
        }
      })
    }
  } else {
    map.setLayoutProperty(layerId, 'visibility', 'visible')
  }

  applyLayerOpacity(map, layerId, layer.type, targetOpacity)

  if (flyOnAdd && layer.center) {
    map.flyTo({ center: layer.center, zoom: 9 })
  }
}

const slugifyCropName = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const getCropIconPath = (cropName: string) => {
  const slug = slugifyCropName(cropName)
  return slug ? `/crop-icons/${slug}.svg` : CROP_ICON_FALLBACK
}

const toFiniteNumber = (value: unknown): number | null => {
  const parsed = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : Number.NaN
  return Number.isFinite(parsed) ? parsed : null
}

const getMarkerCoordinates = (feature: CropFeature): [number, number] | null => {
  const markerLng = toFiniteNumber(feature.properties?.marker_lng)
  const markerLat = toFiniteNumber(feature.properties?.marker_lat)
  if (markerLng !== null && markerLat !== null) {
    return [markerLng, markerLat]
  }

  if (feature.geometry.type === 'Polygon') {
    const outerRing = feature.geometry.coordinates[0]
    if (!outerRing?.length) return null
    const lngValues = outerRing.map(coord => coord[0])
    const latValues = outerRing.map(coord => coord[1])
    const minLng = Math.min(...lngValues)
    const maxLng = Math.max(...lngValues)
    const minLat = Math.min(...latValues)
    const maxLat = Math.max(...latValues)
    return [(minLng + maxLng) / 2, (minLat + maxLat) / 2]
  }

  const outerRing = feature.geometry.coordinates[0]?.[0]
  if (!outerRing?.length) return null
  const lngValues = outerRing.map(coord => coord[0])
  const latValues = outerRing.map(coord => coord[1])
  const minLng = Math.min(...lngValues)
  const maxLng = Math.max(...lngValues)
  const minLat = Math.min(...latValues)
  const maxLat = Math.max(...latValues)
  return [(minLng + maxLng) / 2, (minLat + maxLat) / 2]
}

const ensureCropsSourceAndLayers = (map: mapboxgl.Map, data: CropFeatureCollection) => {
  const existingSource = map.getSource(CROP_SOURCE_ID) as mapboxgl.GeoJSONSource | undefined
  if (existingSource) {
    existingSource.setData(data)
  } else {
    map.addSource(CROP_SOURCE_ID, {
      type: 'geojson',
      data
    })
  }

  if (!map.getLayer(CROP_FILL_LAYER_ID)) {
    map.addLayer({
      id: CROP_FILL_LAYER_ID,
      type: 'fill',
      source: CROP_SOURCE_ID,
      paint: {
        'fill-color': '#32de84',
        'fill-opacity': 0.2
      }
    })
  }

  if (!map.getLayer(CROP_OUTLINE_LAYER_ID)) {
    map.addLayer({
      id: CROP_OUTLINE_LAYER_ID,
      type: 'line',
      source: CROP_SOURCE_ID,
      paint: {
        'line-color': '#d1fae5',
        'line-width': 1,
        'line-opacity': 0.75
      }
    })
  }
}

const setCropsLayerVisibility = (map: mapboxgl.Map, visible: boolean) => {
  const visibility = visible ? 'visible' : 'none'
  if (map.getLayer(CROP_FILL_LAYER_ID)) map.setLayoutProperty(CROP_FILL_LAYER_ID, 'visibility', visibility)
  if (map.getLayer(CROP_OUTLINE_LAYER_ID)) map.setLayoutProperty(CROP_OUTLINE_LAYER_ID, 'visibility', visibility)
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''

const Dashboard = () => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const externalLayersRef = useRef<MapLayer[]>([])
  const layerOpacityRef = useRef<Record<string, number>>({})
  const [externalLayers, setExternalLayers] = useState<MapLayer[]>([])
  const dragSourceRef = useRef<string | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeBaseStyle, setActiveBaseStyle] = useState(BASE_STYLES[0].id)
  const [layerOpacity, setLayerOpacity] = useState<Record<string, number>>({})
  const initialBaseStyleRef = useRef(activeBaseStyle)
  const cropMarkersRef = useRef<mapboxgl.Marker[]>([])
  const [cropsData, setCropsData] = useState<CropFeatureCollection | null>(null)
  const cropsDataRef = useRef<CropFeatureCollection | null>(null)
  const [cropsVisible, setCropsVisible] = useState(false)
  const cropsVisibleRef = useRef(false)
  const [cropsLoading, setCropsLoading] = useState(false)
  const [cropsError, setCropsError] = useState<string | null>(null)
  const [availableCropValues, setAvailableCropValues] = useState<string[]>([])
  const [cropSymbologyField, setCropSymbologyField] = useState<CropSymbologyField>('Primary_Crop')
  const cropSymbologyFieldRef = useRef<CropSymbologyField>('Primary_Crop')

  useEffect(() => {
    externalLayersRef.current = externalLayers
  }, [externalLayers])

  useEffect(() => {
    layerOpacityRef.current = layerOpacity
  }, [layerOpacity])

  useEffect(() => {
    cropsDataRef.current = cropsData
  }, [cropsData])

  useEffect(() => {
    cropsVisibleRef.current = cropsVisible
  }, [cropsVisible])

  useEffect(() => {
    cropSymbologyFieldRef.current = cropSymbologyField
  }, [cropSymbologyField])

  // 1. Auth & Data Fetching
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) router.push('/data-portal');
      else {
        setUser(u);
        fetchLayers();
      }
    })
    return () => unsub()
  }, [router])

  const fetchLayers = async () => {
    try {
      const res = await fetch('/api/mapbox/layers');
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      // Apply saved order from localStorage if present
      const saved = typeof window !== 'undefined' ? localStorage.getItem('geo_layers_order') : null
      let layers: MapLayer[] = data.map((l: MapLayer) => ({ ...l, visible: false }))
      if (saved) {
        try {
          const order: string[] = JSON.parse(saved)
          const orderIndex = new Map(order.map((id, i) => [id, i]))
          layers = layers.slice().sort((a, b) => {
            const ai = orderIndex.has(a.id) ? orderIndex.get(a.id)! : Number.MAX_SAFE_INTEGER
            const bi = orderIndex.has(b.id) ? orderIndex.get(b.id)! : Number.MAX_SAFE_INTEGER
            return ai - bi
          })
        } catch (err) {
          console.warn('Invalid saved layer order', err)
        }
      }
      setExternalLayers(layers);
      setLayerOpacity(prev => {
        const next = { ...prev }
        data.forEach((l: MapLayer) => {
          if (next[l.id] === undefined) {
            next[l.id] = getDefaultOpacity(l)
          }
        })
        return next
      })
    } catch (err) {
      console.error("Layer fetch error:", err);
    }
  };

  const fetchCropsAssessment = async () => {
    try {
      setCropsLoading(true)
      setCropsError(null)
      const res = await fetch('/api/crops-assessment')
      if (!res.ok) throw new Error('Failed to fetch crops assessment data')
      const data = (await res.json()) as CropsApiResponse
      const featureCollection: CropFeatureCollection = {
        type: 'FeatureCollection',
        features: data.features || []
      }
      setCropsData(featureCollection)
      setAvailableCropValues(Array.isArray(data.cropValues) ? data.cropValues : [])
      return featureCollection
    } catch (err) {
      console.error('Crops assessment fetch error:', err)
      setCropsError('Could not load crops assessment data')
      return null
    } finally {
      setCropsLoading(false)
    }
  }

  const clearCropMarkers = useCallback(() => {
    cropMarkersRef.current.forEach(marker => marker.remove())
    cropMarkersRef.current = []
  }, [])

  const renderCropMarkers = useCallback((map: mapboxgl.Map, data: CropFeatureCollection, field: CropSymbologyField) => {
    clearCropMarkers()
    if (!cropsVisibleRef.current) return

    const markers: mapboxgl.Marker[] = []
    data.features.forEach(feature => {
      const rawCropValue = feature.properties?.[field]
      if (typeof rawCropValue !== 'string' || !rawCropValue.trim()) return

      const markerCoords = getMarkerCoordinates(feature)
      if (!markerCoords) return

      const iconPath = getCropIconPath(rawCropValue)
      const wrapper = document.createElement('div')
      wrapper.style.width = '26px'
      wrapper.style.height = '26px'
      wrapper.style.display = 'flex'
      wrapper.style.alignItems = 'center'
      wrapper.style.justifyContent = 'center'
      wrapper.style.filter = 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6))'

      const iconImg = document.createElement('img')
      iconImg.src = iconPath
      iconImg.alt = rawCropValue
      iconImg.width = 24
      iconImg.height = 24
      iconImg.style.width = '24px'
      iconImg.style.height = '24px'
      iconImg.style.objectFit = 'contain'
      iconImg.title = rawCropValue
      iconImg.onerror = () => {
        if (!iconImg.src.includes('/crop-icons/default.svg')) {
          iconImg.src = CROP_ICON_FALLBACK
        }
      }
      wrapper.appendChild(iconImg)

      const marker = new mapboxgl.Marker({
        element: wrapper,
        anchor: 'center'
      })
        .setLngLat(markerCoords)
        .addTo(map)

      markers.push(marker)
    })

    cropMarkersRef.current = markers
  }, [clearCropMarkers])

  // 2. Map Initialization
  useEffect(() => {
    if (!user || !mapContainerRef.current) return

    const baseStyleForMount = BASE_STYLES.find(style => style.id === initialBaseStyleRef.current)
    const initialStyle = baseStyleForMount?.styleUrl || BASE_STYLES[0].styleUrl
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: initialStyle,
      center: [-74.006, 40.7128],
      zoom: 2,
      projection: 'globe'
    })

    map.on('style.load', () => {
      map.setFog({
        'color': 'rgb(186, 210, 235)',
        'high-color': 'rgb(36, 92, 223)',
        'space-color': 'rgb(11, 11, 25)'
      });

      externalLayersRef.current
        .filter(layer => layer.visible)
        .forEach(layer => {
          const opacityValue = layerOpacityRef.current[layer.id] ?? getDefaultOpacity(layer)
          addExternalLayer(map, layer, { flyOnAdd: false, opacity: opacityValue })
        })

      const cropsSnapshot = cropsDataRef.current
      if (cropsSnapshot) {
        ensureCropsSourceAndLayers(map, cropsSnapshot)
        setCropsLayerVisibility(map, cropsVisibleRef.current)
      }
      if (cropsSnapshot && cropsVisibleRef.current) {
        renderCropMarkers(map, cropsSnapshot, cropSymbologyFieldRef.current)
      } else {
        clearCropMarkers()
      }

      setMapLoaded(true)
    });

    mapRef.current = map
    return () => {
      clearCropMarkers()
      map.remove()
    }
  }, [clearCropMarkers, renderCropMarkers, user])

  useEffect(() => {
    if (!mapRef.current) return
    const timeoutId = window.setTimeout(() => {
      mapRef.current?.resize()
    }, 350)
    return () => window.clearTimeout(timeoutId)
  }, [isCollapsed])

  useEffect(() => {
    if (!mapRef.current) return
    const selected = BASE_STYLES.find(style => style.id === activeBaseStyle)
    if (!selected) return
    setMapLoaded(false)
    mapRef.current.setStyle(selected.styleUrl)
  }, [activeBaseStyle])

  // 3. Toggle Logic (The Engine)
  const toggleLayer = (layer: MapLayer) => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    
    // --- External Tilesets (Data) ---
    const layerId = `layer-${layer.id}`;

    if (!layer.visible) {
      const currentOpacity = layerOpacity[layer.id] ?? getDefaultOpacity(layer)
      addExternalLayer(map, layer, { flyOnAdd: true, opacity: currentOpacity })
      setLayerOpacity(prev => ({ ...prev, [layer.id]: currentOpacity }))
    } else {
      // TURN OFF
      if (map.getLayer(layerId)) map.setLayoutProperty(layerId, 'visibility', 'none');
    }

    setExternalLayers(prev => prev.map(l => l.id === layer.id ? { ...l, visible: !l.visible } : l));
  }

  const handleLayerOpacityChange = (layer: MapLayer, value: number) => {
    if (!mapRef.current) return
    const normalized = Math.min(1, Math.max(0, value))
    const layerId = `layer-${layer.id}`
    applyLayerOpacity(mapRef.current, layerId, layer.type, normalized)
    setLayerOpacity(prev => ({ ...prev, [layer.id]: normalized }))
  }

  const toggleCropsAssessment = async () => {
    if (!mapRef.current) return
    const map = mapRef.current
    const nextVisible = !cropsVisibleRef.current

    if (nextVisible) {
      let cropsSnapshot = cropsDataRef.current
      if (!cropsSnapshot) {
        cropsSnapshot = await fetchCropsAssessment()
      }
      if (!cropsSnapshot) return

      ensureCropsSourceAndLayers(map, cropsSnapshot)
      setCropsLayerVisibility(map, true)
      cropsVisibleRef.current = true
      renderCropMarkers(map, cropsSnapshot, cropSymbologyFieldRef.current)
      setCropsVisible(true)
      return
    }

    cropsVisibleRef.current = false
    setCropsVisible(false)
    setCropsLayerVisibility(map, false)
    clearCropMarkers()
  }

  const handleCropSymbologyChange = (field: CropSymbologyField) => {
    setCropSymbologyField(field)
    cropSymbologyFieldRef.current = field
    if (!mapRef.current || !cropsVisibleRef.current || !cropsDataRef.current) return
    renderCropMarkers(mapRef.current, cropsDataRef.current, field)
  }

  // Drag & drop handlers for reordering layers
  const handleDragStart = (id: string) => {
    dragSourceRef.current = id
  }

  const handleDrop = (targetId: string) => {
    const srcId = dragSourceRef.current
    if (!srcId || srcId === targetId) return
    setExternalLayers(prev => {
      const next = prev.slice()
      const srcIndex = next.findIndex(l => l.id === srcId)
      const tgtIndex = next.findIndex(l => l.id === targetId)
      if (srcIndex === -1 || tgtIndex === -1) return prev
      const [moved] = next.splice(srcIndex, 1)
      next.splice(tgtIndex, 0, moved)
      // persist order
      try {
        localStorage.setItem('geo_layers_order', JSON.stringify(next.map(l => l.id)))
      } catch (err) {
        console.warn('Could not save layer order', err)
      }
      return next
    })
    dragSourceRef.current = null
  }
  
  if (!user) return null

  return (
    <div className="relative flex h-screen w-full bg-[#0a0a0a] text-white overflow-hidden">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-10 z-30 w-7 h-7 bg-[#32de84] rounded-full flex items-center justify-center text-black shadow-lg"
        style={{ left: isCollapsed ? 16 : 304 }}
        aria-label={isCollapsed ? 'Open sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 0 : 320 }}
        className="relative bg-black/60 backdrop-blur-xl border-r border-white/10 flex flex-col z-20"
        style={{ overflow: isCollapsed ? 'hidden' : 'visible', pointerEvents: isCollapsed ? 'none' : 'auto' }}
        aria-hidden={isCollapsed}
      >

        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="relative h-10 w-8 overflow-hidden">
            <Image
              src="/img/GEOKITSWHITE.png"
              alt="Geokits mark"
              fill
              sizes="32px"
              className="object-contain"
              priority
            />
          </div>
          {!isCollapsed && <span className="font-semibold tracking-wide">Geokits</span>}
        </div>  

        {!isCollapsed && (
          <div className="px-4 py-4 border-b border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/60">
              <Layers size={14} />
              <span>Base map</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {BASE_STYLES.map(style => {
                const isActive = style.id === activeBaseStyle
                return (
                  <button
                    key={style.id}
                    onClick={() => setActiveBaseStyle(style.id)}
                    disabled={!mapLoaded && !isActive}
                    className={`rounded-lg border px-3 py-2 text-left text-[11px] font-medium transition ${isActive ? 'bg-white text-black border-white' : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30'}`}
                  >
                    <span>{style.name}</span>
                    <span className="block text-[10px] text-white/50">{style.description}</span>
                    <span
                      className="mt-2 block h-1 w-full rounded-full"
                      style={{ backgroundColor: style.accent }}
                    />
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {!isCollapsed && (
          <div className="flex items-center gap-2 px-4 pt-4 pb-2 text-xs uppercase tracking-widest text-white/60">
            <Database size={14} />
            <span>Data Layers</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar" data-lenis-prevent data-lenis-prevent-wheel>
          {externalLayers.length ? (
            externalLayers.map(l => (
              <LayerRow
                key={l.id}
                layer={l}
                toggle={() => toggleLayer(l)}
                collapsed={isCollapsed}
                opacity={layerOpacity[l.id] ?? getDefaultOpacity(l)}
                onOpacityChange={(value) => handleLayerOpacityChange(l, value)}
                onDragStart={() => handleDragStart(l.id)}
                onDrop={() => handleDrop(l.id)}
              />
            ))
          ) : (
            <p className="text-xs text-white/40 text-center mt-10">No data layers available</p>
          )}

          {!isCollapsed && (
            <div className="mt-5 border-t border-white/10 pt-4">
              <div className="flex items-center gap-2 px-1 text-[11px] uppercase tracking-[0.18em] text-white/60">
                <Layers size={13} />
                <span>Crops Assessment</span>
              </div>

              <button
                onClick={toggleCropsAssessment}
                disabled={cropsLoading}
                className={`mt-2 w-full flex items-center justify-between rounded-lg p-3 text-left text-xs transition ${
                  cropsVisible ? 'bg-white/10 text-white' : 'bg-white/5 text-white/80 hover:bg-white/10'
                } ${cropsLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <span>{cropsLoading ? 'Loading...' : 'Field Recommendations'}</span>
                <span className={`inline-block w-2 h-2 rounded-full ${cropsVisible ? 'bg-[#32de84]' : 'bg-white/20'}`} />
              </button>

              {cropsVisible && (
                <div className="mt-3 px-1">
                  <label htmlFor="crop-symbology" className="block text-[11px] text-white/60 mb-2">
                    Symbology by
                  </label>
                  <select
                    id="crop-symbology"
                    value={cropSymbologyField}
                    onChange={(e) => handleCropSymbologyChange(e.target.value as CropSymbologyField)}
                    className="w-full rounded-md border border-white/20 bg-black/40 px-2 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#32de84]"
                  >
                    {CROP_SYMBOLOGY_OPTIONS.map(option => (
                      <option key={option.value} value={option.value} className="bg-[#0f0f0f]">
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {availableCropValues.length > 0 && (
                    <p className="mt-2 text-[10px] text-white/45">
                      {availableCropValues.length} crop classes loaded
                    </p>
                  )}
                </div>
              )}

              {cropsError && <p className="mt-2 px-1 text-[11px] text-red-300">{cropsError}</p>}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/5">
           <button onClick={() => signOut(auth)} className="flex items-center gap-3 text-white/50 hover:text-red-400 p-2 text-sm">
             <LogOut size={16} /> {!isCollapsed && "Sign Out"}
           </button>
        </div>
      </motion.aside>

      <main className="flex-1 relative">
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
        {!mapLoaded && <div className="absolute inset-0 flex items-center justify-center bg-black z-50">Loading Map...</div>}
      </main>
    </div>
  )
}

const LayerRow = ({ layer, toggle, collapsed, opacity, onOpacityChange, onDragStart, onDrop }: LayerRowProps) => {
  // Local state to handle slider movement smoothly before committing
  const [localOpacity, setLocalOpacity] = useState(opacity)

  useEffect(() => {
    setLocalOpacity(opacity)
  }, [opacity])

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseFloat(e.target.value)
    setLocalOpacity(newVal)
    onOpacityChange(newVal)
  }

  return (
    <div
      className="mb-2"
      draggable
      onDragStart={(e) => {
        e.dataTransfer?.setData('text/plain', layer.id)
        e.dataTransfer!.effectAllowed = 'move'
        onDragStart?.(layer.id)
      }}
      onDragOver={(e) => {
        e.preventDefault()
        e.dataTransfer!.dropEffect = 'move'
      }}
      onDrop={(e) => {
        e.preventDefault()
        const targetId = layer.id
        // prefer explicit prop handler
        onDrop?.(targetId)
      }}
      onDragEnd={() => {
        // nothing for now
      }}
    >
      <button
        onClick={() => toggle(layer)}
        className={`w-full flex items-center rounded-lg transition-all ${collapsed ? 'justify-center p-2' : 'justify-between p-3 hover:bg-white/5'} ${layer.visible ? 'bg-white/5' : ''}`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={`w-2 h-2 rounded-full ${layer.visible ? 'bg-[#32de84]' : 'bg-white/10'}`} />
          {!collapsed && <span className="text-xs truncate text-white/80">{layer.name || layer.id}</span>}
        </div>
      </button>
      {!collapsed && layer.visible && (
        <div className="mt-2 flex items-center gap-2 px-1 text-[11px] text-white/60">
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={localOpacity}
            onChange={handleSliderChange}
            className="flex-1 accent-[#32de84]"
          />
          <span>{Math.round(localOpacity * 100)}%</span>
        </div>
      )}
    </div>
  )
}

export default Dashboard
