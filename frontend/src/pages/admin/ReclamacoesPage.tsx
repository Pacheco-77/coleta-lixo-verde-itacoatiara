import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { MessageSquare, Eye, CheckCircle, MessageCircle } from 'lucide-react';

const ReclamacoesPage = () => {
  const [filtro, setFiltro] = useState('todas');

  const reclamacoes = [
    {
      id: 1,
      titulo: 'Coleta não realizada',
      descricao: 'A coleta estava agendada para hoje às 08:00 mas não foi realizada',
      usuario: 'João Silva',
      email: 'joao@email.com',
      telefone: '(92) 99999-1111',
      status: 'aberta',
      data: '28/11/2024',
      categoria: 'coleta',
    },
    {
      id: 2,
      titulo: 'Coletor passou sem recolher',
      descricao: 'O coletor passou na rua mas não recolheu meu lixo verde',
      usuario: 'Maria Santos',
      email: 'maria@email.com',
      telefone: '(92) 99999-2222',
      status: 'em-analise',
      data: '27/11/2024',
      categoria: 'coleta',
    },
    {
      id: 3,
      titulo: 'Aplicativo com erro',
      descricao: 'Não consigo agendar coleta pelo aplicativo',
      usuario: 'Pedro Costa',
      email: 'pedro@email.com',
      telefone: '(92) 99999-3333',
      status: 'respondida',
      data: '26/11/2024',
      categoria: 'sistema',
    },
    {
      id: 4,
      titulo: 'Horário de coleta inadequado',
      descricao: 'A coleta está sendo realizada muito cedo, antes das 06:00',
      usuario: 'Ana Oliveira',
      email: 'ana@email.com',
      telefone: '(92) 99999-4444',
      status: 'resolvida',
      data: '25/11/2024',
      categoria: 'horario',
    },
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      'aberta': 'bg-red-100 text-red-800',
      'em-analise': 'bg-yellow-100 text-yellow-800',
      'respondida': 'bg-blue-100 text-blue-800',
      'resolvida': 'bg-green-100 text-green-800',
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const reclamacoesFiltradas = filtro === 'todas' 
    ? reclamacoes 
    : reclamacoes.filter(r => r.status === filtro);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            Reclamações
          </h1>
          <p className="text-gray-600 mt-1">Gerencie reclamações e feedbacks dos usuários</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => setFiltro('todas')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtro === 'todas'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas ({reclamacoes.length})
            </button>
            <button
              onClick={() => setFiltro('aberta')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtro === 'aberta'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Abertas ({reclamacoes.filter(r => r.status === 'aberta').length})
            </button>
            <button
              onClick={() => setFiltro('em-analise')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtro === 'em-analise'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Em Análise ({reclamacoes.filter(r => r.status === 'em-analise').length})
            </button>
            <button
              onClick={() => setFiltro('respondida')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtro === 'respondida'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Respondidas ({reclamacoes.filter(r => r.status === 'respondida').length})
            </button>
            <button
              onClick={() => setFiltro('resolvida')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtro === 'resolvida'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Resolvidas ({reclamacoes.filter(r => r.status === 'resolvida').length})
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {reclamacoesFiltradas.map((reclamacao) => (
          <Card key={reclamacao.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{reclamacao.titulo}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(reclamacao.status)}`}>
                      {reclamacao.status === 'aberta' && 'Aberta'}
                      {reclamacao.status === 'em-analise' && 'Em Análise'}
                      {reclamacao.status === 'respondida' && 'Respondida'}
                      {reclamacao.status === 'resolvida' && 'Resolvida'}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {reclamacao.categoria === 'coleta' && 'Coleta'}
                      {reclamacao.categoria === 'sistema' && 'Sistema'}
                      {reclamacao.categoria === 'horario' && 'Horário'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{reclamacao.descricao}</p>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-500">
                    <div>
                      <span className="font-medium">Usuário:</span> {reclamacao.usuario}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {reclamacao.email}
                    </div>
                    <div>
                      <span className="font-medium">Telefone:</span> {reclamacao.telefone}
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-500">
                    <span className="font-medium">Data:</span> {reclamacao.data}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline" leftIcon={<Eye className="h-4 w-4" />}>
                    Ver
                  </Button>
                  {reclamacao.status !== 'resolvida' && (
                    <>
                      <Button size="sm" variant="outline" leftIcon={<MessageCircle className="h-4 w-4" />}>
                        Responder
                      </Button>
                      <Button size="sm" variant="outline" leftIcon={<CheckCircle className="h-4 w-4" />}>
                        Resolver
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

export default ReclamacoesPage;
