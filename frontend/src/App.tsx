import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import PrivateRoute from './components/PrivateRoute';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Public Pages
import HomePage from './pages/public/HomePage';
import PublicMapPage from './pages/public/PublicMapPage';
import MapaColetaPage from './pages/public/MapaColetaPage';
import CheckInPage from './pages/public/CheckInPage';

// Citizen Pages
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import NewCollectionPage from './pages/citizen/NewCollectionPage';
import MyCollectionsPage from './pages/citizen/MyCollectionsPage';

// Collector Pages
import CollectorDashboard from './pages/collector/CollectorDashboard';
import CurrentRoutePage from './pages/collector/CurrentRoutePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import DashboardHome from './pages/admin/DashboardHome';
import UsersPage from './pages/admin/UsersPage';
import RoutesPage from './pages/admin/RoutesPage';
import ReportsPage from './pages/admin/ReportsPage';
import NewsManagementPage from './pages/admin/NewsManagementPage';
import RelatoriosColetasPage from './pages/admin/RelatoriosColetasPage';
import CadastrarColetoresPage from './pages/admin/CadastrarColetoresPage';
import DenunciasPage from './pages/admin/DenunciasPage';
import ReclamacoesPage from './pages/admin/ReclamacoesPage';
import RuasItacoatiaraPage from './pages/admin/RuasItacoatiaraPage';
import MapaTempoRealPage from './pages/admin/MapaTempoRealPage';

// Other Pages
import ProfilePage from './pages/ProfilePage';
import UnauthorizedPage from './pages/UnauthorizedPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/mapa" element={<PublicMapPage />} />
          <Route path="/mapa-coleta" element={<MapaColetaPage />} />
          <Route path="/checkin/:id" element={<CheckInPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

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
            <Route path="/admin" element={<AdminDashboard />}>
              <Route index element={<DashboardHome />} />
              <Route path="relatorios-coletas" element={<RelatoriosColetasPage />} />
              <Route path="cadastrar-coletores" element={<CadastrarColetoresPage />} />
              <Route path="denuncias" element={<DenunciasPage />} />
              <Route path="reclamacoes" element={<ReclamacoesPage />} />
              <Route path="ruas-itacoatiara" element={<RuasItacoatiaraPage />} />
              <Route path="mapa-tempo-real" element={<MapaTempoRealPage />} />
              <Route path="usuarios" element={<UsersPage />} />
              <Route path="rotas" element={<RoutesPage />} />
              <Route path="relatorios" element={<ReportsPage />} />
              <Route path="noticias" element={<NewsManagementPage />} />
            </Route>
          </Route>

          {/* Shared Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/perfil" element={<ProfilePage />} />
          </Route>

          {/* 404 - Redirect to home */}
          <Route path="*" element={<HomePage />} />
        </Routes>
        
        {/* Toast Notifications */}
        <Toaster position="top-right" richColors />

        {/* React Query Devtools */}
        <ReactQueryDevtools initialIsOpen={false} />
      </BrowserRouter>
  );
}

export default App;
