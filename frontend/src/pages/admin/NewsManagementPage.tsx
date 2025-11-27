import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Eye, EyeOff, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import newsService from '@/services/newsService';
import { News, NewsFormData, NewsCategory } from '@/types';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Loading from '@/components/ui/Loading';
import AdminLayout from '@/components/layout/AdminLayout';

const NewsManagementPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  
  const queryClient = useQueryClient();

  // Buscar notícias
  const { data, isLoading } = useQuery({
    queryKey: ['admin-news', filter],
    queryFn: () => newsService.getAllNews({
      isActive: filter === 'all' ? undefined : filter === 'active',
    }),
  });

  const news: News[] = data?.data || [];

  // Mutation para criar/atualizar
  const saveMutation = useMutation({
    mutationFn: (data: { id?: string; newsData: NewsFormData }) => {
      if (data.id) {
        return newsService.updateNews(data.id, data.newsData);
      }
      return newsService.createNews(data.newsData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      toast.success(editingNews ? 'Notícia atualizada!' : 'Notícia criada!');
      setIsModalOpen(false);
      setEditingNews(null);
    },
    onError: () => {
      toast.error('Erro ao salvar notícia');
    },
  });

  // Mutation para deletar
  const deleteMutation = useMutation({
    mutationFn: newsService.deleteNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      toast.success('Notícia deletada!');
    },
    onError: () => {
      toast.error('Erro ao deletar notícia');
    },
  });

  // Mutation para ativar/desativar
  const toggleMutation = useMutation({
    mutationFn: newsService.toggleNewsStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      toast.success('Status atualizado!');
    },
    onError: () => {
      toast.error('Erro ao atualizar status');
    },
  });

  const handleEdit = (item: News) => {
    setEditingNews(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta notícia?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggle = (id: string) => {
    toggleMutation.mutate(id);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newsData: NewsFormData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      summary: formData.get('summary') as string,
      image: formData.get('image') as string,
      category: formData.get('category') as NewsCategory,
      priority: parseInt(formData.get('priority') as string) || 1,
      publishDate: formData.get('publishDate') as string,
      expiryDate: formData.get('expiryDate') as string || undefined,
    };

    saveMutation.mutate({
      id: editingNews?._id,
      newsData,
    });
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

  const getCategoryColor = (category: string) => {
    const colors = {
      noticia: 'bg-blue-100 text-blue-800',
      evento: 'bg-purple-100 text-purple-800',
      alerta: 'bg-red-100 text-red-800',
      informacao: 'bg-green-100 text-green-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Notícias</h1>
            <p className="text-gray-600 mt-1">
              Crie e gerencie notícias para o carrossel da página inicial
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingNews(null);
              setIsModalOpen(true);
            }}
            leftIcon={<Plus className="w-5 h-5" />}
          >
            Nova Notícia
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'ghost'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            Todas
          </Button>
          <Button
            variant={filter === 'active' ? 'primary' : 'ghost'}
            onClick={() => setFilter('active')}
            size="sm"
          >
            Ativas
          </Button>
          <Button
            variant={filter === 'inactive' ? 'primary' : 'ghost'}
            onClick={() => setFilter('inactive')}
            size="sm"
          >
            Inativas
          </Button>
        </div>

        {/* Lista de Notícias */}
        {isLoading ? (
          <Loading />
        ) : news.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">Nenhuma notícia encontrada</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {news.map((item) => (
              <Card key={item._id} hover>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Imagem */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-32 h-32 object-cover rounded-lg"
                    />

                    {/* Conteúdo */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
                                item.category
                              )}`}
                            >
                              {getCategoryLabel(item.category)}
                            </span>
                            <span className="text-sm text-gray-500">
                              Prioridade: {item.priority}
                            </span>
                            {!item.isActive && (
                              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                                Inativa
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {item.summary || item.content}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(item.publishDate), 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {item.views} visualizações
                        </span>
                      </div>

                      {/* Ações */}
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(item)}
                          leftIcon={<Edit className="w-4 h-4" />}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggle(item._id)}
                          leftIcon={
                            item.isActive ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )
                          }
                        >
                          {item.isActive ? 'Desativar' : 'Ativar'}
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(item._id)}
                          leftIcon={<Trash2 className="w-4 h-4" />}
                        >
                          Deletar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal de Criar/Editar */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingNews(null);
          }}
          title={editingNews ? 'Editar Notícia' : 'Nova Notícia'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título *
              </label>
              <input
                type="text"
                name="title"
                defaultValue={editingNews?.title}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resumo
              </label>
              <textarea
                name="summary"
                defaultValue={editingNews?.summary}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conteúdo *
              </label>
              <textarea
                name="content"
                defaultValue={editingNews?.content}
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL da Imagem *
              </label>
              <input
                type="url"
                name="image"
                defaultValue={editingNews?.image}
                required
                placeholder="https://exemplo.com/imagem.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria *
                </label>
                <select
                  name="category"
                  defaultValue={editingNews?.category || 'noticia'}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="noticia">Notícia</option>
                  <option value="evento">Evento</option>
                  <option value="alerta">Alerta</option>
                  <option value="informacao">Informação</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prioridade
                </label>
                <input
                  type="number"
                  name="priority"
                  defaultValue={editingNews?.priority || 1}
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Publicação
                </label>
                <input
                  type="datetime-local"
                  name="publishDate"
                  defaultValue={
                    editingNews?.publishDate
                      ? new Date(editingNews.publishDate).toISOString().slice(0, 16)
                      : new Date().toISOString().slice(0, 16)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Expiração
                </label>
                <input
                  type="datetime-local"
                  name="expiryDate"
                  defaultValue={
                    editingNews?.expiryDate
                      ? new Date(editingNews.expiryDate).toISOString().slice(0, 16)
                      : ''
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingNews(null);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" isLoading={saveMutation.isPending}>
                {editingNews ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default NewsManagementPage;
