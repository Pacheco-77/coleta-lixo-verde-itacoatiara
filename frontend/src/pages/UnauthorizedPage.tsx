import { Link } from 'react-router-dom';
import { ShieldX, Home, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <ShieldX className="h-12 w-12 text-red-600" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Acesso Negado</h1>
            <p className="text-lg text-gray-600">Erro 403 - Não Autorizado</p>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">
              Você não tem permissão para acessar esta página. 
              Esta área é restrita a usuários com privilégios específicos.
            </p>
          </div>
          
          <div className="space-y-3">
            <Link to="/" className="block">
              <Button className="w-full" leftIcon={<Home className="h-4 w-4" />}>
                Voltar para Página Inicial
              </Button>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="w-full px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para página anterior
            </button>
          </div>
          
          <div className="text-xs text-gray-500 pt-4 border-t">
            Se você acredita que deveria ter acesso, entre em contato com o administrador do sistema.
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
