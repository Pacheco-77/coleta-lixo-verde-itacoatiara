import { z } from 'zod';

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
});

// Register validation schema
export const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
    .regex(/[@$!%*?&]/, 'Senha deve conter pelo menos um caractere especial (@$!%*?&)'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

// Collection point validation schema
export const collectionPointSchema = z.object({
  address: z.object({
    street: z.string().min(3, 'Rua é obrigatória'),
    number: z.string().min(1, 'Número é obrigatório'),
    complement: z.string().optional(),
    neighborhood: z.string().min(3, 'Bairro é obrigatório'),
    zipCode: z.string().optional(),
    reference: z.string().optional(),
  }),
  wasteType: z.enum(['folhas', 'galhos', 'grama', 'flores', 'frutas', 'vegetais', 'outros'], {
    errorMap: () => ({ message: 'Tipo de resíduo é obrigatório' }),
  }),
  estimatedQuantity: z.object({
    value: z.number().min(1, 'Quantidade deve ser maior que 0'),
    unit: z.enum(['kg', 'sacos', 'm3']),
  }),
  description: z.string().max(500, 'Descrição deve ter no máximo 500 caracteres').optional(),
  scheduledDate: z.string().optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
});

// User validation schema
export const userSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres').optional(),
  role: z.enum(['admin', 'collector', 'citizen']),
  phone: z.string().optional(),
});

// Route validation schema
export const routeSchema = z.object({
  name: z.string().min(3, 'Nome da rota é obrigatório'),
  collector: z.string().min(1, 'Coletor é obrigatório'),
  points: z.array(z.string()).min(1, 'Pelo menos um ponto é necessário'),
  scheduledDate: z.string().min(1, 'Data é obrigatória'),
  notes: z.string().optional(),
});

// Change password validation schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, 'Senha atual é obrigatória'),
  newPassword: z.string().min(8, 'Nova senha deve ter no mínimo 8 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

// Profile update validation schema
export const profileSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    zipCode: z.string().optional(),
  }).optional(),
});

// Report generation validation schema
export const reportSchema = z.object({
  type: z.string().min(1, 'Tipo de relatório é obrigatório'),
  startDate: z.string().min(1, 'Data inicial é obrigatória'),
  endDate: z.string().min(1, 'Data final é obrigatória'),
});

// Validate CEP format
export const validateCEP = (cep: string): boolean => {
  const cleaned = cep.replace(/\D/g, '');
  return cleaned.length === 8;
};

// Validate phone format
export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 || cleaned.length === 11;
};

// Validate coordinates
export const validateCoordinates = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};
