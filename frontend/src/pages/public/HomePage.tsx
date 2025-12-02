import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Leaf, MapPin, Users, TrendingUp, Calendar, Phone } from 'lucide-react';
import publicService from '@/services/publicService';
import { News } from '@/types';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Loading from '@/components/ui/Loading';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Buscar notícias
  const { data: newsData, isLoading: newsLoading, error: newsError, refetch } = useQuery({
    queryKey: ['public-news'],
    queryFn: () => publicService.getNews({ limit: 5 }),
    staleTime: 0, // Sempre buscar dados frescos
    gcTime: 0, // Não manter em cache
  });

  // Buscar estatísticas
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['public-statistics'],
    queryFn: () => publicService.getPublicStatistics(),
  });

  const news: News[] = newsData?.data || [];
  const stats = statsData?.data;

  // Debug logs detalhados
  useEffect(() => {
    console.log('=== DEBUG NOTÍCIAS ===');
    console.log('newsData completo:', newsData);
    console.log('newsData?.data:', newsData?.data);
    console.log('news array final:', news);
    console.log('news.length:', news.length);
    console.log('newsLoading:', newsLoading);
    console.log('newsError:', newsError);
    console.log('======================');
  }, [newsData, news, newsLoading, newsError]);

  // Auto-play do carrossel
  useEffect(() => {
    if (news.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % news.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [news.length]);

  const getCategoryColor = (category: string) => {
    const colors = {
      noticia: 'bg-blue-500',
      evento: 'bg-purple-500',
      alerta: 'bg-red-500',
      informacao: 'bg-green-500',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      noticia: 'Notícia',
      evento: 'Evento',
      alerta: 'Alerta',
      informacao: 'Informação',
    };
    return labels[category as keyof typeof labels] || category;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-green-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Leaf className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Coleta Verde</h1>
                <p className="text-sm text-green-100">Itacoatiara - AM</p>
              </div>
            </div>
            <nav className="flex items-center gap-4">
              <Link to="/mapa" className="bg-green-600 text-white font-bold hover:bg-green-500 transition-all px-4 py-2 rounded-lg shadow-md hover:shadow-lg">
                🗺️ Mapa
              </Link>
              <Link to="/mapa-coleta" className="bg-green-600 text-white font-bold hover:bg-green-500 transition-all px-4 py-2 rounded-lg shadow-md hover:shadow-lg">
                📍 Mapa de Coleta
              </Link>
              <Link to="/login">
                <Button variant="outline" className="bg-white !text-green-700 border-2 border-white hover:bg-green-50 font-semibold">
                  Entrar
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-yellow-400 !text-green-900 hover:bg-yellow-300 border-2 border-yellow-500 font-bold shadow-lg">
                  Cadastrar Grátis
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section com Carrossel de Notícias */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          {newsLoading ? (
            <div className="h-96 flex items-center justify-center">
              <Loading />
            </div>
          ) : news.length > 0 ? (
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              {/* Slides */}
              {news.map((item, index) => (
                <div
                  key={item._id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${getCategoryColor(
                        item.category
                      )}`}
                    >
                      {getCategoryLabel(item.category)}
                    </span>
                    <h2 className="text-4xl font-bold mb-3">{item.title}</h2>
                    <p className="text-lg text-gray-200 mb-4">{item.summary || item.content.substring(0, 150)}...</p>
                    <Link to={`/noticia/${item._id}`}>
                      <Button className="bg-green-600 hover:bg-green-500">
                        Ler mais
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}

              {/* Indicadores */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                {news.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition ${
                      index === currentSlide ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>

              {/* Navegação */}
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + news.length) % news.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition"
                aria-label="Notícia anterior"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % news.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition"
                aria-label="Próxima notícia"
              >
                →
              </button>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center bg-gray-100 rounded-2xl">
              <p className="text-gray-500">Nenhuma notícia disponível no momento</p>
            </div>
          )}
        </div>
      </section>

      {/* Estatísticas */}
      {!statsLoading && stats && (
        <section className="py-12 bg-green-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8 text-green-800">
              Nosso Impacto
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6 text-center bg-white hover:shadow-lg transition">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-green-700 mb-2">
                  {stats.totalCollections || 0}
                </h3>
                <p className="text-gray-600">Coletas Realizadas</p>
              </Card>

              <Card className="p-6 text-center bg-white hover:shadow-lg transition">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-green-700 mb-2">
                  {stats.totalWasteCollected || 0} kg
                </h3>
                <p className="text-gray-600">Lixo Verde Coletado</p>
              </Card>

              <Card className="p-6 text-center bg-white hover:shadow-lg transition">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-green-700 mb-2">
                  {stats.activeCollectors || 0}
                </h3>
                <p className="text-gray-600">Coletores Ativos</p>
              </Card>

              <Card className="p-6 text-center bg-white hover:shadow-lg transition">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-green-700 mb-2">
                  {stats.topNeighborhoods?.length || 0}
                </h3>
                <p className="text-gray-600">Bairros Atendidos</p>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Como Funciona */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-800">
            Como Funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Cadastre-se</h3>
              <p className="text-gray-600">
                Crie sua conta gratuitamente e tenha acesso ao sistema de agendamento
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Agende a Coleta</h3>
              <p className="text-gray-600">
                Informe o tipo e quantidade de lixo verde para agendamento
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Acompanhe</h3>
              <p className="text-gray-600">
                Receba notificações e acompanhe o status da sua coleta em tempo real
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Pronto para contribuir com o meio ambiente?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Cadastre-se agora e agende sua primeira coleta de lixo verde
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-yellow-400 !text-green-900 hover:bg-yellow-300 border-2 border-yellow-500 font-bold shadow-xl transform hover:scale-105 transition-all">
                🚀 Criar Conta Grátis
              </Button>
            </Link>
            <Link to="/mapa">
              <Button size="lg" className="bg-white !text-green-700 hover:bg-green-50 border-2 border-white font-bold shadow-xl transform hover:scale-105 transition-all">
                🗺️ Ver Mapa de Coletas
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Coleta Verde Itacoatiara</h3>
              <p className="text-green-200">
                Sistema de coleta de lixo verde para uma cidade mais sustentável
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/mapa" className="text-green-200 hover:text-white transition">
                    Mapa de Coletas
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-green-200 hover:text-white transition">
                    Entrar
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-green-200 hover:text-white transition">
                    Cadastrar
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <div className="space-y-2 text-green-200">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  (92) 3521-1234
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Seg-Sex: 8h-17h
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-green-800 mt-8 pt-8 text-center text-green-200">
            <p>&copy; 2025 Coleta Verde Itacoatiara. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
