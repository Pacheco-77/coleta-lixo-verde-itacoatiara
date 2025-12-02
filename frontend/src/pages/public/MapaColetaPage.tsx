import { useEffect, useState, useMemo } from 'react';
import { TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapWrapper from '../../components/MapWrapper';
import { pontosService, PontoColeta } from '../../services/pontosService';

// Fix do ícone padrão do Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Criar ícones personalizados por status
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const iconPendente = createCustomIcon('#FF6D00'); // Laranja
const iconEmAndamento = createCustomIcon('#FFC107'); // Amarelo
const iconConcluido = createCustomIcon('#4CAF50'); // Verde

const getIconByStatus = (status: string) => {
  switch (status) {
    case 'pendente':
      return iconPendente;
    case 'em_andamento':
      return iconEmAndamento;
    case 'concluido':
      return iconConcluido;
    default:
      return iconPendente;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pendente':
      return 'Pendente';
    case 'em_andamento':
      return 'Em Andamento';
    case 'concluido':
      return 'Concluído';
    default:
      return status;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pendente':
      return 'text-orange-600 bg-orange-100';
    case 'em_andamento':
      return 'text-yellow-600 bg-yellow-100';
    case 'concluido':
      return 'text-green-600 bg-green-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export default function MapaColeta() {
  const [pontos, setPontos] = useState<PontoColeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarPontos = async () => {
    try {
      setLoading(true);
      const data = await pontosService.listarPontos();
      setPontos(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar pontos:', err);
      setError('Erro ao carregar pontos de coleta');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Carregar pontos com delay para evitar timeout
    const timeoutId = setTimeout(() => {
      carregarPontos();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verde-escuro mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded">
          {error}
        </div>
      </div>
    );
  }

  // Centro de Itacoatiara - useMemo para evitar re-renders
  const center: [number, number] = useMemo(() => [-3.1431, -58.4442], []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-verde-escuro text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Mapa de Coleta - Itacoatiara</h1>
          <p className="text-verde-claro mt-2">
            Acompanhe em tempo real os pontos de coleta de lixo na cidade
          </p>
        </div>
      </header>

      {/* Legenda */}
      <div className="bg-white shadow-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-6">
            <h2 className="font-semibold text-gray-700">Legenda:</h2>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-white shadow"></div>
              <span className="text-sm">Pendente ({pontos.filter(p => p.status === 'pendente').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white shadow"></div>
              <span className="text-sm">Em Andamento ({pontos.filter(p => p.status === 'em_andamento').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow"></div>
              <span className="text-sm">Concluído ({pontos.filter(p => p.status === 'concluido').length})</span>
            </div>
            <div className="ml-auto">
              <span className="text-sm font-medium">Total: {pontos.length} pontos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 250px)' }}>
          <MapWrapper key="mapa-coleta" center={center} zoom={14}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {pontos.map((ponto) => (
              <Marker
                key={ponto._id}
                position={[ponto.latitude, ponto.longitude]}
                icon={getIconByStatus(ponto.status)}
              >
                <Popup>
                  <div className="p-2 min-w-[220px]">
                    <h3 className="font-bold text-lg mb-2 text-verde-escuro">
                      {ponto.nomePonto}
                    </h3>
                    <div className="space-y-1 text-sm mb-3">
                      <p><strong>Endereço:</strong> {ponto.logradouro}</p>
                      <p><strong>Bairro:</strong> {ponto.bairro}</p>
                    </div>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ponto.status)}`}>
                      {getStatusLabel(ponto.status)}
                    </div>
                    {ponto.coletorId && (
                      <p className="text-xs text-gray-600 mt-2">
                        <strong>Coletor:</strong> {ponto.coletorId.name}
                      </p>
                    )}
                    {ponto.concluidoEm && (
                      <p className="text-xs text-gray-600 mt-1">
                        <strong>Concluído em:</strong>{' '}
                        {new Date(ponto.concluidoEm).toLocaleString('pt-BR')}
                      </p>
                    )}
                    <a
                      href={`/checkin/${ponto._id}`}
                      className="block mt-3 bg-laranja hover:bg-laranja-hover text-white text-center py-2 px-4 rounded-lg font-semibold text-sm transition-colors"
                    >
                      Fazer Check-in
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapWrapper>
        </div>
      </div>
    </div>
  );
}
