import { ReactNode, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home,
  MapPin,
  Package,
  Route as RouteIcon,
  LogOut,
  Menu,
  X,
  Leaf,
  CheckCircle,
  Navigation,
  BarChart3,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import DropdownMenu, { MenuItem } from '@/components/ui/DropdownMenu';

interface CollectorLayoutProps {
  children: ReactNode;
}

const CollectorLayout = ({ children }: CollectorLayoutProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: Home,
      path: '/coletor/dashboard',
      show: true,
    },
    {
      label: 'Rotas',
      icon: RouteIcon,
      show: true,
      submenu: [
        {
          label: 'Rota Atual',
          icon: Navigation,
          path: '/coletor/rota-atual',
          show: true,
        },
        {
          label: 'Histórico',
          icon: Package,
          path: '/coletor/historico',
          show: true,
        },
      ],
    },
    {
      label: 'Check-in',
      icon: CheckCircle,
      path: '/coletor/checkin',
      show: true,
    },
    {
      label: 'Localização',
      icon: MapPin,
      path: '/coletor/localizacao',
      show: true,
    },
    {
      label: 'Desempenho',
      icon: BarChart3,
      show: true,
      submenu: [
        {
          label: 'Minhas Métricas',
          icon: BarChart3,
          path: '/coletor/metricas',
          show: true,
        },
        {
          label: 'Relatórios',
          icon: Package,
          path: '/coletor/relatorios',
          show: true,
        },
      ],
    },
    {
      label: 'Problemas',
      icon: AlertCircle,
      path: '/coletor/problemas',
      show: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link to="/coletor/dashboard" className="flex items-center gap-2">
              <Leaf className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Coleta Verde</h1>
                <p className="text-xs text-gray-500">Portal do Coletor</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              leftIcon={<LogOut className="w-4 h-4" />}
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-orange-600 border-r border-orange-700 z-20 transition-transform duration-300 overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <nav className="p-4 space-y-1">
          <DropdownMenu 
            items={menuItems} 
            onItemClick={() => setSidebarOpen(false)}
            colorScheme="orange"
          />
        </nav>
      </aside>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="pt-16 lg:pl-64">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default CollectorLayout;
