import { Link } from 'react-router-dom';
import { ArrowLeft, Leaf } from 'lucide-react';
import Button from '@/components/ui/Button';

const PublicMapPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Mapa de Coletas
              </h1>
            </div>
            <Link to="/">
              <Button variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Voltar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Map Container */}
      <div className="h-[calc(100vh-80px)] relative">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="h-8 w-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Mapa Interativo
            </h2>
            <p className="text-gray-600 mb-4">
              Visualize as próximas coletas na sua região
            </p>
            <p className="text-sm text-gray-500">
              (Integração com Leaflet será implementada aqui)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicMapPage;
