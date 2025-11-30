import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pontosService, PontoColeta } from '../../services/pontosService';
import { CheckCircle, MapPin, Navigation } from 'lucide-react';

export default function CheckInPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ponto, setPonto] = useState<PontoColeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processando, setProcessando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    if (id) {
      carregarPonto();
    }
  }, [id]);

  const carregarPonto = async () => {
    try {
      setLoading(true);
      const data = await pontosService.buscarPonto(id!);
      setPonto(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar ponto:', err);
      setError('Ponto de coleta não encontrado');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!ponto) return;

    try {
      setProcessando(true);
      
      // Pegar ID do coletor do localStorage (simulação - em produção usar auth real)
      const coletorId = localStorage.getItem('coletorId') || 'coletor-temporario-123';
      
      await pontosService.registrarCheckIn(ponto._id, coletorId);
      
      setSucesso(true);
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/mapa-coleta');
      }, 2000);
    } catch (err) {
      console.error('Erro ao registrar check-in:', err);
      setError('Erro ao registrar coleta. Tente novamente.');
    } finally {
      setProcessando(false);
    }
  };

  const abrirNoGoogleMaps = () => {
    if (!ponto) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${ponto.latitude},${ponto.longitude}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-verde-escuro to-verde-medio flex items-center justify-center p-4">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-xl">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !ponto) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-400 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-red-600 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Erro</h1>
          <p className="text-gray-600 mb-6">{error || 'Ponto não encontrado'}</p>
          <button
            onClick={() => navigate('/mapa-coleta')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Voltar ao Mapa
          </button>
        </div>
      </div>
    );
  }

  if (sucesso) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-verde-escuro to-verde-medio flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-green-600 text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Check-in Realizado!</h1>
          <p className="text-gray-600 mb-2">Ponto de coleta registrado com sucesso</p>
          <p className="text-sm text-gray-500">Redirecionando para o mapa...</p>
        </div>
      </div>
    );
  }

  const getStatusInfo = () => {
    switch (ponto.status) {
      case 'pendente':
        return {
          label: 'Pendente',
          color: 'bg-orange-500',
          textColor: 'text-orange-600',
        };
      case 'em_andamento':
        return {
          label: 'Em Andamento',
          color: 'bg-yellow-500',
          textColor: 'text-yellow-600',
        };
      case 'concluido':
        return {
          label: 'Concluído',
          color: 'bg-green-500',
          textColor: 'text-green-600',
        };
      default:
        return {
          label: ponto.status,
          color: 'bg-gray-500',
          textColor: 'text-gray-600',
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-verde-escuro to-verde-medio flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-verde-escuro text-white p-6 text-center">
          <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
            <MapPin className="h-10 w-10 text-verde-escuro" />
          </div>
          <h1 className="text-2xl font-bold">Check-in de Coleta</h1>
          <p className="text-verde-claro mt-1 text-sm">Registre sua chegada ao ponto</p>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          {/* Informações do Ponto */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h2 className="text-xl font-bold text-verde-escuro">{ponto.nomePonto}</h2>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700">{ponto.logradouro}</p>
                  <p className="text-gray-500">{ponto.bairro}</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color} text-white`}>
                {statusInfo.label}
              </span>
            </div>
          </div>

          {/* Botão Google Maps */}
          <button
            onClick={abrirNoGoogleMaps}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Navigation className="h-5 w-5" />
            Abrir no Google Maps
          </button>

          {/* Botão Check-in */}
          <button
            onClick={handleCheckIn}
            disabled={processando || ponto.status === 'concluido'}
            className={`w-full py-4 px-6 rounded-lg font-bold text-xl flex items-center justify-center gap-3 transition-all transform hover:scale-105 ${
              ponto.status === 'concluido'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : processando
                ? 'bg-laranja opacity-70 cursor-wait'
                : 'bg-laranja hover:bg-laranja-hover text-white shadow-lg'
            }`}
          >
            <CheckCircle className="h-8 w-8" />
            {processando
              ? 'Registrando...'
              : ponto.status === 'concluido'
              ? 'Já Concluído'
              : 'Registrar Check-in'}
          </button>

          {ponto.status === 'concluido' && ponto.concluidoEm && (
            <p className="text-center text-sm text-gray-500">
              Concluído em {new Date(ponto.concluidoEm).toLocaleString('pt-BR')}
            </p>
          )}

          {/* Botão Voltar */}
          <button
            onClick={() => navigate('/mapa-coleta')}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-colors"
          >
            Voltar ao Mapa
          </button>
        </div>
      </div>
    </div>
  );
}
