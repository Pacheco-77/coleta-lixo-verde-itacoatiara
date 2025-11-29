import { useState } from 'react';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/axios';
import { Mail, Lock, Leaf, Eye, EyeOff } from 'lucide-react';
import { loginSchema } from '@/utils/validation';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';


type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const response = await authService.login(data);
      
      setAuth(response.user, response.token, response.refreshToken);
      toast.success('Login realizado com sucesso!');

      // Redirect based on role
      const userRole = response.user?.role || 'user';
      switch (userRole) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'coletor':
          navigate('/coletor/dashboard');
          break;
        case 'user':
          navigate('/usuario/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error: unknown) {
      toast.error(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <Leaf className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema de Coleta de Lixo Verde
          </h1>
          <p className="text-gray-600">Itacoatiara - AM</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Entrar</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
              error={errors.email?.message}
              {...register('email')}
            />
            <div className="relative">
              <Input
                label="Senha"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 focus:outline-none"
                title={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-600">Lembrar-me</span>
              </label>
              <Link
                to="/recuperar-senha"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              Entrar
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Link
                to="/register"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>

        {/* Public Access */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Voltar para página inicial
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
