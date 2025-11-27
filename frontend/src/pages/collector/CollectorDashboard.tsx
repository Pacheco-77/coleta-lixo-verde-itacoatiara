import { Link } from 'react-router-dom';
import { LogOut, MapPin, Package } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

const CollectorDashboard = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Olá, {user?.name}!
              </h1>
              <p className="text-sm text-gray-600">Painel do Coletor</p>
            </div>
            <Button variant="outline" onClick={handleLogout} leftIcon={<LogOut className="h-4 w-4" />}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link to="/coletor/rota-atual">
            <Card hover className="h-full">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Rota Atual</h3>
                <p className="text-sm text-gray-600">Ver rota do dia</p>
              </CardContent>
            </Card>
          </Link>

          <Card hover className="h-full">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Histórico</h3>
              <p className="text-sm text-gray-600">Ver coletas anteriores</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Métricas do coletor serão exibidas aqui</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CollectorDashboard;
