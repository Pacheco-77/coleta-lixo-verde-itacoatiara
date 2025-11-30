import axios from '../lib/axios';

export interface PontoColeta {
  _id: string;
  nomePonto: string;
  logradouro: string;
  bairro: string;
  latitude: number;
  longitude: number;
  status: 'pendente' | 'em_andamento' | 'concluido';
  coletorId?: {
    _id: string;
    name: string;
    email: string;
  };
  concluidoEm?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EstatisticasPontos {
  total: number;
  pendentes: number;
  emAndamento: number;
  concluidos: number;
  percentualConcluido: number;
}

// Cache simples para evitar requests repetidos
let pontosCache: { data: PontoColeta[]; timestamp: number } | null = null;
const CACHE_DURATION = 10000; // 10 segundos

export const pontosService = {
  // Buscar todos os pontos de coleta
  async listarPontos(): Promise<PontoColeta[]> {
    try {
      // Verificar cache
      if (pontosCache && Date.now() - pontosCache.timestamp < CACHE_DURATION) {
        return pontosCache.data;
      }

      const response = await axios.get('/pontos', { timeout: 10000 });
      const data = response.data.data;
      
      // Atualizar cache
      pontosCache = { data, timestamp: Date.now() };
      
      return data;
    } catch (error) {
      console.error('Erro ao listar pontos:', error);
      // Retornar cache antigo se disponível
      if (pontosCache) return pontosCache.data;
      throw error;
    }
  },

  // Buscar um ponto específico
  async buscarPonto(id: string): Promise<PontoColeta> {
    try {
      const response = await axios.get(`/pontos/${id}`, { timeout: 8000 });
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar ponto:', error);
      throw error;
    }
  },

  // Registrar check-in de coleta
  async registrarCheckIn(id: string, coletorId: string): Promise<PontoColeta> {
    try {
      const response = await axios.post(`/pontos/${id}/checkin`, { coletorId }, { timeout: 8000 });
      // Limpar cache após modificação
      pontosCache = null;
      return response.data.data;
    } catch (error) {
      console.error('Erro ao registrar check-in:', error);
      throw error;
    }
  },

  // Buscar estatísticas
  async buscarEstatisticas(): Promise<EstatisticasPontos> {
    try {
      const response = await axios.get('/estatisticas', { timeout: 5000 });
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  },
};
