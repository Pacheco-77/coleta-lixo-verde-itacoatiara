import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { MapPin, Search, Navigation, Download } from 'lucide-react';
import { toast } from 'sonner';

interface Rua {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  tipo?: string;
}

const RuasItacoatiaraPage = () => {
  const [ruas, setRuas] = useState<Rua[]>([]);
  const [filteredRuas, setFilteredRuas] = useState<Rua[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Coordenadas do centro de Itacoatiara
  const ITACOATIARA_CENTER = { lat: -3.146, lng: -58.444 };

  useEffect(() => {
    carregarRuas();
  }, []);

  useEffect(() => {
    // Filtrar ruas quando o termo de busca muda
    if (searchTerm) {
      const filtered = ruas.filter(
        (rua) =>
          rua.logradouro.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rua.bairro.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rua.cep.includes(searchTerm)
      );
      setFilteredRuas(filtered);
    } else {
      setFilteredRuas(ruas);
    }
    setCurrentPage(1);
  }, [searchTerm, ruas]);

  const carregarRuas = async () => {
    setLoading(true);
    try {
      // CEPs de Itacoatiara vão de 69100-000 a 69199-999
      // Vamos buscar uma amostra de CEPs conhecidos
      const cepsItacoatiara = [
        '69100-000', '69100-001', '69100-002', '69100-010', '69100-020',
        '69100-030', '69100-040', '69100-050', '69100-060', '69100-070',
        '69100-080', '69100-090', '69100-100', '69100-110', '69100-120',
        '69101-000', '69102-000', '69103-000', '69104-000', '69105-000',
      ];

      const promises = cepsItacoatiara.map(async (cep) => {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          if (response.ok) {
            const data = await response.json();
            if (!data.erro && data.localidade === 'Itacoatiara') {
              return data;
            }
          }
        } catch (error) {
          console.error(`Erro ao buscar CEP ${cep}:`, error);
        }
        return null;
      });

      const results = await Promise.all(promises);
      const ruasValidas = results.filter((r): r is Rua => r !== null && r.logradouro !== '');

      // Remover duplicatas baseadas no logradouro
      const ruasUnicas = ruasValidas.reduce((acc: Rua[], current) => {
        const existe = acc.find(r => r.logradouro === current.logradouro);
        if (!existe) {
          acc.push(current);
        }
        return acc;
      }, []);

      setRuas(ruasUnicas);
      setFilteredRuas(ruasUnicas);
      
      if (ruasUnicas.length === 0) {
        toast.warning('Nenhuma rua encontrada. Mostrando dados de exemplo.');
        carregarDadosMock();
      } else {
        toast.success(`${ruasUnicas.length} ruas carregadas com sucesso!`);
      }
    } catch (error) {
      console.error('Erro ao carregar ruas:', error);
      toast.error('Erro ao carregar ruas. Mostrando dados de exemplo.');
      carregarDadosMock();
    } finally {
      setLoading(false);
    }
  };

  const carregarDadosMock = () => {
    // Dados de exemplo para quando a API falhar
    const dadosMock: Rua[] = [
      { cep: '69100-000', logradouro: 'Rua Amazonas', bairro: 'Centro', localidade: 'Itacoatiara', uf: 'AM', tipo: 'Rua' },
      { cep: '69100-010', logradouro: 'Avenida Castelo Branco', bairro: 'Centro', localidade: 'Itacoatiara', uf: 'AM', tipo: 'Avenida' },
      { cep: '69100-020', logradouro: 'Rua Eduardo Ribeiro', bairro: 'Centro', localidade: 'Itacoatiara', uf: 'AM', tipo: 'Rua' },
      { cep: '69100-030', logradouro: 'Travessa São Jorge', bairro: 'Centro', localidade: 'Itacoatiara', uf: 'AM', tipo: 'Travessa' },
      { cep: '69100-040', logradouro: 'Rua Leopoldo Peres', bairro: 'Centro', localidade: 'Itacoatiara', uf: 'AM', tipo: 'Rua' },
      { cep: '69100-050', logradouro: 'Avenida Theodomiro Soares', bairro: 'Centro', localidade: 'Itacoatiara', uf: 'AM', tipo: 'Avenida' },
      { cep: '69101-000', logradouro: 'Rua Getúlio Vargas', bairro: 'Centro', localidade: 'Itacoatiara', uf: 'AM', tipo: 'Rua' },
      { cep: '69102-000', logradouro: 'Rua Dom Pedro II', bairro: 'Centro', localidade: 'Itacoatiara', uf: 'AM', tipo: 'Rua' },
      { cep: '69103-000', logradouro: 'Avenida João Pessoa', bairro: 'Praça 14 de Janeiro', localidade: 'Itacoatiara', uf: 'AM', tipo: 'Avenida' },
      { cep: '69104-000', logradouro: 'Rua Tiradentes', bairro: 'Centro', localidade: 'Itacoatiara', uf: 'AM', tipo: 'Rua' },
    ];
    setRuas(dadosMock);
    setFilteredRuas(dadosMock);
  };

  const exportarExcel = () => {
    const csv = [
      ['CEP', 'Tipo', 'Logradouro', 'Bairro', 'Cidade', 'UF'],
      ...filteredRuas.map(r => [r.cep, r.tipo || 'Rua', r.logradouro, r.bairro, r.localidade, r.uf])
    ].map(row => row.join(';')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'ruas-itacoatiara.csv';
    link.click();
    toast.success('Arquivo CSV exportado com sucesso!');
  };

  const abrirNoMapa = (rua: Rua) => {
    const endereco = `${rua.logradouro}, ${rua.bairro}, Itacoatiara, AM`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;
    window.open(url, '_blank');
  };

  // Paginação
  const totalPages = Math.ceil(filteredRuas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRuas = filteredRuas.slice(startIndex, endIndex);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary-800 flex items-center gap-3">
            <MapPin className="h-8 w-8 text-primary-500" />
            Lista de Ruas em Itacoatiara - AM
          </h1>
          <p className="text-cinza-escuro mt-1">
            Visualize e pesquise ruas da cidade de Itacoatiara
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={carregarRuas} disabled={loading}>
            <Navigation className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="primary" onClick={exportarExcel} leftIcon={<Download className="h-4 w-4" />}>
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Mapa */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary-500" />
            Localização - Centro de Itacoatiara
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-cinza-claro rounded-lg overflow-hidden" style={{ height: '300px' }}>
            <iframe
              title="Mapa de Itacoatiara"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${ITACOATIARA_CENTER.lng - 0.05},${ITACOATIARA_CENTER.lat - 0.05},${ITACOATIARA_CENTER.lng + 0.05},${ITACOATIARA_CENTER.lat + 0.05}&layer=mapnik&marker=${ITACOATIARA_CENTER.lat},${ITACOATIARA_CENTER.lng}`}
            />
          </div>
          <div className="mt-3 text-sm text-cinza-escuro">
            <p>📍 Centro de Itacoatiara: Latitude {ITACOATIARA_CENTER.lat}, Longitude {ITACOATIARA_CENTER.lng}</p>
          </div>
        </CardContent>
      </Card>

      {/* Busca */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                placeholder="Buscar por rua, bairro ou CEP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="h-5 w-5 text-gray-400" />}
              />
            </div>
            <div className="text-sm text-cinza-escuro">
              {filteredRuas.length} {filteredRuas.length === 1 ? 'rua encontrada' : 'ruas encontradas'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Ruas */}
      <Card>
        <CardHeader>
          <CardTitle>Ruas Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              <span className="ml-3 text-cinza-escuro">Carregando ruas...</span>
            </div>
          ) : currentRuas.length === 0 ? (
            <div className="text-center py-12 text-cinza-escuro">
              <MapPin className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p>Nenhuma rua encontrada com os critérios de busca.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-primary-500/20">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-primary-800">CEP</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-primary-800">Tipo</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-primary-800">Logradouro</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-primary-800">Bairro</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-primary-800">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRuas.map((rua, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-cinza-claro/50 transition-colors">
                        <td className="py-3 px-4 text-sm text-cinza-escuro font-mono">{rua.cep}</td>
                        <td className="py-3 px-4 text-sm text-cinza-escuro">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {rua.tipo || 'Rua'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900 font-medium">{rua.logradouro}</td>
                        <td className="py-3 px-4 text-sm text-cinza-escuro">{rua.bairro}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => abrirNoMapa(rua)}
                            className="text-secondary-500 hover:text-secondary-700 text-sm font-medium flex items-center gap-1"
                          >
                            <MapPin className="h-4 w-4" />
                            Ver no Mapa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-cinza-escuro">
                    Mostrando {startIndex + 1} a {Math.min(endIndex, filteredRuas.length)} de {filteredRuas.length} ruas
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                        .map((page, idx, arr) => (
                          <div key={page}>
                            {idx > 0 && arr[idx - 1] !== page - 1 && (
                              <span className="px-2 text-cinza-escuro">...</span>
                            )}
                            <button
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-1 rounded ${
                                currentPage === page
                                  ? 'bg-primary-500 text-white'
                                  : 'bg-white text-cinza-escuro hover:bg-cinza-claro'
                              }`}
                            >
                              {page}
                            </button>
                          </div>
                        ))}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RuasItacoatiaraPage;
