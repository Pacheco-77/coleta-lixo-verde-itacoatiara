import axios from '@/lib/axios';
import { NewsFormData } from '@/types';

/**
 * Serviço para gerenciamento de notícias (Admin)
 */

// Listar todas as notícias (incluindo inativas)
export const getAllNews = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  isActive?: boolean;
}) => {
  const { data } = await axios.get('/api/admin/news', { params });
  return data;
};

// Obter notícia por ID
export const getNewsById = async (id: string) => {
  const { data } = await axios.get(`/api/admin/news/${id}`);
  return data;
};

// Criar notícia
export const createNews = async (newsData: NewsFormData) => {
  const { data } = await axios.post('/api/admin/news', newsData);
  return data;
};

// Atualizar notícia
export const updateNews = async (id: string, newsData: Partial<NewsFormData>) => {
  const { data } = await axios.put(`/api/admin/news/${id}`, newsData);
  return data;
};

// Deletar notícia
export const deleteNews = async (id: string) => {
  const { data } = await axios.delete(`/api/admin/news/${id}`);
  return data;
};

// Ativar/Desativar notícia
export const toggleNewsStatus = async (id: string) => {
  const { data } = await axios.patch(`/api/admin/news/${id}/toggle`);
  return data;
};

export default {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  toggleNewsStatus,
};
