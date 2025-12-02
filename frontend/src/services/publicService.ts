import axios from '@/lib/axios';
import { PublicStatistics, ContactInfo } from '@/types';

/**
 * Serviço para APIs públicas (sem autenticação)
 */

// Notícias - Versão com fetch nativo para evitar problemas do axios
export const getNews = async (params?: { limit?: number; category?: string }) => {
  try {
    console.log('🔍 Buscando notícias...', params);
    
    const apiUrl = import.meta.env.VITE_API_URL || 'https://coleta-lixo-api.onrender.com/api';
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    const url = `${apiUrl}/public/news${queryString}`;
    
    console.log('🌐 URL completa:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit', // Não enviar cookies
    });
    
    console.log('📦 Response status:', response.status);
    console.log('📦 Response ok:', response.ok);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('📄 Response.data:', data);
    console.log('✅ Success?', data?.success);
    console.log('📊 Count:', data?.count);
    console.log('📰 Data length:', data?.data?.length);
    
    return data;
  } catch (error: any) {
    console.error('❌ Erro ao buscar notícias:', error);
    console.error('❌ Error.message:', error.message);
    console.error('❌ Error.stack:', error.stack);
    // Retornar estrutura padrão em caso de erro
    return { success: false, count: 0, data: [], error: error.message };
  }
};

export const getNewsById = async (id: string) => {
  const { data } = await axios.get(`/public/news/${id}`);
  return data;
};

// Calendário de coletas
export const getCalendar = async (params?: { startDate?: string; endDate?: string }) => {
  const { data } = await axios.get('/public/calendar', { params });
  return data;
};

// Mapa público
export const getPublicMap = async (params?: { neighborhood?: string; status?: string }) => {
  try {
    console.log('Buscando mapa público...', params);
    const { data } = await axios.get('/public/map', { 
      params,
      timeout: 10000
    });
    console.log('Mapa recebido:', data);
    return data;
  } catch (error: any) {
    console.error('Erro ao buscar mapa:', error.message, error.response?.data);
    throw error;
  }
};

// Estatísticas públicas
export const getPublicStatistics = async () => {
  try {
    console.log('Buscando estatísticas públicas...');
    const { data } = await axios.get<{ success: boolean; data: PublicStatistics }>('/public/statistics', {
      timeout: 10000
    });
    console.log('Estatísticas recebidas:', data);
    return data;
  } catch (error: any) {
    console.error('Erro ao buscar estatísticas:', error.message, error.response?.data);
    throw error;
  }
};

// Informações de contato
export const getContactInfo = async () => {
  const { data } = await axios.get<{ success: boolean; data: ContactInfo }>('/public/contact');
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
  const { data } = await axios.post('/public/contact', messageData);
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
