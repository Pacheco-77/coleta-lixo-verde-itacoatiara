import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Route as RouteIcon, 
  FileText, 
  Newspaper,
  LogOut,
  Menu,
  X,
  Leaf,
  UserCog,
  Shield,
  BarChart3,
  FileBarChart,
  TrendingUp
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { isSpecificAdmin } from '@/types';
import Button from '@/components/ui/Button';
import DropdownMenu, { MenuItem } from '@/components/ui/DropdownMenu';
import { useState } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Verificar se é admin específico
  const isSpecificAdminUser = user?.email ? isSpecificAdmin(user.email) : false;

  const menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
      show: true,
    },
    {
      label: 'Usuários',
      icon: Users,
      show: true,
      submenu: [
        {
          label: 'Gerenciar Usuários',
          icon: UserCog,
          path: '/admin/usuarios',
          show: true,
        },
        {
          label: 'Permissões',
          icon: Shield,
          path: '/admin/usuarios/permissoes',
          show: true,
        },
      ],
    },
    {
      label: 'Rotas',
      icon: RouteIcon,
      path: '/admin/rotas',
      show: true,
    },
    {
      label: 'Relatórios',
      icon: FileText,
      show: true,
      submenu: [
        {
          label: 'Visão Geral',
          icon: BarChart3,
          path: '/admin/relatorios',
          show: true,
        },
        {
          label: 'Análise de Dados',
          icon: FileBarChart,
          path: '/admin/relatorios/analise',
          show: true,
        },
        {
          label: 'Estatísticas',
          icon: TrendingUp,
          path: '/admin/relatorios/estatisticas',
          show: true,
        },
      ],
    },
    {
      label: 'Notícias',
      icon: Newspaper,
      path: '/admin/noticias',
      show: isSpecificAdminUser, // Apenas admins específicos
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
            <Link to="/admin/dashboard" className="flex items-center gap-2 no-underline">
              <Leaf className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Coleta Verde</h1>
                <p className="text-xs text-gray-500">Painel Admin</p>
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
        className={`fixed top-16 left-0 bottom-0 w-64 bg-green-700 border-r border-green-800 z-20 transition-transform duration-300 overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <nav className="p-4 space-y-1">
          <DropdownMenu 
            items={menuItems} 
            onItemClick={() => setSidebarOpen(false)}
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

export default AdminLayout;
