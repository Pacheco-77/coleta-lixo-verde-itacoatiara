const crypto = require('crypto');

// Gerar código aleatório
const generateRandomCode = (length = 6) => {
  return crypto.randomBytes(length).toString('hex').substring(0, length).toUpperCase();
};

// Gerar token aleatório
const generateRandomToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Formatar telefone brasileiro
const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
  }
  
  return phone;
};

// Formatar CPF
const formatCPF = (cpf) => {
  const cleaned = cpf.replace(/\D/g, '');
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// Formatar CEP
const formatCEP = (cep) => {
  const cleaned = cep.replace(/\D/g, '');
  return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
};

// Formatar moeda (BRL)
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Formatar data
const formatDate = (date, format = 'dd/MM/yyyy') => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return format
    .replace('dd', day)
    .replace('MM', month)
    .replace('yyyy', year);
};

// Formatar data e hora
const formatDateTime = (date) => {
  const d = new Date(date);
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Calcular diferença entre datas em dias
const daysBetween = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  
  return Math.round(Math.abs((firstDate - secondDate) / oneDay));
};

// Calcular distância entre coordenadas (Haversine)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Raio da Terra em km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance; // em km
};

// Converter graus para radianos
const toRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

// Slugify string
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/--+/g, '-') // Remove hífens duplicados
    .trim();
};

// Truncar texto
const truncate = (text, length = 100, suffix = '...') => {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + suffix;
};

// Capitalizar primeira letra
const capitalize = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Capitalizar cada palavra
const capitalizeWords = (text) => {
  return text
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

// Gerar hash MD5
const generateMD5 = (text) => {
  return crypto.createHash('md5').update(text).digest('hex');
};

// Gerar hash SHA256
const generateSHA256 = (text) => {
  return crypto.createHash('sha256').update(text).digest('hex');
};

// Remover duplicatas de array
const removeDuplicates = (array) => {
  return [...new Set(array)];
};

// Agrupar array por propriedade
const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

// Ordenar array de objetos
const sortBy = (array, key, order = 'asc') => {
  return array.sort((a, b) => {
    if (order === 'asc') {
      return a[key] > b[key] ? 1 : -1;
    } else {
      return a[key] < b[key] ? 1 : -1;
    }
  });
};

// Paginar array
const paginate = (array, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  return {
    data: array.slice(startIndex, endIndex),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(array.length / limit),
      totalItems: array.length,
      itemsPerPage: limit,
      hasNextPage: endIndex < array.length,
      hasPrevPage: page > 1,
    },
  };
};

// Calcular porcentagem
const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Calcular média
const calculateAverage = (numbers) => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
};

// Gerar range de números
const range = (start, end, step = 1) => {
  const result = [];
  for (let i = start; i <= end; i += step) {
    result.push(i);
  }
  return result;
};

// Delay (Promise)
const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Retry função com delay
const retry = async (fn, retries = 3, delayMs = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await delay(delayMs);
    return retry(fn, retries - 1, delayMs);
  }
};

// Formatar bytes
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Gerar cor aleatória (hex)
const generateRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

// Verificar se é objeto vazio
const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0;
};

// Deep clone de objeto
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Mesclar objetos profundamente
const deepMerge = (target, source) => {
  const output = Object.assign({}, target);
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
};

// Verificar se é objeto
const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

// Converter tempo em formato legível
const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (mins === 0) {
    return `${hours} hora${hours !== 1 ? 's' : ''}`;
  }
  
  return `${hours}h ${mins}min`;
};

// Gerar iniciais do nome
const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

module.exports = {
  generateRandomCode,
  generateRandomToken,
  formatPhone,
  formatCPF,
  formatCEP,
  formatCurrency,
  formatDate,
  formatDateTime,
  daysBetween,
  calculateDistance,
  slugify,
  truncate,
  capitalize,
  capitalizeWords,
  generateMD5,
  generateSHA256,
  removeDuplicates,
  groupBy,
  sortBy,
  paginate,
  calculatePercentage,
  calculateAverage,
  range,
  delay,
  retry,
  formatBytes,
  generateRandomColor,
  isEmptyObject,
  deepClone,
  deepMerge,
  formatDuration,
  getInitials,
};
