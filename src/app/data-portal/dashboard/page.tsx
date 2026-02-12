"use client"

import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, signOut,User } from 'firebase/auth'
import { auth } from '@/lib/firebaseClient'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Plus_Jakarta_Sans } from "next/font/google"
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, LogOut, Layers, Database } from 'lucide-react'

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

interface MapLayer {
  id: string
  name?: string
  type: 'style' | 'vector' | 'raster'
  visible: boolean
  sourceUrl?: string
  center?: [number, number]
}

interface TabButtonProps {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
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
  
  const [styleLayers, setStyleLayers] = useState<MapLayer[]>([])
  const [externalLayers, setExternalLayers] = useState<MapLayer[]>([])
  const [mapLoaded, setMapLoaded] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState<'style' | 'data'>('style')

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
      const existing = map.getStyle().layers || [];
      setStyleLayers(existing.map(l => ({
        id: l.id,
        name: l.id,
        type: 'style',
        visible: map.getLayoutProperty(l.id, 'visibility') !== 'none'
      })));
      setMapLoaded(true);
    })

    mapRef.current = map
    return () => map.remove()
  }, [user])

  // 3. Toggle Logic (The Engine)
  const toggleLayer = (layer: MapLayer) => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    
    // --- Internal Style Layers ---
    if (layer.type === 'style') {
      const nextState = layer.visible ? 'none' : 'visible';
      map.setLayoutProperty(layer.id, 'visibility', nextState);
      setStyleLayers(prev => prev.map(l => l.id === layer.id ? { ...l, visible: !l.visible } : l));
      return;
    }

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
    <div className={`flex h-screen w-full bg-[#0a0a0a] text-white overflow-hidden ${plusJakartaSans.className}`}>
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? '80px' : '320px' }}
        className="relative bg-black/60 backdrop-blur-xl border-r border-white/10 flex flex-col z-20"
      >
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-10 w-6 h-6 bg-[#32de84] rounded-full flex items-center justify-center text-black z-30"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#32de84] rounded-lg flex items-center justify-center font-bold text-black text-xs">GK</div>
          {!isCollapsed && <span className="font-semibold">GeoKits</span>}
        </div>

        {!isCollapsed && (
          <div className="flex p-4 gap-2">
            <TabButton active={activeTab === 'style'} onClick={() => setActiveTab('style')} icon={<Layers size={14} />} label="Base" />
            <TabButton active={activeTab === 'data'} onClick={() => setActiveTab('data')} icon={<Database size={14} />} label="Data" />
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {activeTab === 'style' && styleLayers.map(l => (
            <LayerRow key={l.id} layer={l} toggle={toggleLayer} collapsed={isCollapsed} />
          ))}
          {activeTab === 'data' && externalLayers.map(l => (
            <LayerRow key={l.id} layer={l} toggle={toggleLayer} collapsed={isCollapsed} />
          ))}
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

const TabButton = ({ active, onClick, icon, label }: TabButtonProps) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-medium transition-all ${active ? 'bg-[#32de84] text-black' : 'bg-white/5 text-white/50'}`}
  >
    {icon} {label}
  </button>
)

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