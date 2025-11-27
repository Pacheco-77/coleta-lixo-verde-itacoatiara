import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Format date
export const formatDate = (date: string | Date, pattern: string = 'dd/MM/yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, pattern, { locale: ptBR });
  } catch {
    return 'Data inválida';
  }
};

// Format date and time
export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, "dd/MM/yyyy 'às' HH:mm");
};

// Format relative time (e.g., "há 2 horas")
export const formatRelativeTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: ptBR });
  } catch {
    return 'Data inválida';
  }
};

// Format phone number
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
};

// Format CEP
export const formatCEP = (cep: string): string => {
  const cleaned = cep.replace(/\D/g, '');
  return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
};

// Format quantity
export const formatQuantity = (value: number, unit: string): string => {
  return `${value.toLocaleString('pt-BR')} ${unit}`;
};

// Format status
export const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'Pendente',
    scheduled: 'Agendado',
    in_progress: 'Em Andamento',
    collected: 'Coletado',
    cancelled: 'Cancelado',
    completed: 'Concluído',
  };
  
  return statusMap[status] || status;
};

// Format waste type
export const formatWasteType = (type: string): string => {
  const typeMap: Record<string, string> = {
    folhas: 'Folhas Secas',
    galhos: 'Galhos e Podas',
    grama: 'Grama Cortada',
    flores: 'Flores e Plantas',
    frutas: 'Restos de Frutas',
    vegetais: 'Restos de Vegetais',
    outros: 'Outros',
  };
  
  return typeMap[type] || type;
};

// Format priority
export const formatPriority = (priority: string): string => {
  const priorityMap: Record<string, string> = {
    low: 'Baixa',
    normal: 'Normal',
    high: 'Alta',
    urgent: 'Urgente',
  };
  
  return priorityMap[priority] || priority;
};

// Format role
export const formatRole = (role: string): string => {
  const roleMap: Record<string, string> = {
    admin: 'Administrador',
    collector: 'Coletor',
    citizen: 'Cidadão',
  };
  
  return roleMap[role] || role;
};

// Format distance
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
};

// Format duration
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (mins === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${mins}min`;
};

// Truncate text
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get initials from name
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};
