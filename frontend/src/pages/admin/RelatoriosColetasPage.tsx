import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Download, Calendar, Filter } from 'lucide-react';

const RelatoriosColetasPage = () => {
  const [dateRange, setDateRange] = useState('month');

  const relatorios = [
    { id: 1, data: '28/11/2024', coletor: 'João Silva', pontos: 15, peso: '450kg', status: 'Concluído' },
    { id: 2, data: '27/11/2024', coletor: 'Maria Santos', pontos: 12, peso: '380kg', status: 'Concluído' },
    { id: 3, data: '26/11/2024', coletor: 'Pedro Costa', pontos: 18, peso: '520kg', status: 'Concluído' },
    { id: 4, data: '25/11/2024', coletor: 'João Silva', pontos: 14, peso: '410kg', status: 'Concluído' },
    { id: 5, data: '24/11/2024', coletor: 'Ana Oliveira', pontos: 16, peso: '475kg', status: 'Concluído' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios de Coletas</h1>
          <p className="text-gray-600 mt-1">Visualize e exporte relatórios detalhados de coletas</p>
        </div>
        <Button leftIcon={<Download className="h-4 w-4" />}>
          Exportar Excel
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-2" />
                Período
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="today">Hoje</option>
                <option value="week">Última Semana</option>
                <option value="month">Último Mês</option>
                <option value="year">Último Ano</option>
                <option value="custom">Personalizado</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="h-4 w-4 inline mr-2" />
                Coletor
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="">Todos</option>
                <option value="joao">João Silva</option>
                <option value="maria">Maria Santos</option>
                <option value="pedro">Pedro Costa</option>
                <option value="ana">Ana Oliveira</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button>Filtrar</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coletas Realizadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Data</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Coletor</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Pontos Visitados</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Peso Coletado</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {relatorios.map((relatorio) => (
                  <tr key={relatorio.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{relatorio.data}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{relatorio.coletor}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{relatorio.pontos}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{relatorio.peso}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {relatorio.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RelatoriosColetasPage;
