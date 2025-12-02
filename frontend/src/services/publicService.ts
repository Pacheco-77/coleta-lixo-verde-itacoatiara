import axios from '@/lib/axios';
import { PublicStatistics, ContactInfo } from '@/types';

/**
 * Serviço para APIs públicas (sem autenticação)
 */

// Notícias - Versão com fetch nativo para evitar problemas do axios
export const getNews = async (params?: { limit?: number; category?: string }) => {
  try {
    let apiUrl = import.meta.env.VITE_API_URL || 'https://coleta-lixo-api.onrender.com/api';
    
    // Garantir que tem /api no final
    if (!apiUrl.endsWith('/api')) {
      apiUrl = apiUrl + '/api';
    }
    
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    const url = `${apiUrl}/public/news${queryString}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Erro ao buscar notícias:', error.message);
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
    let apiUrl = import.meta.env.VITE_API_URL || 'https://coleta-lixo-api.onrender.com/api';
    
    // Garantir que tem /api no final
    if (!apiUrl.endsWith('/api')) {
      apiUrl = apiUrl + '/api';
    }
    
    const url = `${apiUrl}/public/statistics`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Erro ao buscar estatísticas:', error.message);
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
