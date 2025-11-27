import axios from '@/lib/axios';
import { News, PublicStatistics, ContactInfo, CollectionPoint } from '@/types';

/**
 * Serviço para APIs públicas (sem autenticação)
 */

// Notícias
export const getNews = async (params?: { limit?: number; category?: string }) => {
  const { data } = await axios.get('/api/public/news', { params });
  return data;
};

export const getNewsById = async (id: string) => {
  const { data } = await axios.get(`/api/public/news/${id}`);
  return data;
};

// Calendário de coletas
export const getCalendar = async (params?: { startDate?: string; endDate?: string }) => {
  const { data } = await axios.get('/api/public/calendar', { params });
  return data;
};

// Mapa público
export const getPublicMap = async (params?: { neighborhood?: string; status?: string }) => {
  const { data } = await axios.get('/api/public/map', { params });
  return data;
};

// Estatísticas públicas
export const getPublicStatistics = async () => {
  const { data } = await axios.get<{ success: boolean; data: PublicStatistics }>('/api/public/statistics');
  return data;
};

// Informações de contato
export const getContactInfo = async () => {
  const { data } = await axios.get<{ success: boolean; data: ContactInfo }>('/api/public/contact');
  return data;
};

// Enviar mensagem de contato
export const sendContactMessage = async (messageData: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) => {
  const { data } = await axios.post('/api/public/contact', messageData);
  return data;
};

export default {
  getNews,
  getNewsById,
  getCalendar,
  getPublicMap,
  getPublicStatistics,
  getContactInfo,
  sendContactMessage,
};
