import { useEffect, useRef, useState } from 'react';
import { MapContainer } from 'react-leaflet';
import L from 'leaflet';

interface MapWrapperProps {
  center: [number, number];
  zoom: number;
  children?: React.ReactNode;
}

/**
 * Wrapper para MapContainer que previne erros do Leaflet
 * Usa ID único para garantir que cada mapa tenha seu próprio container
 */
export default function MapWrapper({ center, zoom, children }: MapWrapperProps) {
  const [isReady, setIsReady] = useState(false);
  const [mapId] = useState(() => `map-${Math.random().toString(36).substr(2, 9)}`);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const cleanupDoneRef = useRef(false);

  useEffect(() => {
    // Delay para garantir DOM estável
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 150);

    return () => {
      clearTimeout(timer);
      
      // Previne múltiplas execuções do cleanup
      if (cleanupDoneRef.current) return;
      cleanupDoneRef.current = true;
      
      // Cleanup completo do mapa ao desmontar
      if (mapInstanceRef.current) {
        try {
          // Remove todos os event listeners
          mapInstanceRef.current.off();
          // Remove o mapa
          mapInstanceRef.current.remove();
        } catch (e) {
          // Ignora erros de cleanup
        } finally {
          mapInstanceRef.current = null;
        }
      }
      
      // Limpa o container DOM diretamente
      if (containerRef.current) {
        try {
          const leafletContainer = containerRef.current.querySelector('.leaflet-container');
          if (leafletContainer) {
            leafletContainer.remove();
          }
        } catch (e) {
          // Ignora erros de limpeza DOM
        }
      }
    };
  }, []);

  if (!isReady) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full" id={mapId}>
      <MapContainer
        key={mapId}
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
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
