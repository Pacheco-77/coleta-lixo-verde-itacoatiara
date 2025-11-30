import { Link, useLocation, Outlet } from 'react-router-dom';
import { LogOut, FileText, UserPlus, AlertCircle, MessageSquare, LayoutDashboard, MapPin, Map } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const AdminDashboard = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/mapa-tempo-real', label: 'Mapa em Tempo Real', icon: Map },
    { path: '/admin/relatorios-coletas', label: 'Relatórios de Coletas', icon: FileText },
    { path: '/admin/cadastrar-coletores', label: 'Cadastrar Coletores', icon: UserPlus },
    { path: '/admin/denuncias', label: 'Denúncias', icon: AlertCircle },
    { path: '/admin/reclamacoes', label: 'Reclamações', icon: MessageSquare },
    { path: '/admin/ruas-itacoatiara', label: 'Ruas de Itacoatiara', icon: MapPin },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-cinza-claro flex">
      {/* Sidebar - Verde Escuro */}
      <aside className="w-64 bg-primary-800 shadow-lg flex flex-col">
        <div className="p-6 border-b border-primary-700">
          <h1 className="text-xl font-bold text-white">Painel Admin</h1>
          <p className="text-sm text-primary-100 mt-1">Bem-vindo, {user?.name}</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      active
                        ? 'bg-primary-500 text-white font-medium shadow-md'
                        : 'text-white hover:bg-primary-500/80'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-primary-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-red-600 transition-colors w-full"
          >
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="bg-primary-800 text-white shadow-sm border-b mb-6 -m-8 p-6">
          <h2 className="text-2xl font-bold">
            Bem-vindo, {user?.name} - Painel do Administrador
          </h2>
        </div>
        
        <div className="mt-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
