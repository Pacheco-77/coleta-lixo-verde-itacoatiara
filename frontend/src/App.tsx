import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import PrivateRoute from './components/PrivateRoute';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Public Pages
import HomePage from './pages/public/HomePage'
import PublicMapPage from './pages/public/PublicMapPage'

// Citizen Pages
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import NewCollectionPage from './pages/citizen/NewCollectionPage';
import MyCollectionsPage from './pages/citizen/MyCollectionsPage';

// Collector Pages
import CollectorDashboard from './pages/collector/CollectorDashboard';
import CurrentRoutePage from './pages/collector/CurrentRoutePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersPage from './pages/admin/UsersPage';
import RoutesPage from './pages/admin/RoutesPage';
import ReportsPage from './pages/admin/ReportsPage';
import NewsManagementPage from './pages/admin/NewsManagementPage';

// Other Pages
import ProfilePage from './pages/ProfilePage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/mapa" element={<PublicMapPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* User Routes (anteriormente Citizen) */}
          <Route element={<PrivateRoute allowedRoles={['user']} />}>
            <Route path="/usuario/dashboard" element={<CitizenDashboard />} />
            <Route path="/usuario/nova-coleta" element={<NewCollectionPage />} />
            <Route path="/usuario/minhas-coletas" element={<MyCollectionsPage />} />
          </Route>

          {/* Rotas antigas redirecionam para as novas */}
          <Route path="/cidadao/*" element={<Navigate to="/usuario/dashboard" replace />} />

          {/* Collector Routes */}
          <Route element={<PrivateRoute allowedRoles={['coletor']} />}>
            <Route path="/coletor/dashboard" element={<CollectorDashboard />} />
            <Route path="/coletor/rota-atual" element={<CurrentRoutePage />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/usuarios" element={<UsersPage />} />
            <Route path="/admin/rotas" element={<RoutesPage />} />
            <Route path="/admin/relatorios" element={<ReportsPage />} />
            <Route path="/admin/noticias" element={<NewsManagementPage />} />
          </Route>

          {/* Shared Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/perfil" element={<ProfilePage />} />
          </Route>

          {/* 404 - Redirect to home */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>

      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />

      {/* React Query Devtools */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
