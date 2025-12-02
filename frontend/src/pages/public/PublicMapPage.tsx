import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, Leaf, MapPin, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import MapWrapper from '@/components/MapWrapper';
import { pontosService, PontoColeta } from '@/services/pontosService';

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
const createCustomIcon = (color: string, emoji: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 3px 10px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
      ">${emoji}</div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

const iconPendente = createCustomIcon('#FF6D00', '🗑️'); // Laranja com lixeira
const iconEmAndamento = createCustomIcon('#FFC107', '🚛'); // Amarelo com caminhão
const iconConcluido = createCustomIcon('#4CAF50', '✅'); // Verde com check

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

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'pendente':
      return {
        label: 'Aguardando Coleta',
        color: 'bg-orange-100 text-orange-700 border-orange-300',
        icon: AlertCircle,
      };
    case 'em_andamento':
      return {
        label: 'Coleta em Andamento',
        color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        icon: Clock,
      };
    case 'concluido':
      return {
        label: 'Coleta Realizada',
        color: 'bg-green-100 text-green-700 border-green-300',
        icon: CheckCircle,
      };
    default:
      return {
        label: status,
        color: 'bg-gray-100 text-gray-700 border-gray-300',
        icon: MapPin,
      };
  }
};

// Função para estimar próxima coleta (simplificado - em produção usar dados reais)
const getProximaColeta = (status: string) => {
  const hoje = new Date();
  if (status === 'concluido') {
    // Próxima coleta em 7 dias
    const proxima = new Date(hoje);
    proxima.setDate(proxima.getDate() + 7);
    return proxima;
  } else if (status === 'em_andamento') {
    return new Date(); // Hoje
  } else {
    // Pendente - próximos 2 dias
    const proxima = new Date(hoje);
    proxima.setDate(proxima.getDate() + 2);
    return proxima;
  }
};

const PublicMapPage = () => {
  const [pontos, setPontos] = useState<PontoColeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

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
    // Carregar pontos com timeout para evitar bloqueio
    const timeoutId = setTimeout(() => {
      carregarPontos();
    }, 100);

    // Tentar obter localização do usuário (sem bloquear)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log('Não foi possível obter localização:', error);
        },
        { timeout: 5000, maximumAge: 60000 }
      );
    }

    return () => clearTimeout(timeoutId);
  }, []);

  const pontosFiltrados = pontos.filter(
    (ponto) => filtroStatus === 'todos' || ponto.status === filtroStatus
  );

  // Centro de Itacoatiara - useMemo para evitar re-renders do mapa
  const center: [number, number] = useMemo(() => 
    userLocation || [-3.1431, -58.4442], 
    [userLocation]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verde-escuro mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando mapa de coletas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-verde-escuro text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Leaf className="h-6 w-6 text-verde-escuro" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Próximas Coletas na sua Região</h1>
                <p className="text-sm text-verde-claro">Itacoatiara - AM</p>
              </div>
            </div>
            <Link to="/">
              <Button variant="outline" className="bg-white text-verde-escuro hover:bg-green-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Filtros */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">Filtrar por:</span>
            <button
              onClick={() => setFiltroStatus('todos')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroStatus === 'todos'
                  ? 'bg-verde-escuro text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos ({pontos.length})
            </button>
            <button
              onClick={() => setFiltroStatus('pendente')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroStatus === 'pendente'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🗑️ Aguardando ({pontos.filter((p) => p.status === 'pendente').length})
            </button>
            <button
              onClick={() => setFiltroStatus('em_andamento')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroStatus === 'em_andamento'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🚛 Em Andamento ({pontos.filter((p) => p.status === 'em_andamento').length})
            </button>
            <button
              onClick={() => setFiltroStatus('concluido')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroStatus === 'concluido'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ✅ Concluído ({pontos.filter((p) => p.status === 'concluido').length})
            </button>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div className="flex-1 relative">
        <MapWrapper key="public-map" center={center} zoom={14}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Localização do usuário */}
          {userLocation && (
            <>
              <Circle
                center={userLocation}
                radius={500}
                pathOptions={{
                  color: '#1976D2',
                  fillColor: '#1976D2',
                  fillOpacity: 0.1,
                }}
              />
              <Marker
                position={userLocation}
                icon={L.divIcon({
                  className: 'user-location',
                  html: `
                    <div style="
                      background-color: #1976D2;
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      border: 3px solid white;
                      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    "></div>
                  `,
                  iconSize: [20, 20],
                  iconAnchor: [10, 10],
                })}
              >
                <Popup>
                  <div className="p-2">
                    <p className="font-semibold text-blue-600">📍 Você está aqui</p>
                  </div>
                </Popup>
              </Marker>
            </>
          )}

          {/* Pontos de coleta */}
          {pontosFiltrados.map((ponto) => {
            const statusInfo = getStatusInfo(ponto.status);
            const StatusIcon = statusInfo.icon;
            const proximaColeta = getProximaColeta(ponto.status);

            return (
              <Marker
                key={ponto._id}
                position={[ponto.latitude, ponto.longitude]}
                icon={getIconByStatus(ponto.status)}
              >
                <Popup maxWidth={300}>
                  <div className="p-3">
                    <h3 className="font-bold text-lg mb-2 text-verde-escuro flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {ponto.nomePonto}
                    </h3>

                    <div className="space-y-2 text-sm mb-3">
                      <p>
                        <strong>Endereço:</strong> {ponto.logradouro}
                      </p>
                      <p>
                        <strong>Bairro:</strong> {ponto.bairro}
                      </p>
                    </div>

                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${statusInfo.color} mb-3`}>
                      <StatusIcon className="h-4 w-4" />
                      <span className="font-semibold text-sm">{statusInfo.label}</span>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold text-sm text-blue-900">Próxima Coleta:</span>
                      </div>
                      <p className="text-blue-700 font-medium">
                        {proximaColeta.toLocaleDateString('pt-BR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                        })}
                      </p>
                      {ponto.status === 'em_andamento' && (
                        <p className="text-xs text-blue-600 mt-1">🚛 Caminhão a caminho!</p>
                      )}
                    </div>

                    {ponto.coletorId && (
                      <p className="text-xs text-gray-600 mb-2">
                        <strong>Coletor:</strong> {ponto.coletorId.name}
                      </p>
                    )}

                    <a
                      href={`/checkin/${ponto._id}`}
                      className="block bg-laranja hover:bg-laranja-hover text-white text-center py-2 px-4 rounded-lg font-semibold text-sm transition-colors"
                    >
                      Ver Detalhes
                    </a>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapWrapper>
      </div>

      {/* Legenda flutuante */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs z-[1000]">
        <h3 className="font-bold text-sm mb-3 text-gray-800">Legenda do Mapa</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-lg">🗑️</span>
            <span className="text-gray-700">Aguardando Coleta</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🚛</span>
            <span className="text-gray-700">Coleta em Andamento</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <span className="text-gray-700">Coleta Realizada</span>
          </div>
          {userLocation && (
            <div className="flex items-center gap-2 pt-2 border-t">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">Sua Localização</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicMapPage;
