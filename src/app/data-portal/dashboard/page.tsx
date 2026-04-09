"use client"

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { auth } from '@/lib/firebaseClient'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, LogOut, Database, Layers, X } from 'lucide-react'
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

type CropFeatureProperties = Record<string, string | number | boolean | null | undefined>
type CropFeatureCollection = GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon, CropFeatureProperties>
type StudyContextLayerId = 'villagesArea' | 'trees' | 'streams' | 'heatRefugiaGaps' | 'riparianGaps'
type StudyContextFeatureCollection = GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
type StudyContextLayerState<T> = Record<StudyContextLayerId, T>

interface CropLayerApiResponse extends CropFeatureCollection {
  topTierCrops?: string[]
}

interface StudyContextLayerConfig {
  label: string
  description: string
  filePath: string
  defaultVisible: boolean
}

type PopupRecommendation = {
  label: string
  crop: string
  score: number | null
}

type PopupSeasonalRecommendation = {
  season: string
  best: string
  bestScore: number | null
  second: string
  secondScore: number | null
}

type PopupSuitability = {
  crop: string
  score: number | null
  classification: string
}

type CropFieldPanelData = {
  fieldId: string
  fieldUid: string
  areaText: string
  topCrop: string
  topCropScore: number | null
  waterTier: string
  limitingFactor: string
  tierLimitingCrop: string
  tierLimitingScore: number | null
  rotationStrategy: string
  tierRecommendations: PopupRecommendation[]
  seasonalRecommendations: PopupSeasonalRecommendation[]
  cropSuitability: PopupSuitability[]
  accentColor: string
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
  opacity?: number
}

const CROP_SOURCE_ID = 'crop-suitability-source'
const CROP_FILL_LAYER_ID = 'crop-suitability-fill'
const CROP_OUTLINE_LAYER_ID = 'crop-suitability-outline'
const VILLAGES_AREA_SOURCE_ID = 'villages-area-source'
const VILLAGES_AREA_FILL_LAYER_ID = 'villages-area-fill'
const VILLAGES_AREA_OUTLINE_LAYER_ID = 'villages-area-outline'
const TREES_SOURCE_ID = 'trees-source'
const TREES_LAYER_ID = 'trees-layer'
const STREAMS_SOURCE_ID = 'streams-source'
const STREAMS_LAYER_ID = 'streams-layer'
const HEAT_REFUGIA_GAPS_SOURCE_ID = 'heat-refugia-gaps-source'
const HEAT_REFUGIA_GAPS_FILL_LAYER_ID = 'heat-refugia-gaps-fill'
const HEAT_REFUGIA_GAPS_OUTLINE_LAYER_ID = 'heat-refugia-gaps-outline'
const RIPARIAN_GAPS_SOURCE_ID = 'riparian-gaps-source'
const RIPARIAN_GAPS_FILL_LAYER_ID = 'riparian-gaps-fill'
const RIPARIAN_GAPS_OUTLINE_LAYER_ID = 'riparian-gaps-outline'

const STUDY_CONTEXT_LAYER_ORDER: StudyContextLayerId[] = ['villagesArea', 'trees', 'streams']
const GREEN_SPACE_LAYER_ORDER: StudyContextLayerId[] = ['heatRefugiaGaps', 'riparianGaps']
const LOCAL_ANALYSIS_LAYER_RENDER_ORDER: StudyContextLayerId[] = [
  'villagesArea',
  'heatRefugiaGaps',
  'riparianGaps',
  'streams',
  'trees'
]

const STUDY_CONTEXT_LAYER_CONFIGS: StudyContextLayerState<StudyContextLayerConfig> = {
  villagesArea: {
    label: 'Villages Area',
    description: 'Study area polygon. This stays on by default.',
    filePath: '/data-portal/villages-area.geojson',
    defaultVisible: true
  },
  trees: {
    label: 'Trees',
    description: 'Point layer showing the tree inventory across the study area.',
    filePath: '/data-portal/trees.geojson',
    defaultVisible: false
  },
  streams: {
    label: 'Streams',
    description: 'Line layer showing stream corridors and drainage paths.',
    filePath: '/data-portal/stream.geojson',
    defaultVisible: false
  },
  heatRefugiaGaps: {
    label: 'Heat Refugia Gaps',
    description: 'Plantation gap polygons where added green cover can strengthen heat refuge.',
    filePath: '/data-portal/heat-refugia-gaps.geojson',
    defaultVisible: false
  },
  riparianGaps: {
    label: 'Riparian Gaps',
    description: 'Plantation gap polygons for riparian restoration and corridor continuity.',
    filePath: '/data-portal/riparian-gaps.geojson',
    defaultVisible: false
  }
}

const DEFAULT_STUDY_CONTEXT_VISIBILITY: StudyContextLayerState<boolean> = {
  villagesArea: true,
  trees: false,
  streams: false,
  heatRefugiaGaps: false,
  riparianGaps: false
}

const EMPTY_STUDY_CONTEXT_DATA: StudyContextLayerState<StudyContextFeatureCollection | null> = {
  villagesArea: null,
  trees: null,
  streams: null,
  heatRefugiaGaps: null,
  riparianGaps: null
}

const EMPTY_STUDY_CONTEXT_LOADING: StudyContextLayerState<boolean> = {
  villagesArea: false,
  trees: false,
  streams: false,
  heatRefugiaGaps: false,
  riparianGaps: false
}

const EMPTY_STUDY_CONTEXT_ERRORS: StudyContextLayerState<string | null> = {
  villagesArea: null,
  trees: null,
  streams: null,
  heatRefugiaGaps: null,
  riparianGaps: null
}

const CROP_COLOR_OVERRIDES: Record<string, string> = {
  'Henna': '#f97316',
  'Jojoba': '#14b8a6',
  'Aloe Vera': '#84cc16'
}

const CROP_COLOR_FALLBACKS = ['#38bdf8', '#a855f7', '#ef4444', '#eab308', '#06b6d4', '#fb7185']

const getDefaultOpacity = (layer: MapLayer) => (layer.type === 'raster' ? 0.85 : 0.6)

const applyLayerOpacity = (map: mapboxgl.Map, layerId: string, layerType: MapLayer['type'], value: number) => {
  const paintProp = layerType === 'raster' ? 'raster-opacity' : 'fill-opacity'
  if (map.getLayer(layerId)) {
    map.setPaintProperty(layerId, paintProp, value)
  }
}

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
          'raster-resampling': 'nearest',
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

const toFiniteNumber = (value: unknown): number | null => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

const parseJsonProperty = <T,>(value: unknown, fallback: T): T => {
  if (typeof value !== 'string' || !value.trim()) return fallback

  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

const formatScore = (value: number | null) => (value === null ? 'NA' : value.toFixed(1))

const formatArea = (areaM2: number | null) => {
  if (areaM2 === null) return ''
  const areaHa = areaM2 / 10000
  return `${areaHa.toFixed(2)} ha`
}

const getCropColor = (cropName: string) => {
  if (!cropName) return '#64748b'
  if (CROP_COLOR_OVERRIDES[cropName]) return CROP_COLOR_OVERRIDES[cropName]

  let hash = 0
  for (let i = 0; i < cropName.length; i += 1) {
    hash = (hash << 5) - hash + cropName.charCodeAt(i)
    hash |= 0
  }

  return CROP_COLOR_FALLBACKS[Math.abs(hash) % CROP_COLOR_FALLBACKS.length]
}

const buildCropColorExpression = (data: CropFeatureCollection) => {
  const uniqueTopCrops = Array.from(
    new Set(
      data.features
        .map(feature => String(feature.properties?.top_crop || '').trim())
        .filter(Boolean)
    )
  )

  const expression: unknown[] = ['match', ['coalesce', ['get', 'top_crop'], '']]
  uniqueTopCrops.forEach(crop => {
    expression.push(crop, getCropColor(crop))
  })
  expression.push('#64748b')

  return expression
}

const ensureCropSuitabilityLayer = (map: mapboxgl.Map, data: CropFeatureCollection) => {
  const existingSource = map.getSource(CROP_SOURCE_ID) as mapboxgl.GeoJSONSource | undefined
  if (existingSource) {
    existingSource.setData(data as GeoJSON.FeatureCollection)
  } else {
    map.addSource(CROP_SOURCE_ID, {
      type: 'geojson',
      data
    })
  }

  const fillColorExpression = buildCropColorExpression(data)
  const beforeId =
    (map.getLayer(HEAT_REFUGIA_GAPS_FILL_LAYER_ID) && HEAT_REFUGIA_GAPS_FILL_LAYER_ID) ||
    (map.getLayer(RIPARIAN_GAPS_FILL_LAYER_ID) && RIPARIAN_GAPS_FILL_LAYER_ID) ||
    (map.getLayer(STREAMS_LAYER_ID) && STREAMS_LAYER_ID) ||
    (map.getLayer(TREES_LAYER_ID) && TREES_LAYER_ID) ||
    undefined

  if (!map.getLayer(CROP_FILL_LAYER_ID)) {
    map.addLayer(
      {
        id: CROP_FILL_LAYER_ID,
        type: 'fill',
        source: CROP_SOURCE_ID,
        paint: {
          'fill-color': fillColorExpression as never,
          'fill-opacity': 0.42
        }
      },
      beforeId
    )
  } else {
    map.setPaintProperty(CROP_FILL_LAYER_ID, 'fill-color', fillColorExpression as never)
  }

  if (!map.getLayer(CROP_OUTLINE_LAYER_ID)) {
    map.addLayer(
      {
        id: CROP_OUTLINE_LAYER_ID,
        type: 'line',
        source: CROP_SOURCE_ID,
        paint: {
          'line-color': '#f8fafc',
          'line-width': 1.15,
          'line-opacity': 0.85
        }
      },
      beforeId
    )
  }
}

const setCropSuitabilityVisibility = (map: mapboxgl.Map, visible: boolean) => {
  const visibility = visible ? 'visible' : 'none'
  if (map.getLayer(CROP_FILL_LAYER_ID)) {
    map.setLayoutProperty(CROP_FILL_LAYER_ID, 'visibility', visibility)
  }
  if (map.getLayer(CROP_OUTLINE_LAYER_ID)) {
    map.setLayoutProperty(CROP_OUTLINE_LAYER_ID, 'visibility', visibility)
  }
}

const getStudyContextInsertBeforeId = (map: mapboxgl.Map) => {
  if (map.getLayer(CROP_FILL_LAYER_ID)) return CROP_FILL_LAYER_ID
  if (map.getLayer(HEAT_REFUGIA_GAPS_FILL_LAYER_ID)) return HEAT_REFUGIA_GAPS_FILL_LAYER_ID
  if (map.getLayer(RIPARIAN_GAPS_FILL_LAYER_ID)) return RIPARIAN_GAPS_FILL_LAYER_ID
  if (map.getLayer(STREAMS_LAYER_ID)) return STREAMS_LAYER_ID
  if (map.getLayer(TREES_LAYER_ID)) return TREES_LAYER_ID
  return undefined
}

const getGreenSpaceInsertBeforeId = (map: mapboxgl.Map) => {
  if (map.getLayer(STREAMS_LAYER_ID)) return STREAMS_LAYER_ID
  if (map.getLayer(TREES_LAYER_ID)) return TREES_LAYER_ID
  return undefined
}

const ensureStudyContextLayer = (
  map: mapboxgl.Map,
  layerId: StudyContextLayerId,
  data: StudyContextFeatureCollection
) => {
  if (layerId === 'villagesArea') {
    const existingSource = map.getSource(VILLAGES_AREA_SOURCE_ID) as mapboxgl.GeoJSONSource | undefined
    if (existingSource) {
      existingSource.setData(data)
    } else {
      map.addSource(VILLAGES_AREA_SOURCE_ID, {
        type: 'geojson',
        data
      })
    }

    const beforeId = getStudyContextInsertBeforeId(map)

    if (!map.getLayer(VILLAGES_AREA_FILL_LAYER_ID)) {
      map.addLayer(
        {
          id: VILLAGES_AREA_FILL_LAYER_ID,
          type: 'fill',
          source: VILLAGES_AREA_SOURCE_ID,
          paint: {
            'fill-color': '#f59e0b',
            'fill-opacity': 0.08
          }
        },
        beforeId
      )
    }

    if (!map.getLayer(VILLAGES_AREA_OUTLINE_LAYER_ID)) {
      map.addLayer(
        {
          id: VILLAGES_AREA_OUTLINE_LAYER_ID,
          type: 'line',
          source: VILLAGES_AREA_SOURCE_ID,
          paint: {
            'line-color': '#fdba74',
            'line-width': 1.4,
            'line-opacity': 0.82,
            'line-dasharray': [2, 1.4]
          }
        },
        beforeId
      )
    }

    return
  }

  if (layerId === 'trees') {
    const existingSource = map.getSource(TREES_SOURCE_ID) as mapboxgl.GeoJSONSource | undefined
    if (existingSource) {
      existingSource.setData(data)
    } else {
      map.addSource(TREES_SOURCE_ID, {
        type: 'geojson',
        data
      })
    }

    if (!map.getLayer(TREES_LAYER_ID)) {
      map.addLayer({
        id: TREES_LAYER_ID,
        type: 'circle',
        source: TREES_SOURCE_ID,
        paint: {
          'circle-color': '#86efac',
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 7, 1.8, 11, 3.1, 14, 4.8],
          'circle-stroke-width': 1,
          'circle-stroke-color': '#14532d',
          'circle-opacity': 0.9
        }
      })
    }

    return
  }

  if (layerId === 'heatRefugiaGaps') {
    const existingSource = map.getSource(HEAT_REFUGIA_GAPS_SOURCE_ID) as mapboxgl.GeoJSONSource | undefined
    if (existingSource) {
      existingSource.setData(data)
    } else {
      map.addSource(HEAT_REFUGIA_GAPS_SOURCE_ID, {
        type: 'geojson',
        data
      })
    }

    const beforeId = getGreenSpaceInsertBeforeId(map)

    if (!map.getLayer(HEAT_REFUGIA_GAPS_FILL_LAYER_ID)) {
      map.addLayer(
        {
          id: HEAT_REFUGIA_GAPS_FILL_LAYER_ID,
          type: 'fill',
          source: HEAT_REFUGIA_GAPS_SOURCE_ID,
          paint: {
            'fill-color': '#f97316',
            'fill-opacity': 0.22
          }
        },
        beforeId
      )
    }

    if (!map.getLayer(HEAT_REFUGIA_GAPS_OUTLINE_LAYER_ID)) {
      map.addLayer(
        {
          id: HEAT_REFUGIA_GAPS_OUTLINE_LAYER_ID,
          type: 'line',
          source: HEAT_REFUGIA_GAPS_SOURCE_ID,
          paint: {
            'line-color': '#fdba74',
            'line-width': 1.3,
            'line-opacity': 0.95
          }
        },
        beforeId
      )
    }

    return
  }

  if (layerId === 'riparianGaps') {
    const existingSource = map.getSource(RIPARIAN_GAPS_SOURCE_ID) as mapboxgl.GeoJSONSource | undefined
    if (existingSource) {
      existingSource.setData(data)
    } else {
      map.addSource(RIPARIAN_GAPS_SOURCE_ID, {
        type: 'geojson',
        data
      })
    }

    const beforeId = getGreenSpaceInsertBeforeId(map)

    if (!map.getLayer(RIPARIAN_GAPS_FILL_LAYER_ID)) {
      map.addLayer(
        {
          id: RIPARIAN_GAPS_FILL_LAYER_ID,
          type: 'fill',
          source: RIPARIAN_GAPS_SOURCE_ID,
          paint: {
            'fill-color': '#0f766e',
            'fill-opacity': 0.2
          }
        },
        beforeId
      )
    }

    if (!map.getLayer(RIPARIAN_GAPS_OUTLINE_LAYER_ID)) {
      map.addLayer(
        {
          id: RIPARIAN_GAPS_OUTLINE_LAYER_ID,
          type: 'line',
          source: RIPARIAN_GAPS_SOURCE_ID,
          paint: {
            'line-color': '#5eead4',
            'line-width': 1.3,
            'line-opacity': 0.95
          }
        },
        beforeId
      )
    }

    return
  }

  const existingSource = map.getSource(STREAMS_SOURCE_ID) as mapboxgl.GeoJSONSource | undefined
  if (existingSource) {
    existingSource.setData(data)
  } else {
    map.addSource(STREAMS_SOURCE_ID, {
      type: 'geojson',
      data
    })
  }

  const beforeId = map.getLayer(TREES_LAYER_ID) ? TREES_LAYER_ID : undefined

  if (!map.getLayer(STREAMS_LAYER_ID)) {
    map.addLayer(
      {
        id: STREAMS_LAYER_ID,
        type: 'line',
        source: STREAMS_SOURCE_ID,
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        },
        paint: {
          'line-color': '#7dd3fc',
          'line-width': ['interpolate', ['linear'], ['zoom'], 7, 1.6, 11, 2.7, 14, 4],
          'line-opacity': 0.94
        }
      },
      beforeId
    )
  }
}

const setStudyContextMapVisibility = (map: mapboxgl.Map, layerId: StudyContextLayerId, visible: boolean) => {
  const visibility = visible ? 'visible' : 'none'

  if (layerId === 'villagesArea') {
    if (map.getLayer(VILLAGES_AREA_FILL_LAYER_ID)) {
      map.setLayoutProperty(VILLAGES_AREA_FILL_LAYER_ID, 'visibility', visibility)
    }
    if (map.getLayer(VILLAGES_AREA_OUTLINE_LAYER_ID)) {
      map.setLayoutProperty(VILLAGES_AREA_OUTLINE_LAYER_ID, 'visibility', visibility)
    }
    return
  }

  if (layerId === 'trees') {
    if (map.getLayer(TREES_LAYER_ID)) {
      map.setLayoutProperty(TREES_LAYER_ID, 'visibility', visibility)
    }
    return
  }

  if (layerId === 'heatRefugiaGaps') {
    if (map.getLayer(HEAT_REFUGIA_GAPS_FILL_LAYER_ID)) {
      map.setLayoutProperty(HEAT_REFUGIA_GAPS_FILL_LAYER_ID, 'visibility', visibility)
    }
    if (map.getLayer(HEAT_REFUGIA_GAPS_OUTLINE_LAYER_ID)) {
      map.setLayoutProperty(HEAT_REFUGIA_GAPS_OUTLINE_LAYER_ID, 'visibility', visibility)
    }
    return
  }

  if (layerId === 'riparianGaps') {
    if (map.getLayer(RIPARIAN_GAPS_FILL_LAYER_ID)) {
      map.setLayoutProperty(RIPARIAN_GAPS_FILL_LAYER_ID, 'visibility', visibility)
    }
    if (map.getLayer(RIPARIAN_GAPS_OUTLINE_LAYER_ID)) {
      map.setLayoutProperty(RIPARIAN_GAPS_OUTLINE_LAYER_ID, 'visibility', visibility)
    }
    return
  }

  if (map.getLayer(STREAMS_LAYER_ID)) {
    map.setLayoutProperty(STREAMS_LAYER_ID, 'visibility', visibility)
  }
}

const extendBoundsFromCoordinates = (bounds: mapboxgl.LngLatBounds, coordinates: unknown): void => {
  if (!Array.isArray(coordinates)) return

  const [first] = coordinates
  if (typeof first === 'number' && typeof coordinates[1] === 'number') {
    bounds.extend(coordinates as [number, number])
    return
  }

  coordinates.forEach(entry => extendBoundsFromCoordinates(bounds, entry))
}

const extendBoundsFromGeometry = (bounds: mapboxgl.LngLatBounds, geometry: GeoJSON.Geometry | null | undefined): void => {
  if (!geometry) return

  if (geometry.type === 'GeometryCollection') {
    geometry.geometries.forEach(entry => extendBoundsFromGeometry(bounds, entry))
    return
  }

  extendBoundsFromCoordinates(bounds, geometry.coordinates)
}

const fitMapToFeatureCollection = (map: mapboxgl.Map, data: GeoJSON.FeatureCollection) => {
  const bounds = new mapboxgl.LngLatBounds()

  data.features.forEach(feature => {
    extendBoundsFromGeometry(bounds, feature.geometry)
  })

  if (!bounds.isEmpty()) {
    map.fitBounds(bounds, {
      padding: 64,
      duration: 1400,
      maxZoom: 15
    })
  }
}

const buildCropPopupData = (properties: Record<string, unknown>): CropFieldPanelData => {
  const fieldId = String(properties.field_id || 'Unknown')
  const fieldUid = String(properties.field_uid || '').trim()
  const areaM2 = toFiniteNumber(properties.area_m2)
  const topCrop = String(properties.top_crop || 'Crop Suitability').trim()
  const topCropScore = toFiniteNumber(properties.top_crop_score)
  const waterTier = String(properties.water_tier || '').trim()
  const limitingFactor = String(properties.limiting_factor || '').trim()
  const tierLimitingCrop = String(properties.tier_limiting_crop || '').trim()
  const tierLimitingScore = toFiniteNumber(properties.tier_limiting_score)
  const rotationStrategy = String(properties.rotation_strategy || '').trim()
  const tierRecommendations = parseJsonProperty<PopupRecommendation[]>(properties.tier_recommendations_json, [])
  const seasonalRecommendations = parseJsonProperty<PopupSeasonalRecommendation[]>(
    properties.seasonal_recommendations_json,
    []
  )
  const cropSuitability = parseJsonProperty<PopupSuitability[]>(properties.crop_suitability_json, [])
  const accentColor = getCropColor(topCrop)
  return {
    fieldId,
    fieldUid,
    areaText: formatArea(areaM2),
    topCrop,
    topCropScore,
    waterTier,
    limitingFactor,
    tierLimitingCrop,
    tierLimitingScore,
    rotationStrategy,
    tierRecommendations,
    seasonalRecommendations,
    cropSuitability,
    accentColor
  }
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
  const [cropLayerData, setCropLayerData] = useState<CropFeatureCollection | null>(null)
  const cropLayerDataRef = useRef<CropFeatureCollection | null>(null)
  const [cropLayerVisible, setCropLayerVisible] = useState(false)
  const cropLayerVisibleRef = useRef(false)
  const [cropLayerLoading, setCropLayerLoading] = useState(false)
  const [cropLayerError, setCropLayerError] = useState<string | null>(null)
  const [cropLegendCrops, setCropLegendCrops] = useState<string[]>([])
  const [selectedCropField, setSelectedCropField] = useState<CropFieldPanelData | null>(null)
  const cropLayerFittedRef = useRef(false)
  const [studyContextLayerData, setStudyContextLayerData] =
    useState<StudyContextLayerState<StudyContextFeatureCollection | null>>(EMPTY_STUDY_CONTEXT_DATA)
  const studyContextLayerDataRef = useRef<StudyContextLayerState<StudyContextFeatureCollection | null>>(
    EMPTY_STUDY_CONTEXT_DATA
  )
  const [studyContextLayerVisibility, setStudyContextLayerVisibility] = useState<StudyContextLayerState<boolean>>(
    DEFAULT_STUDY_CONTEXT_VISIBILITY
  )
  const studyContextLayerVisibilityRef = useRef<StudyContextLayerState<boolean>>(DEFAULT_STUDY_CONTEXT_VISIBILITY)
  const [studyContextLayerLoading, setStudyContextLayerLoading] =
    useState<StudyContextLayerState<boolean>>(EMPTY_STUDY_CONTEXT_LOADING)
  const studyContextLayerLoadingRef = useRef<StudyContextLayerState<boolean>>(EMPTY_STUDY_CONTEXT_LOADING)
  const [studyContextLayerErrors, setStudyContextLayerErrors] =
    useState<StudyContextLayerState<string | null>>(EMPTY_STUDY_CONTEXT_ERRORS)
  const studyContextLayerFittedRef = useRef(false)

  useEffect(() => {
    externalLayersRef.current = externalLayers
  }, [externalLayers])

  useEffect(() => {
    layerOpacityRef.current = layerOpacity
  }, [layerOpacity])

  useEffect(() => {
    cropLayerDataRef.current = cropLayerData
  }, [cropLayerData])

  useEffect(() => {
    cropLayerVisibleRef.current = cropLayerVisible
  }, [cropLayerVisible])

  useEffect(() => {
    studyContextLayerDataRef.current = studyContextLayerData
  }, [studyContextLayerData])

  useEffect(() => {
    studyContextLayerVisibilityRef.current = studyContextLayerVisibility
  }, [studyContextLayerVisibility])

  useEffect(() => {
    studyContextLayerLoadingRef.current = studyContextLayerLoading
  }, [studyContextLayerLoading])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, currentUser => {
      if (!currentUser) {
        router.push('/data-portal')
        return
      }

      setUser(currentUser)
      fetchLayers()
    })

    return () => unsub()
  }, [router])

  const fetchLayers = async () => {
    try {
      const res = await fetch('/api/mapbox/layers')
      if (!res.ok) throw new Error('Failed to fetch')

      const data = await res.json()
      const saved = typeof window !== 'undefined' ? localStorage.getItem('geo_layers_order') : null
      let layers: MapLayer[] = data.map((layer: MapLayer) => ({ ...layer, visible: false }))

      if (saved) {
        try {
          const order: string[] = JSON.parse(saved)
          const orderIndex = new Map(order.map((id, index) => [id, index]))
          layers = layers.slice().sort((a, b) => {
            const aIndex = orderIndex.has(a.id) ? orderIndex.get(a.id)! : Number.MAX_SAFE_INTEGER
            const bIndex = orderIndex.has(b.id) ? orderIndex.get(b.id)! : Number.MAX_SAFE_INTEGER
            return aIndex - bIndex
          })
        } catch (error) {
          console.warn('Invalid saved layer order', error)
        }
      }

      setExternalLayers(layers)
      setLayerOpacity(previous => {
        const next = { ...previous }
        data.forEach((layer: MapLayer) => {
          if (next[layer.id] === undefined) {
            next[layer.id] = getDefaultOpacity(layer)
          }
        })
        return next
      })
    } catch (error) {
      console.error('Layer fetch error:', error)
    }
  }

  const fetchCropSuitabilityData = async () => {
    try {
      setCropLayerLoading(true)
      setCropLayerError(null)

      const response = await fetch('/api/crops-assessment')
      if (!response.ok) throw new Error('Failed to fetch crop suitability data')

      const data = (await response.json()) as CropLayerApiResponse
      const featureCollection: CropFeatureCollection = {
        type: 'FeatureCollection',
        features: data.features || []
      }

      const legendCrops = Array.isArray(data.topTierCrops) ? data.topTierCrops : []

      setCropLayerData(featureCollection)
      setCropLegendCrops(legendCrops)

      return {
        featureCollection,
        legendCrops
      }
    } catch (error) {
      console.error('Crop suitability fetch error:', error)
      setCropLayerError('Could not load crop suitability results.')
      return null
    } finally {
      setCropLayerLoading(false)
    }
  }

  const fetchStudyContextLayerData = async (layerId: StudyContextLayerId) => {
    if (studyContextLayerDataRef.current[layerId]) {
      return studyContextLayerDataRef.current[layerId]
    }

    if (studyContextLayerLoadingRef.current[layerId]) {
      return null
    }

    const config = STUDY_CONTEXT_LAYER_CONFIGS[layerId]

    try {
      studyContextLayerLoadingRef.current = { ...studyContextLayerLoadingRef.current, [layerId]: true }
      setStudyContextLayerLoading(previous => ({ ...previous, [layerId]: true }))
      setStudyContextLayerErrors(previous => ({ ...previous, [layerId]: null }))

      const response = await fetch(config.filePath)
      if (!response.ok) throw new Error(`Failed to fetch ${config.label}`)

      const data = (await response.json()) as StudyContextFeatureCollection

      setStudyContextLayerData(previous => ({ ...previous, [layerId]: data }))

      const map = mapRef.current
      if (map && map.isStyleLoaded() && studyContextLayerVisibilityRef.current[layerId]) {
        ensureStudyContextLayer(map, layerId, data)
        setStudyContextMapVisibility(map, layerId, true)
      }

      return data
    } catch (error) {
      console.error(`${config.label} fetch error:`, error)
      setStudyContextLayerErrors(previous => ({
        ...previous,
        [layerId]: `Could not load ${config.label.toLowerCase()}.`
      }))
      return null
    } finally {
      studyContextLayerLoadingRef.current = { ...studyContextLayerLoadingRef.current, [layerId]: false }
      setStudyContextLayerLoading(previous => ({ ...previous, [layerId]: false }))
    }
  }

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

    const handleMapClick = (event: mapboxgl.MapMouseEvent) => {
      if (!map.getLayer(CROP_FILL_LAYER_ID)) {
        setSelectedCropField(null)
        return
      }

      const features = map.queryRenderedFeatures(event.point, {
        layers: [CROP_FILL_LAYER_ID]
      }) as mapboxgl.MapboxGeoJSONFeature[]

      if (!features.length) {
        setSelectedCropField(null)
        return
      }

      const targetFeature = features[0]
      const popupProperties = (targetFeature.properties || {}) as Record<string, unknown>
      setSelectedCropField(buildCropPopupData(popupProperties))
    }

    const handleMapMouseMove = (event: mapboxgl.MapMouseEvent) => {
      if (!map.getLayer(CROP_FILL_LAYER_ID)) {
        map.getCanvas().style.cursor = ''
        return
      }

      const hasFeature = map.queryRenderedFeatures(event.point, {
        layers: [CROP_FILL_LAYER_ID]
      }).length > 0

      map.getCanvas().style.cursor = hasFeature ? 'pointer' : ''
    }

    map.on('click', handleMapClick)
    map.on('mousemove', handleMapMouseMove)

    map.on('style.load', () => {
      map.setFog({
        color: 'rgb(186, 210, 235)',
        'high-color': 'rgb(36, 92, 223)',
        'space-color': 'rgb(11, 11, 25)'
      })

      externalLayersRef.current
        .filter(layer => layer.visible)
        .forEach(layer => {
          const opacityValue = layerOpacityRef.current[layer.id] ?? getDefaultOpacity(layer)
          addExternalLayer(map, layer, { flyOnAdd: false, opacity: opacityValue })
        })

      if (studyContextLayerDataRef.current.villagesArea && studyContextLayerVisibilityRef.current.villagesArea) {
        ensureStudyContextLayer(map, 'villagesArea', studyContextLayerDataRef.current.villagesArea)
        setStudyContextMapVisibility(map, 'villagesArea', true)
      }

      if (cropLayerDataRef.current && cropLayerVisibleRef.current) {
        ensureCropSuitabilityLayer(map, cropLayerDataRef.current)
        setCropSuitabilityVisibility(map, true)
      }

      ;(['heatRefugiaGaps', 'riparianGaps', 'streams', 'trees'] as StudyContextLayerId[]).forEach(layerId => {
        const layerData = studyContextLayerDataRef.current[layerId]
        if (!layerData || !studyContextLayerVisibilityRef.current[layerId]) return

        ensureStudyContextLayer(map, layerId, layerData)
        setStudyContextMapVisibility(map, layerId, true)
      })

      setMapLoaded(true)
    })

    mapRef.current = map

    return () => {
      map.getCanvas().style.cursor = ''
      map.off('click', handleMapClick)
      map.off('mousemove', handleMapMouseMove)
      map.remove()
    }
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

    setSelectedCropField(null)
    setMapLoaded(false)
    mapRef.current.setStyle(selected.styleUrl)
  }, [activeBaseStyle])

  useEffect(() => {
    if (!user) return

    void fetchStudyContextLayerData('villagesArea')
  }, [user])

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return

    LOCAL_ANALYSIS_LAYER_RENDER_ORDER.forEach(layerId => {
      const layerData = studyContextLayerData[layerId]
      if (!layerData || !studyContextLayerVisibility[layerId]) return

      ensureStudyContextLayer(mapRef.current!, layerId, layerData)
      setStudyContextMapVisibility(mapRef.current!, layerId, true)
    })
  }, [mapLoaded, studyContextLayerData, studyContextLayerVisibility])

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return
    if (studyContextLayerFittedRef.current) return
    if (!studyContextLayerVisibility.villagesArea || !studyContextLayerData.villagesArea) return

    fitMapToFeatureCollection(mapRef.current, studyContextLayerData.villagesArea)
    studyContextLayerFittedRef.current = true
  }, [mapLoaded, studyContextLayerData.villagesArea, studyContextLayerVisibility.villagesArea])

  const toggleLayer = (layer: MapLayer) => {
    if (!mapRef.current) return

    const map = mapRef.current
    const layerId = `layer-${layer.id}`

    if (!layer.visible) {
      const currentOpacity = layerOpacity[layer.id] ?? getDefaultOpacity(layer)
      addExternalLayer(map, layer, { flyOnAdd: true, opacity: currentOpacity })
      setLayerOpacity(previous => ({ ...previous, [layer.id]: currentOpacity }))
    } else if (map.getLayer(layerId)) {
      map.setLayoutProperty(layerId, 'visibility', 'none')
    }

    setExternalLayers(previous =>
      previous.map(item => (item.id === layer.id ? { ...item, visible: !item.visible } : item))
    )
  }

  const handleLayerOpacityChange = (layer: MapLayer, value: number) => {
    if (!mapRef.current) return

    const normalized = Math.min(1, Math.max(0, value))
    const layerId = `layer-${layer.id}`
    applyLayerOpacity(mapRef.current, layerId, layer.type, normalized)
    setLayerOpacity(previous => ({ ...previous, [layer.id]: normalized }))
  }

  const toggleCropSuitabilityLayer = async () => {
    if (!mapRef.current) return

    const map = mapRef.current
    const nextVisible = !cropLayerVisibleRef.current

    if (!nextVisible) {
      cropLayerVisibleRef.current = false
      setCropLayerVisible(false)
      setCropSuitabilityVisibility(map, false)
      setSelectedCropField(null)
      return
    }

    let cropData = cropLayerDataRef.current
    if (!cropData) {
      const result = await fetchCropSuitabilityData()
      if (!result) return
      cropData = result.featureCollection
    }

    ensureCropSuitabilityLayer(map, cropData)
    setCropSuitabilityVisibility(map, true)
    cropLayerVisibleRef.current = true
    setCropLayerVisible(true)

    if (!cropLayerFittedRef.current) {
      fitMapToFeatureCollection(map, cropData)
      cropLayerFittedRef.current = true
    }
  }

  const toggleStudyContextLayer = async (layerId: StudyContextLayerId) => {
    if (!mapRef.current) return

    const map = mapRef.current
    const nextVisible = !studyContextLayerVisibilityRef.current[layerId]

    if (!nextVisible) {
      const nextState = { ...studyContextLayerVisibilityRef.current, [layerId]: false }
      studyContextLayerVisibilityRef.current = nextState
      setStudyContextLayerVisibility(nextState)
      setStudyContextMapVisibility(map, layerId, false)
      return
    }

    let layerData = studyContextLayerDataRef.current[layerId]
    if (!layerData) {
      const result = await fetchStudyContextLayerData(layerId)
      if (!result) return
      layerData = result
    }

    if (map.isStyleLoaded()) {
      ensureStudyContextLayer(map, layerId, layerData)
      setStudyContextMapVisibility(map, layerId, true)
    }

    const nextState = { ...studyContextLayerVisibilityRef.current, [layerId]: true }
    studyContextLayerVisibilityRef.current = nextState
    setStudyContextLayerVisibility(nextState)

    if (layerId === 'villagesArea' && !studyContextLayerFittedRef.current) {
      fitMapToFeatureCollection(map, layerData)
      studyContextLayerFittedRef.current = true
    }
  }

  const handleDragStart = (id: string) => {
    dragSourceRef.current = id
  }

  const handleDrop = (targetId: string) => {
    const sourceId = dragSourceRef.current
    if (!sourceId || sourceId === targetId) return

    setExternalLayers(previous => {
      const next = previous.slice()
      const sourceIndex = next.findIndex(layer => layer.id === sourceId)
      const targetIndex = next.findIndex(layer => layer.id === targetId)
      if (sourceIndex === -1 || targetIndex === -1) return previous

      const [moved] = next.splice(sourceIndex, 1)
      next.splice(targetIndex, 0, moved)

      try {
        localStorage.setItem('geo_layers_order', JSON.stringify(next.map(layer => layer.id)))
      } catch (error) {
        console.warn('Could not save layer order', error)
      }

      return next
    })

    dragSourceRef.current = null
  }

  if (!user) return null

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-[#0a0a0a] text-white">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-10 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-[#32de84] text-black shadow-lg"
        style={{ left: isCollapsed ? 16 : 304 }}
        aria-label={isCollapsed ? 'Open sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 0 : 320 }}
        className="relative z-20 flex flex-col border-r border-white/10 bg-black/60 backdrop-blur-xl"
        style={{ overflow: isCollapsed ? 'hidden' : 'visible', pointerEvents: isCollapsed ? 'none' : 'auto' }}
        aria-hidden={isCollapsed}
      >
        <div className="flex items-center gap-3 border-b border-white/5 p-6">
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
          <div className="space-y-3 border-b border-white/5 px-4 py-4">
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
                    className={`rounded-lg border px-3 py-2 text-left text-[11px] font-medium transition ${
                      isActive
                        ? 'border-white bg-white text-black'
                        : 'border-white/10 bg-white/5 text-white/60 hover:border-white/30'
                    }`}
                  >
                    <span>{style.name}</span>
                    <span className="block text-[10px] text-white/50">{style.description}</span>
                    <span className="mt-2 block h-1 w-full rounded-full" style={{ backgroundColor: style.accent }} />
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {!isCollapsed && (
          <div className="flex items-center gap-2 px-4 pb-2 pt-4 text-xs uppercase tracking-widest text-white/60">
            <Database size={14} />
            <span>Data Layers</span>
          </div>
        )}

        <div className="custom-scrollbar flex-1 overflow-y-auto p-4" data-lenis-prevent data-lenis-prevent-wheel>
          {externalLayers.length ? (
            externalLayers.map(layer => (
              <LayerRow
                key={layer.id}
                layer={layer}
                toggle={() => toggleLayer(layer)}
                collapsed={isCollapsed}
                opacity={layerOpacity[layer.id] ?? getDefaultOpacity(layer)}
                onOpacityChange={value => handleLayerOpacityChange(layer, value)}
                onDragStart={() => handleDragStart(layer.id)}
                onDrop={() => handleDrop(layer.id)}
              />
            ))
          ) : (
            <p className="mt-10 text-center text-xs text-white/40">No data layers available</p>
          )}

          {!isCollapsed && (
            <div className="mt-5 border-t border-white/10 pt-4">
              <div className="flex items-center gap-2 px-1 text-[11px] uppercase tracking-[0.18em] text-white/60">
                <Layers size={13} />
                <span>Study Context</span>
              </div>

              <div className="mt-2 space-y-2">
                {STUDY_CONTEXT_LAYER_ORDER.map(layerId => {
                  const config = STUDY_CONTEXT_LAYER_CONFIGS[layerId]
                  const isVisible = studyContextLayerVisibility[layerId]
                  const isLoading = studyContextLayerLoading[layerId]
                  const error = studyContextLayerErrors[layerId]
                  const featureCount = studyContextLayerData[layerId]?.features.length

                  return (
                    <div key={layerId}>
                      <button
                        onClick={() => toggleStudyContextLayer(layerId)}
                        disabled={isLoading}
                        className={`w-full rounded-xl border p-3 text-left transition ${
                          isVisible
                            ? 'border-white/20 bg-white/10 text-white'
                            : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
                        } ${isLoading ? 'cursor-not-allowed opacity-60' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="block text-xs font-medium">
                                {isLoading ? `Loading ${config.label}...` : config.label}
                              </span>
                              {config.defaultVisible && (
                                <span className="rounded-full border border-[#32de84]/30 bg-[#32de84]/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#86efac]">
                                  Default On
                                </span>
                              )}
                            </div>
                            <span className="mt-1 block text-[10px] leading-relaxed text-white/50">
                              {config.description}
                            </span>
                            {featureCount ? (
                              <span className="mt-2 block text-[10px] font-medium text-white/35">
                                {featureCount.toLocaleString()} features loaded
                              </span>
                            ) : null}
                          </div>
                          <span
                            className={`mt-1 inline-block h-2.5 w-2.5 rounded-full ${
                              isVisible ? 'bg-[#32de84]' : 'bg-white/20'
                            }`}
                          />
                        </div>
                      </button>
                      {error && <p className="mt-2 px-1 text-[11px] text-red-300">{error}</p>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {!isCollapsed && (
            <div className="mt-5 border-t border-white/10 pt-4">
              <div className="flex items-center gap-2 px-1 text-[11px] uppercase tracking-[0.18em] text-white/60">
                <Layers size={13} />
                <span>Green Space Analysis</span>
              </div>

              <div className="mt-2 space-y-2">
                {GREEN_SPACE_LAYER_ORDER.map(layerId => {
                  const config = STUDY_CONTEXT_LAYER_CONFIGS[layerId]
                  const isVisible = studyContextLayerVisibility[layerId]
                  const isLoading = studyContextLayerLoading[layerId]
                  const error = studyContextLayerErrors[layerId]
                  const featureCount = studyContextLayerData[layerId]?.features.length

                  return (
                    <div key={layerId}>
                      <button
                        onClick={() => toggleStudyContextLayer(layerId)}
                        disabled={isLoading}
                        className={`w-full rounded-xl border p-3 text-left transition ${
                          isVisible
                            ? 'border-white/20 bg-white/10 text-white'
                            : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
                        } ${isLoading ? 'cursor-not-allowed opacity-60' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="block text-xs font-medium">
                              {isLoading ? `Loading ${config.label}...` : config.label}
                            </span>
                            <span className="mt-1 block text-[10px] leading-relaxed text-white/50">
                              {config.description}
                            </span>
                            {featureCount ? (
                              <span className="mt-2 block text-[10px] font-medium text-white/35">
                                {featureCount.toLocaleString()} features loaded
                              </span>
                            ) : null}
                          </div>
                          <span
                            className={`mt-1 inline-block h-2.5 w-2.5 rounded-full ${
                              isVisible ? 'bg-[#32de84]' : 'bg-white/20'
                            }`}
                          />
                        </div>
                      </button>
                      {error && <p className="mt-2 px-1 text-[11px] text-red-300">{error}</p>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {!isCollapsed && (
            <div className="mt-5 border-t border-white/10 pt-4">
              <div className="flex items-center gap-2 px-1 text-[11px] uppercase tracking-[0.18em] text-white/60">
                <Layers size={13} />
                <span>Crop Suitability</span>
              </div>

              <button
                onClick={toggleCropSuitabilityLayer}
                disabled={cropLayerLoading}
                className={`mt-2 w-full rounded-xl border p-3 text-left transition ${
                  cropLayerVisible
                    ? 'border-white/20 bg-white/10 text-white'
                    : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
                } ${cropLayerLoading ? 'cursor-not-allowed opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="block text-xs font-medium">
                      {cropLayerLoading ? 'Loading crop fields...' : 'Field Crop Results'}
                    </span>
                    <span className="mt-1 block text-[10px] leading-relaxed text-white/50">
                      Click any field to open recommendations, seasonal picks, rotation strategy, and all crop
                      suitability scores.
                    </span>
                  </div>
                  <span className={`mt-1 inline-block h-2.5 w-2.5 rounded-full ${cropLayerVisible ? 'bg-[#32de84]' : 'bg-white/20'}`} />
                </div>
              </button>

              {cropLayerVisible && (
                <div className="mt-3 space-y-3 px-1">
                  <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">Display</p>
                    <p className="mt-1 text-xs text-white/75">
                      Polygons are colored by the top tier recommendation. {cropLayerData?.features.length || 0} fields loaded.
                    </p>
                  </div>

                  {cropLegendCrops.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {cropLegendCrops.map(crop => (
                        <span
                          key={crop}
                          className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-medium text-white"
                          style={{ backgroundColor: `${getCropColor(crop)}33` }}
                        >
                          {crop}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {cropLayerError && <p className="mt-2 px-1 text-[11px] text-red-300">{cropLayerError}</p>}
            </div>
          )}
        </div>

        <div className="border-t border-white/5 p-4">
          <button
            onClick={() => signOut(auth)}
            className="flex items-center gap-3 p-2 text-sm text-white/50 hover:text-red-400"
          >
            <LogOut size={16} /> {!isCollapsed && 'Sign Out'}
          </button>
        </div>
      </motion.aside>

      <main className="relative flex-1">
        <div ref={mapContainerRef} className="absolute inset-0 h-full w-full" />
        {selectedCropField && (
          <div className="pointer-events-none absolute inset-0 z-30 p-3 sm:p-4">
            <div
              className="pointer-events-auto ml-auto h-full w-full max-w-[340px] sm:max-w-[360px]"
              data-lenis-prevent
              data-lenis-prevent-wheel
            >
              <CropFieldPanel data={selectedCropField} onClose={() => setSelectedCropField(null)} />
            </div>
          </div>
        )}
        {!mapLoaded && <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">Loading Map...</div>}
      </main>
    </div>
  )
}

const CropFieldPanel = ({ data, onClose }: { data: CropFieldPanelData; onClose: () => void }) => {
  const meta: string[] = []
  if (data.fieldUid) meta.push(`UID ${data.fieldUid}`)
  if (data.areaText) meta.push(data.areaText)

  return (
    <div className="crop-popup h-full" style={{ ['--crop-accent' as string]: data.accentColor }}>
      <div className="crop-popup__card crop-popup__card--panel" data-lenis-prevent data-lenis-prevent-wheel>
        <button type="button" onClick={onClose} className="crop-popup__close" aria-label="Close field details">
          <X size={16} />
        </button>

        <div className="crop-popup__hero">
          <div className="crop-popup__hero-copy">
            <p className="crop-popup__eyebrow">Field {data.fieldId}</p>
            <h3>{data.topCrop}</h3>
            <p className="crop-popup__meta">{meta.join(' • ') || 'Crop suitability summary'}</p>
          </div>
          <div className="crop-popup__hero-score">
            <span>Top Match</span>
            <strong>{formatScore(data.topCropScore)}</strong>
          </div>
        </div>

        {(data.waterTier || data.tierLimitingCrop || data.limitingFactor) && (
          <div className="crop-popup__chip-row">
            {data.waterTier && <span className="crop-popup__chip">{data.waterTier}</span>}
            {data.tierLimitingCrop && (
              <span className="crop-popup__chip">Constraint Crop: {data.tierLimitingCrop}</span>
            )}
            {data.limitingFactor && <span className="crop-popup__chip">{data.limitingFactor}</span>}
          </div>
        )}

        {data.rotationStrategy && (
          <section className="crop-popup__section">
            <p className="crop-popup__section-label">Rotation Strategy</p>
            <div className="crop-popup__strategy">{data.rotationStrategy}</div>
          </section>
        )}

        <section className="crop-popup__section">
          <p className="crop-popup__section-label">Tier Recommendations</p>
          <div className="crop-popup__mini-grid">
            {data.tierRecommendations.length ? (
              data.tierRecommendations.map(recommendation => (
                <article key={`${recommendation.label}-${recommendation.crop}`} className="crop-popup__mini-card">
                  <p className="crop-popup__mini-label">{recommendation.label}</p>
                  <h4>{recommendation.crop || 'NA'}</h4>
                  <span className="crop-popup__mini-score">{formatScore(recommendation.score)}</span>
                </article>
              ))
            ) : (
              <div className="crop-popup__empty">No ranked recommendations available for this field.</div>
            )}
          </div>
        </section>

        <section className="crop-popup__section">
          <p className="crop-popup__section-label">Seasonal Picks</p>
          <div className="crop-popup__season-grid">
            {data.seasonalRecommendations.length ? (
              data.seasonalRecommendations.map(recommendation => (
                <article key={recommendation.season} className="crop-popup__season-card">
                  <p className="crop-popup__mini-label">{recommendation.season}</p>
                  <div className="crop-popup__season-row">
                    <span className="crop-popup__season-key">Best</span>
                    <div className="crop-popup__season-value">
                      <strong>{recommendation.best || 'NA'}</strong>
                      <span className="crop-popup__score-pill crop-popup__score-pill--compact">
                        {formatScore(recommendation.bestScore)}
                      </span>
                    </div>
                  </div>
                  <div className="crop-popup__season-row">
                    <span className="crop-popup__season-key">Second</span>
                    <div className="crop-popup__season-value">
                      <strong>{recommendation.second || 'NA'}</strong>
                      <span className="crop-popup__score-pill crop-popup__score-pill--compact">
                        {formatScore(recommendation.secondScore)}
                      </span>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="crop-popup__empty">No seasonal recommendation data available.</div>
            )}
          </div>
        </section>

        {(data.tierLimitingCrop || data.limitingFactor) && (
          <section className="crop-popup__section">
            <p className="crop-popup__section-label">Constraints</p>
            <div className="crop-popup__constraint">
              <div>
                <strong>{data.tierLimitingCrop || 'Primary constraint'}</strong>
                <span>{data.limitingFactor || 'No limiting factor provided'}</span>
              </div>
              <span className="crop-popup__score-pill">{formatScore(data.tierLimitingScore)}</span>
            </div>
          </section>
        )}

        <section className="crop-popup__section">
          <p className="crop-popup__section-label">All Crop Suitability</p>
          <div className="crop-popup__suitability-list">
            {data.cropSuitability.length ? (
              data.cropSuitability.map(item => (
                <div key={item.crop} className="crop-popup__suitability-row">
                  <div className="crop-popup__suitability-copy">
                    <strong>{item.crop}</strong>
                    <span>{item.classification || 'No class provided'}</span>
                  </div>
                  <span className="crop-popup__score-pill">{formatScore(item.score)}</span>
                </div>
              ))
            ) : (
              <div className="crop-popup__empty">No crop suitability scores available.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

const LayerRow = ({ layer, toggle, collapsed, opacity, onOpacityChange, onDragStart, onDrop }: LayerRowProps) => {
  const [localOpacity, setLocalOpacity] = useState(opacity)

  useEffect(() => {
    setLocalOpacity(opacity)
  }, [opacity])

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value)
    setLocalOpacity(newValue)
    onOpacityChange(newValue)
  }

  return (
    <div
      className="mb-2"
      draggable
      onDragStart={event => {
        event.dataTransfer?.setData('text/plain', layer.id)
        event.dataTransfer!.effectAllowed = 'move'
        onDragStart?.(layer.id)
      }}
      onDragOver={event => {
        event.preventDefault()
        event.dataTransfer!.dropEffect = 'move'
      }}
      onDrop={event => {
        event.preventDefault()
        onDrop?.(layer.id)
      }}
    >
      <button
        onClick={() => toggle(layer)}
        className={`w-full rounded-lg transition-all ${
          collapsed ? 'flex justify-center p-2' : 'flex justify-between p-3 hover:bg-white/5'
        } ${layer.visible ? 'bg-white/5' : ''}`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={`h-2 w-2 rounded-full ${layer.visible ? 'bg-[#32de84]' : 'bg-white/10'}`} />
          {!collapsed && <span className="truncate text-xs text-white/80">{layer.name || layer.id}</span>}
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
