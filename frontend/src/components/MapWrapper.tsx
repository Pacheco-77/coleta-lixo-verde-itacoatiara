import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

interface MapWrapperProps {
  center: [number, number];
  zoom: number;
  children?: React.ReactNode;
}

/**
 * Wrapper para MapContainer que previne o erro insertBefore
 * ao garantir que o mapa só é montado uma vez e com DOM estável
 */
export default function MapWrapper({ center, zoom, children }: MapWrapperProps) {
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Delay para garantir DOM estável
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => {
      clearTimeout(timer);
      // Cleanup do mapa ao desmontar
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
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
    <div ref={containerRef} className="w-full h-full">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        ref={(mapInstance) => {
          if (mapInstance) {
            mapInstanceRef.current = mapInstance;
          }
        }}
      >
        {children}
      </MapContainer>
    </div>
  );
}
