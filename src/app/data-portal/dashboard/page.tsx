"use client"

import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, signOut,User } from 'firebase/auth'
import { auth } from '@/lib/firebaseClient'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Plus_Jakarta_Sans } from "next/font/google"
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, LogOut, Database, Layers } from 'lucide-react'

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

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
}

interface BaseStyle {
  id: string
  name: string
  styleUrl: string
  accent: string
  description?: string
}

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
}

const addExternalLayer = (map: mapboxgl.Map, layer: MapLayer, options: AddExternalLayerOptions = {}) => {
  if (!layer.sourceUrl) return

  const { flyOnAdd = false } = options
  const sourceId = `source-${layer.id}`
  const layerId = `layer-${layer.id}`

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
        paint: { 'raster-opacity': 0.8 }
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
          'fill-opacity': 0.5,
          'fill-outline-color': '#fff'
        }
      })
    }
  } else {
    map.setLayoutProperty(layerId, 'visibility', 'visible')
  }

  if (flyOnAdd && layer.center) {
    map.flyTo({ center: layer.center, zoom: 9 })
  }
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''

const Dashboard = () => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const externalLayersRef = useRef<MapLayer[]>([])
  const [externalLayers, setExternalLayers] = useState<MapLayer[]>([])
  const [mapLoaded, setMapLoaded] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeBaseStyle, setActiveBaseStyle] = useState(BASE_STYLES[0].id)
  const initialBaseStyleRef = useRef(activeBaseStyle)

  useEffect(() => {
    externalLayersRef.current = externalLayers
  }, [externalLayers])

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
      setExternalLayers(data.map((l: MapLayer) => ({ ...l, visible: false })));
    } catch (err) {
      console.error("Layer fetch error:", err);
    }
  };

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
        .forEach(layer => addExternalLayer(map, layer, { flyOnAdd: false }))

      setMapLoaded(true)
    });

    mapRef.current = map
    return () => map.remove()
  }, [user])

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
      addExternalLayer(map, layer, { flyOnAdd: true })
    } else {
      // TURN OFF
      if (map.getLayer(layerId)) map.setLayoutProperty(layerId, 'visibility', 'none');
    }

    setExternalLayers(prev => prev.map(l => l.id === layer.id ? { ...l, visible: !l.visible } : l));
  }

  if (!user) return null

  return (
    <div className={`relative flex h-screen w-full bg-[#0a0a0a] text-white overflow-hidden ${plusJakartaSans.className}`}>
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
          <div className="w-8 h-8 bg-[#32de84] rounded-lg flex items-center justify-center font-bold text-black text-xs">GK</div>
          {!isCollapsed && <span className="font-semibold">GeoKits</span>}
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

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {externalLayers.length ? (
            externalLayers.map(l => (
              <LayerRow key={l.id} layer={l} toggle={toggleLayer} collapsed={isCollapsed} />
            ))
          ) : (
            <p className="text-xs text-white/40 text-center mt-10">No data layers available</p>
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

const LayerRow = ({ layer, toggle, collapsed }: LayerRowProps) => (
  <button
    onClick={() => toggle(layer)}
    className={`w-full flex items-center rounded-lg mb-1 transition-all ${collapsed ? 'justify-center p-2' : 'justify-between p-3 hover:bg-white/5'} ${layer.visible ? 'bg-white/5' : ''}`}
  >
    <div className="flex items-center gap-3 overflow-hidden">
      <div className={`w-2 h-2 rounded-full ${layer.visible ? 'bg-[#32de84]' : 'bg-white/10'}`} />
      {!collapsed && <span className="text-xs truncate text-white/80">{layer.name || layer.id}</span>}
    </div>
  </button>
)

export default Dashboard