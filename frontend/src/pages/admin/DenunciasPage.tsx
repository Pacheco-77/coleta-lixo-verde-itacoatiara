import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { AlertCircle, Eye, CheckCircle, XCircle, MapPin, X } from 'lucide-react';
import { toast } from 'sonner';

interface Denuncia {
  id: number;
  titulo: string;
  descricao: string;
  localizacao: string;
  status: 'pendente' | 'em-andamento' | 'resolvida' | 'rejeitada';
  data: string;
  denunciante: string;
  prioridade: 'alta' | 'media' | 'baixa';
}

const DenunciasPage = () => {
  const [filtro, setFiltro] = useState('todas');
  const [denunciaModal, setDenunciaModal] = useState<Denuncia | null>(null);
  const [modalAcao, setModalAcao] = useState<'ver' | 'resolver' | 'rejeitar' | null>(null);
  const [observacao, setObservacao] = useState('');

  const [denuncias, setDenuncias] = useState<Denuncia[]>([
    {
      id: 1,
      titulo: 'Lixo acumulado na Rua das Flores',
      descricao: 'Grande quantidade de lixo verde acumulado há mais de uma semana',
      localizacao: 'Rua das Flores, 456 - Centro',
      status: 'pendente',
      data: '28/11/2024',
      denunciante: 'João Silva',
      prioridade: 'alta',
    },
    {
      id: 2,
      titulo: 'Ponto de coleta danificado',
      descricao: 'Container de coleta está danificado e vazando',
      localizacao: 'Av. Principal, 789 - Bairro Novo',
      status: 'em-andamento',
      data: '27/11/2024',
      denunciante: 'Maria Santos',
      prioridade: 'media',
    },
    {
      id: 3,
      titulo: 'Descarte irregular de galhos',
      descricao: 'Galhos de árvores grandes descartados na via pública',
      localizacao: 'Rua Verde, 123 - Jardim',
      status: 'resolvida',
      data: '25/11/2024',
      denunciante: 'Pedro Costa',
      prioridade: 'baixa',
    },
  ]);

  const handleAbrirModal = (denuncia: Denuncia, acao: 'ver' | 'resolver' | 'rejeitar') => {
    setDenunciaModal(denuncia);
    setModalAcao(acao);
    setObservacao('');
  };

  const handleFecharModal = () => {
    setDenunciaModal(null);
    setModalAcao(null);
    setObservacao('');
  };

  const handleResolver = () => {
    if (denunciaModal) {
      setDenuncias(denuncias.map(d => 
        d.id === denunciaModal.id 
          ? { ...d, status: 'resolvida' as const }
          : d
      ));
      toast.success('Denúncia marcada como resolvida!');
      handleFecharModal();
    }
  };

  const handleRejeitar = () => {
    if (denunciaModal && observacao.trim()) {
      setDenuncias(denuncias.map(d => 
        d.id === denunciaModal.id 
          ? { ...d, status: 'rejeitada' as const }
          : d
      ));
      toast.success('Denúncia rejeitada com sucesso!');
      handleFecharModal();
    } else {
      toast.error('Por favor, informe o motivo da rejeição');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      'pendente': 'bg-yellow-100 text-yellow-800',
      'em-andamento': 'bg-blue-100 text-blue-800',
      'resolvida': 'bg-green-100 text-green-800',
      'rejeitada': 'bg-red-100 text-red-800',
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'pendente': 'Pendente',
      'em-andamento': 'Em Andamento',
      'resolvida': 'Resolvida',
      'rejeitada': 'Rejeitada',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getPrioridadeBadge = (prioridade: string) => {
    const badges = {
      'alta': 'bg-red-100 text-red-800',
      'media': 'bg-orange-100 text-orange-800',
      'baixa': 'bg-gray-100 text-gray-800',
    };
    return badges[prioridade as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const denunciasFiltradas = filtro === 'todas' 
    ? denuncias 
    : denuncias.filter(d => d.status === filtro);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary-800 flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-accent-500" />
            Denúncias
          </h1>
          <p className="text-cinza-escuro mt-1">Gerencie denúncias de problemas de coleta</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <button
              onClick={() => setFiltro('todas')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtro === 'todas'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas ({denuncias.length})
            </button>
            <button
              onClick={() => setFiltro('pendente')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtro === 'pendente'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pendentes ({denuncias.filter(d => d.status === 'pendente').length})
            </button>
            <button
              onClick={() => setFiltro('em-andamento')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtro === 'em-andamento'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Em Andamento ({denuncias.filter(d => d.status === 'em-andamento').length})
            </button>
            <button
              onClick={() => setFiltro('resolvida')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtro === 'resolvida'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Resolvidas ({denuncias.filter(d => d.status === 'resolvida').length})
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {denunciasFiltradas.map((denuncia) => (
          <Card key={denuncia.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{denuncia.titulo}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(denuncia.status)}`}>
                      {getStatusLabel(denuncia.status)}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPrioridadeBadge(denuncia.prioridade)}`}>
                      Prioridade {denuncia.prioridade.charAt(0).toUpperCase() + denuncia.prioridade.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{denuncia.descricao}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{denuncia.localizacao}</span>
                    </div>
                    <span>Por: {denuncia.denunciante}</span>
                    <span>{denuncia.data}</span>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    leftIcon={<Eye className="h-4 w-4" />}
                    onClick={() => handleAbrirModal(denuncia, 'ver')}
                  >
                    Ver
                  </Button>
                  {denuncia.status !== 'resolvida' && denuncia.status !== 'rejeitada' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        leftIcon={<CheckCircle className="h-4 w-4" />}
                        onClick={() => handleAbrirModal(denuncia, 'resolver')}
                        className="text-green-600 hover:text-green-700 hover:border-green-600"
                      >
                        Resolver
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        leftIcon={<XCircle className="h-4 w-4" />}
                        onClick={() => handleAbrirModal(denuncia, 'rejeitar')}
                        className="text-red-600 hover:text-red-700 hover:border-red-600"
                      >
                        Rejeitar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal Ver Detalhes */}
      {denunciaModal && modalAcao === 'ver' && (
        <Modal isOpen={true} onClose={handleFecharModal} title="Detalhes da Denúncia">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <p className="text-gray-900">{denunciaModal.titulo}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <p className="text-gray-900">{denunciaModal.descricao}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
              <p className="text-gray-900 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                {denunciaModal.localizacao}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(denunciaModal.status)}`}>
                  {getStatusLabel(denunciaModal.status)}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPrioridadeBadge(denunciaModal.prioridade)}`}>
                  {denunciaModal.prioridade.charAt(0).toUpperCase() + denunciaModal.prioridade.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Denunciante</label>
                <p className="text-gray-900">{denunciaModal.denunciante}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                <p className="text-gray-900">{denunciaModal.data}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={handleFecharModal}>
                Fechar
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Resolver */}
      {denunciaModal && modalAcao === 'resolver' && (
        <Modal isOpen={true} onClose={handleFecharModal} title="Resolver Denúncia">
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-green-900">{denunciaModal.titulo}</h4>
              </div>
              <p className="text-green-700 text-sm">{denunciaModal.localizacao}</p>
            </div>
            
            <p className="text-gray-600">
              Tem certeza que deseja marcar esta denúncia como <strong>resolvida</strong>?
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações (opcional)
              </label>
              <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
                placeholder="Adicione observações sobre a resolução..."
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={handleFecharModal}>
                Cancelar
              </Button>
              <Button onClick={handleResolver} leftIcon={<CheckCircle className="h-4 w-4" />}>
                Confirmar Resolução
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Rejeitar */}
      {denunciaModal && modalAcao === 'rejeitar' && (
        <Modal isOpen={true} onClose={handleFecharModal} title="Rejeitar Denúncia">
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <h4 className="font-semibold text-red-900">{denunciaModal.titulo}</h4>
              </div>
              <p className="text-red-700 text-sm">{denunciaModal.localizacao}</p>
            </div>
            
            <p className="text-gray-600">
              Ao rejeitar esta denúncia, ela será marcada como <strong>não procedente</strong>.
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo da rejeição <span className="text-red-500">*</span>
              </label>
              <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={3}
                placeholder="Informe o motivo da rejeição..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Este campo é obrigatório
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={handleFecharModal}>
                Cancelar
              </Button>
              <Button 
                onClick={handleRejeitar} 
                leftIcon={<XCircle className="h-4 w-4" />}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Confirmar Rejeição
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DenunciasPage;
