import { ReactNode, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home,
  Plus,
  Package,
  MapPin,
  LogOut,
  Menu,
  X,
  Leaf,
  Calendar,
  Bell,
  MessageSquare
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import DropdownMenu, { MenuItem } from '@/components/ui/DropdownMenu';

interface CitizenLayoutProps {
  children: ReactNode;
}

const CitizenLayout = ({ children }: CitizenLayoutProps) => {
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
      path: '/cidadao/dashboard',
      show: true,
    },
    {
      label: 'Coletas',
      icon: Package,
      show: true,
      submenu: [
        {
          label: 'Nova Solicitação',
          icon: Plus,
          path: '/cidadao/nova-coleta',
          show: true,
        },
        {
          label: 'Minhas Coletas',
          icon: Calendar,
          path: '/cidadao/minhas-coletas',
          show: true,
        },
      ],
    },
    {
      label: 'Mapa',
      icon: MapPin,
      path: '/mapa',
      show: true,
    },
    {
      label: 'Denúncias',
      icon: MessageSquare,
      path: '/cidadao/denuncias',
      show: true,
    },
    {
      label: 'Notificações',
      icon: Bell,
      path: '/cidadao/notificacoes',
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
            <Link to="/cidadao/dashboard" className="flex items-center gap-2">
              <Leaf className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Coleta Verde</h1>
                <p className="text-xs text-gray-500">Portal do Cidadão</p>
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
        className={`fixed top-16 left-0 bottom-0 w-64 bg-blue-700 border-r border-blue-800 z-20 transition-transform duration-300 overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <nav className="p-4 space-y-1">
          <DropdownMenu 
            items={menuItems} 
            onItemClick={() => setSidebarOpen(false)}
            colorScheme="blue"
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

export default CitizenLayout;
