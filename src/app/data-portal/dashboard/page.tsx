"use client"

import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, signOut,User } from 'firebase/auth'
import { auth } from '@/lib/firebaseClient'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Plus_Jakarta_Sans } from "next/font/google"
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, LogOut, Database } from 'lucide-react'

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
  center?: [number, number]
}

interface LayerRowProps {
  layer: MapLayer
  toggle: (layer: MapLayer) => void
  collapsed: boolean
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''

const Dashboard = () => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  
  const [externalLayers, setExternalLayers] = useState<MapLayer[]>([])
  const [mapLoaded, setMapLoaded] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

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

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/uzairkashif27/cmeihge9s000n01s8dpym8rdv",
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
    });

    map.on('load', () => {
      setMapLoaded(true);
    })

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

  // 3. Toggle Logic (The Engine)
  const toggleLayer = (layer: MapLayer) => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    
    // --- External Tilesets (Data) ---
    const sourceId = `source-${layer.id}`;
    const layerId = `layer-${layer.id}`;

    if (!layer.visible) {
      // TURN ON
      if (!map.getSource(sourceId) && layer.sourceUrl) {
         map.addSource(sourceId, {
           type: layer.type === 'raster' ? 'raster' : 'vector',
           url: layer.sourceUrl,
           tileSize: 256
         });
      }

      if (!map.getLayer(layerId)) {
        if (layer.type === 'raster') {
          // RASTER / TIFF
          map.addLayer({
            id: layerId,
            type: 'raster',
            source: sourceId,
            paint: { 'raster-opacity': 0.8 }
          });
        } else {
          // VECTOR
          // Attempt to guess the source-layer name (usually the last part of ID)
          const sourceLayerName = layer.id.split('.').pop() || ''; 
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
          });
        }
      }
      map.setLayoutProperty(layerId, 'visibility', 'visible');
    
      if (layer.center) map.flyTo({ center: layer.center, zoom: 9 });
      
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