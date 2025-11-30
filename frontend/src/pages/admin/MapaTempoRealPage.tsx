import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { pontosService, PontoColeta, EstatisticasPontos } from '../../services/pontosService';

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

export default function MapaTempoReal() {
  const [pontos, setPontos] = useState<PontoColeta[]>([]);
  const [estatisticas, setEstatisticas] = useState<EstatisticasPontos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<Date>(new Date());

  const carregarDados = async () => {
    try {
      const [pontosData, statsData] = await Promise.all([
        pontosService.listarPontos(),
        pontosService.buscarEstatisticas(),
      ]);
      setPontos(pontosData);
      setEstatisticas(statsData);
      setUltimaAtualizacao(new Date());
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados do mapa');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Carregar dados inicial com delay
    const timeoutId = setTimeout(() => {
      carregarDados();
    }, 100);

    // Atualizar automaticamente a cada 8 segundos
    const interval = setInterval(() => {
      carregarDados();
    }, 8000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 200px)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verde-escuro mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando mapa em tempo real...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 200px)' }}>
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded">
          {error}
        </div>
      </div>
    );
  }

  // Centro de Itacoatiara
  const center: [number, number] = [-3.1431, -58.4442];

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
      {/* Header com estatísticas */}
      <div className="bg-white shadow-md border-b p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-verde-escuro">Mapa em Tempo Real</h1>
            <p className="text-sm text-gray-600">
              Última atualização: {ultimaAtualizacao.toLocaleTimeString('pt-BR')}
              <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            </p>
          </div>

          {estatisticas && (
            <div className="flex gap-4">
              <div className="bg-orange-50 px-4 py-2 rounded-lg">
                <p className="text-xs text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-orange-600">{estatisticas.pendentes}</p>
              </div>
              <div className="bg-yellow-50 px-4 py-2 rounded-lg">
                <p className="text-xs text-gray-600">Em Andamento</p>
                <p className="text-2xl font-bold text-yellow-600">{estatisticas.emAndamento}</p>
              </div>
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <p className="text-xs text-gray-600">Concluídos</p>
                <p className="text-2xl font-bold text-green-600">{estatisticas.concluidos}</p>
              </div>
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <p className="text-xs text-gray-600">% Concluído</p>
                <p className="text-2xl font-bold text-blue-600">{estatisticas.percentualConcluido}%</p>
              </div>
            </div>
          )}
        </div>

        {/* Legenda */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t">
          <h2 className="font-semibold text-gray-700">Legenda:</h2>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-white shadow"></div>
            <span className="text-sm">Pendente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white shadow"></div>
            <span className="text-sm">Em Andamento</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow"></div>
            <span className="text-sm">Concluído</span>
          </div>
          <button
            onClick={carregarDados}
            className="ml-auto bg-verde-escuro hover:bg-verde-medio text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            🔄 Atualizar Agora
          </button>
        </div>
      </div>

      {/* Mapa */}
      <div className="flex-1 relative">
        <MapContainer
          center={center}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
        >
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
                <div className="p-2 min-w-[200px]">
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
                  <p className="text-xs text-gray-400 mt-2">
                    Última atualização: {new Date(ponto.updatedAt).toLocaleString('pt-BR')}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
