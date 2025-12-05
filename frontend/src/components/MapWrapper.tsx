import { useEffect, useRef, useMemo } from 'react';
import { MapContainer } from 'react-leaflet';
import L from 'leaflet';

interface MapWrapperProps {
  center: [number, number];
  zoom: number;
  children?: React.ReactNode;
}

/**
 * Wrapper para MapContainer que previne erros do Leaflet
 * Usa estratégia de never-rerender para evitar insertBefore
 */
export default function MapWrapper({ center, zoom, children }: MapWrapperProps) {
  const mapInstanceRef = useRef<L.Map | null>(null);
  const hasInitializedRef = useRef(false);
  
  // ID único fixo para este componente - nunca muda
  const mapId = useMemo(() => `map-${Math.random().toString(36).substr(2, 9)}`, []);
  
  // Center e zoom fixos - nunca mudam após primeira renderização
  const initialCenter = useMemo(() => center, []);
  const initialZoom = useMemo(() => zoom, []);

  useEffect(() => {
    hasInitializedRef.current = true;
    
    return () => {
      // Cleanup ao desmontar
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.off();
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        } catch (e) {
          console.warn('Erro ao limpar mapa:', e);
        }
      }
    };
  }, []);

  // Previne re-renders desnecessários
  if (hasInitializedRef.current && mapInstanceRef.current) {
    // Atualiza a view do mapa se center/zoom mudarem, mas sem re-render
    if (center[0] !== initialCenter[0] || center[1] !== initialCenter[1] || zoom !== initialZoom) {
      try {
        mapInstanceRef.current.setView(center, zoom, { animate: true });
      } catch (e) {
        console.warn('Erro ao atualizar view:', e);
      }
    }
  }

  return (
    <div className="w-full h-full" id={mapId}>
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        zoomControl={true}
        ref={(map) => {
          if (map && !mapInstanceRef.current) {
            mapInstanceRef.current = map;
          }
        }}
      >
        {children}
      </MapContainer>
    </div>
  );
}
