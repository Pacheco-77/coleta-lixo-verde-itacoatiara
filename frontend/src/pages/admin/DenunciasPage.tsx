import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { AlertCircle, Eye, CheckCircle, XCircle, MapPin } from 'lucide-react';

const DenunciasPage = () => {
  const [filtro, setFiltro] = useState('todas');

  const denuncias = [
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
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      'pendente': 'bg-yellow-100 text-yellow-800',
      'em-andamento': 'bg-blue-100 text-blue-800',
      'resolvida': 'bg-green-100 text-green-800',
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
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
                      {denuncia.status === 'pendente' && 'Pendente'}
                      {denuncia.status === 'em-andamento' && 'Em Andamento'}
                      {denuncia.status === 'resolvida' && 'Resolvida'}
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
                  <Button size="sm" variant="outline" leftIcon={<Eye className="h-4 w-4" />}>
                    Ver
                  </Button>
                  {denuncia.status !== 'resolvida' && (
                    <>
                      <Button size="sm" variant="outline" leftIcon={<CheckCircle className="h-4 w-4" />}>
                        Resolver
                      </Button>
                      <Button size="sm" variant="outline" leftIcon={<XCircle className="h-4 w-4" />}>
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
    </div>
  );
};

export default DenunciasPage;
