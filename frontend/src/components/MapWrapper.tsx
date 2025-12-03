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
 * Garante que o mapa seja montado corretamente e limpo ao desmontar
 */
export default function MapWrapper({ center, zoom, children }: MapWrapperProps) {
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Previne inicialização dupla
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Delay para garantir DOM estável
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => {
      clearTimeout(timer);
      
      // Cleanup completo do mapa ao desmontar
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.off();
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn('Erro ao remover mapa:', e);
        }
        mapInstanceRef.current = null;
      }
      
      // Limpa o container DOM
      if (containerRef.current) {
        const container = containerRef.current.querySelector('.leaflet-container');
        if (container && container.parentNode) {
          container.parentNode.removeChild(container);
        }
      }
      
      hasInitialized.current = false;
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
    <div ref={containerRef} className="w-full h-full" key="map-container">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        whenReady={() => {
          // Mapa pronto para uso
        }}
        ref={(mapInstance) => {
          if (mapInstance && !mapInstanceRef.current) {
            mapInstanceRef.current = mapInstance;
          }
        }}
      >
        {children}
      </MapContainer>
    </div>
  );
}
