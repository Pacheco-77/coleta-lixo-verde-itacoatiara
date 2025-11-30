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
        console.log('Usando cache de pontos');
        return pontosCache.data;
      }

      console.log('Buscando pontos de coleta...');
      const response = await axios.get('/pontos', { timeout: 10000 });
      console.log('Resposta da API pontos:', response.data);
      const data = response.data.data;
      
      // Atualizar cache
      pontosCache = { data, timestamp: Date.now() };
      console.log(`${data.length} pontos carregados com sucesso`);
      
      return data;
    } catch (error: any) {
      console.error('Erro ao listar pontos:', error.message, error.response?.data);
      // Retornar cache antigo se disponível
      if (pontosCache) {
        console.log('Retornando cache antigo devido ao erro');
        return pontosCache.data;
      }
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
