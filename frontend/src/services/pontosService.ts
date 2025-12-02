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

      let apiUrl = import.meta.env.VITE_API_URL || 'https://coleta-lixo-api.onrender.com/api';
      if (!apiUrl.endsWith('/api')) {
        apiUrl = apiUrl + '/api';
      }

      const url = `${apiUrl}/pontos`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        credentials: 'omit',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      const data = result.data || [];
      
      // Atualizar cache
      pontosCache = { data, timestamp: Date.now() };
      console.log(`${data.length} pontos carregados com sucesso`);
      
      return data;
    } catch (error: any) {
      console.error('Erro ao listar pontos:', error.message);
      // Retornar cache antigo se disponível
      if (pontosCache) {
        console.log('Retornando cache antigo devido ao erro');
        return pontosCache.data;
      }
      return []; // Retornar array vazio em vez de throw
    }
  },

  // Buscar um ponto específico
  async buscarPonto(id: string): Promise<PontoColeta> {
    try {
      let apiUrl = import.meta.env.VITE_API_URL || 'https://coleta-lixo-api.onrender.com/api';
      if (!apiUrl.endsWith('/api')) {
        apiUrl = apiUrl + '/api';
      }

      const url = `${apiUrl}/pontos/${id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        credentials: 'omit',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error: any) {
      console.error('Erro ao buscar ponto:', error.message);
      throw error;
    }
  },

  // Registrar check-in de coleta
  async registrarCheckIn(id: string, coletorId: string): Promise<PontoColeta> {
    try {
      let apiUrl = import.meta.env.VITE_API_URL || 'https://coleta-lixo-api.onrender.com/api';
      if (!apiUrl.endsWith('/api')) {
        apiUrl = apiUrl + '/api';
      }

      const url = `${apiUrl}/collector/pontos/${id}/checkin`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coletorId }),
        mode: 'cors',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      // Limpar cache após modificação
      pontosCache = null;
      return result.data;
    } catch (error: any) {
      console.error('Erro ao registrar check-in:', error.message);
      throw error;
    }
  },

  // Buscar estatísticas
  async buscarEstatisticas(): Promise<EstatisticasPontos> {
    try {
      let apiUrl = import.meta.env.VITE_API_URL || 'https://coleta-lixo-api.onrender.com/api';
      if (!apiUrl.endsWith('/api')) {
        apiUrl = apiUrl + '/api';
      }

      const url = `${apiUrl}/pontos/estatisticas`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        credentials: 'omit',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      return result.data || { total: 0, pendentes: 0, emAndamento: 0, concluidos: 0, percentualConcluido: 0 };
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas:', error.message);
      return { total: 0, pendentes: 0, emAndamento: 0, concluidos: 0, percentualConcluido: 0 };
    }
  },
};
