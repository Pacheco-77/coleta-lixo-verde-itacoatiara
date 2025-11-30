import { Link, useLocation, Outlet } from 'react-router-dom';
import { LogOut, FileText, UserPlus, AlertCircle, MessageSquare, LayoutDashboard } from 'lucide-react';
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
    { path: '/admin/relatorios-coletas', label: 'Relatórios de Coletas', icon: FileText },
    { path: '/admin/cadastrar-coletores', label: 'Cadastrar Coletores', icon: UserPlus },
    { path: '/admin/denuncias', label: 'Denúncias', icon: AlertCircle },
    { path: '/admin/reclamacoes', label: 'Reclamações', icon: MessageSquare },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">Painel Admin</h1>
          <p className="text-sm text-gray-600 mt-1">Bem-vindo, {user?.name}</p>
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
                        ? 'bg-green-100 text-green-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
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

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
          >
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="bg-white shadow-sm border-b mb-6 -m-8 p-6">
          <h2 className="text-2xl font-bold text-gray-900">
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
