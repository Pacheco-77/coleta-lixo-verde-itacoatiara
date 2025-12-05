import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Calendar, MapPin, Package } from 'lucide-react';
import { citizenService } from '@/services/citizenService';
import CitizenLayout from '@/components/layout/CitizenLayout';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Loading from '@/components/ui/Loading';

const CitizenDashboard = () => {

  const { data: collections, isLoading } = useQuery({
    queryKey: ['my-collections'],
    queryFn: () => citizenService.getMyCollectionPoints({ limit: 5 }),
  });

  return (
    <CitizenLayout>
      <div>
        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/cidadao/nova-coleta">
            <Card hover className="h-full">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Plus className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Nova Coleta</h3>
                <p className="text-sm text-gray-600">Agendar nova coleta</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/cidadao/minhas-coletas">
            <Card hover className="h-full">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Minhas Coletas</h3>
                <p className="text-sm text-gray-600">Ver histórico</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/mapa">
            <Card hover className="h-full">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Mapa</h3>
                <p className="text-sm text-gray-600">Ver coletas próximas</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Collections */}
        <Card>
          <CardHeader>
            <CardTitle>Coletas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loading text="Carregando coletas..." />
            ) : collections?.data && collections.data.length > 0 ? (
              <div className="space-y-4">
                {collections.data.map((collection) => (
                  <div
                    key={collection._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {collection.address.street}, {collection.address.number}
                        </p>
                        <p className="text-sm text-gray-600">
                          {collection.address.neighborhood}
                        </p>
                      </div>
                    </div>
                    <span className={`status-badge status-${collection.status}`}>
                      {collection.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Você ainda não tem coletas agendadas</p>
                <Link to="/cidadao/nova-coleta">
                  <Button variant="primary">Agendar Primeira Coleta</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CitizenLayout>
  );
};

export default CitizenDashboard;
