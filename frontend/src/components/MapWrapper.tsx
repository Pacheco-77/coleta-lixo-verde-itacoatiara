import { useEffect, useRef, memo } from 'react';
import { MapContainer } from 'react-leaflet';
import L from 'leaflet';

interface MapWrapperProps {
  center: [number, number];
  zoom: number;
  children?: React.ReactNode;
}

/**
 * Wrapper para MapContainer que previne erros do Leaflet
 * Usa React.memo para evitar re-renders desnecessários
 * Usa refs para gerenciar estado sem causar re-renders
 */
const MapWrapper = memo(function MapWrapper({ center, zoom, children }: MapWrapperProps) {
  const mapInstanceRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // ID único fixo - gerado uma única vez
  const mapIdRef = useRef(`map-${Math.random().toString(36).substr(2, 9)}`);
  
  // Center e zoom iniciais - salvos na primeira renderização
  const initialCenterRef = useRef(center);
  const initialZoomRef = useRef(zoom);

  useEffect(() => {
    // Atualiza view do mapa se center/zoom mudarem
    if (mapInstanceRef.current) {
      const currentCenter = mapInstanceRef.current.getCenter();
      const currentZoom = mapInstanceRef.current.getZoom();
      
      if (Math.abs(currentCenter.lat - center[0]) > 0.0001 || 
          Math.abs(currentCenter.lng - center[1]) > 0.0001 || 
          currentZoom !== zoom) {
        mapInstanceRef.current.setView(center, zoom, { animate: true });
      }
    }
  }, [center, zoom]);

  useEffect(() => {
    // Cleanup ao desmontar
    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.off();
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        } catch (e) {
          // Silenciosamente ignora erros de cleanup
        }
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full" 
      id={mapIdRef.current}
      suppressHydrationWarning
    >
      <MapContainer
        center={initialCenterRef.current}
        zoom={initialZoomRef.current}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        zoomControl={true}
        whenCreated={(map) => {
          mapInstanceRef.current = map;
        }}
      >
        {children}
      </MapContainer>
    </div>
  );
});

export default MapWrapper;
