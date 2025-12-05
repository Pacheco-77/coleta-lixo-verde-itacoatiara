import { Link } from 'react-router-dom';
import { MapPin, Package } from 'lucide-react';
import CollectorLayout from '@/components/layout/CollectorLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

const CollectorDashboard = () => {
  return (
    <CollectorLayout>
      <div>
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
      </div>
    </CollectorLayout>
  );
};

export default CollectorDashboard;
