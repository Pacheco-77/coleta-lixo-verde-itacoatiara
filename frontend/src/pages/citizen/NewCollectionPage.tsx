import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Camera, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useMutation } from '@tanstack/react-query';
import { citizenService } from '@/services/citizenService';
import { toast } from 'react-hot-toast';

const NewCollectionPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    wasteType: 'folhas',
    estimatedQuantity: {
      value: 1,
      unit: 'kg'
    },
    description: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      reference: ''
    },
    location: {
      coordinates: [] as number[]
    },
    scheduledDate: '',
    scheduledTimeSlot: {
      start: '08:00',
      end: '12:00'
    }
  });

  const createCollectionMutation = useMutation({
    mutationFn: citizenService.registerCollectionPoint,
    onSuccess: () => {
      toast.success('Solicitação de coleta cadastrada com sucesso!');
      navigate('/usuario/minhas-coletas');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao cadastrar solicitação');
    }
  });

  const getCurrentLocation = () => {
    setLocationLoading(true);
    
    if (!navigator.geolocation) {
      toast.error('Geolocalização não suportada pelo navegador');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          location: {
            coordinates: [longitude, latitude]
          }
        }));
        toast.success('Localização capturada com sucesso!');
        setLocationLoading(false);
      },
      (error) => {
        toast.error('Erro ao obter localização. Verifique as permissões.');
        console.error('Geolocation error:', error);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!formData.address.street || !formData.address.number || !formData.address.neighborhood) {
      toast.error('Preencha todos os campos obrigatórios do endereço');
      return;
    }

    if (formData.location.coordinates.length !== 2) {
      toast.error('Capture a localização GPS antes de enviar');
      return;
    }

    if (!formData.scheduledDate) {
      toast.error('Selecione uma data para a coleta');
      return;
    }

    setLoading(true);
    
    try {
      await createCollectionMutation.mutateAsync(formData as any);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/usuario/dashboard">
            <Button variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Voltar
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Agendar Nova Coleta de Lixo Verde</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Preencha as informações sobre o material verde a ser coletado
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Tipo de Resíduo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Resíduo Verde *
                </label>
                <select
                  name="wasteType"
                  value={formData.wasteType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="folhas">Folhas secas</option>
                  <option value="galhos">Galhos e podas</option>
                  <option value="grama">Grama cortada</option>
                  <option value="flores">Flores e plantas</option>
                  <option value="frutas">Restos de frutas</option>
                  <option value="vegetais">Restos de vegetais</option>
                  <option value="outros">Outros resíduos verdes</option>
                </select>
              </div>

              {/* Quantidade Estimada */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade Aproximada *
                  </label>
                  <input
                    type="number"
                    name="estimatedQuantity.value"
                    value={formData.estimatedQuantity.value}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unidade *
                  </label>
                  <select
                    name="estimatedQuantity.unit"
                    value={formData.estimatedQuantity.unit}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="kg">Quilogramas (kg)</option>
                    <option value="sacos">Sacos</option>
                    <option value="m3">Metros cúbicos (m³)</option>
                  </select>
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição Detalhada
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  maxLength={500}
                  placeholder="Descreva o material verde a ser coletado..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/500 caracteres
                </p>
              </div>

              {/* Endereço */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Endereço da Coleta</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rua/Avenida *
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número *
                    </label>
                    <input
                      type="text"
                      name="address.number"
                      value={formData.address.number}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complemento
                  </label>
                  <input
                    type="text"
                    name="address.complement"
                    value={formData.address.complement}
                    onChange={handleChange}
                    placeholder="Apt, casa, bloco..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bairro *
                  </label>
                  <input
                    type="text"
                    name="address.neighborhood"
                    value={formData.address.neighborhood}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ponto de Referência
                  </label>
                  <input
                    type="text"
                    name="address.reference"
                    value={formData.address.reference}
                    onChange={handleChange}
                    placeholder="Próximo à padaria, em frente ao posto..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Localização GPS */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localização GPS *
                </label>
                <Button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  variant={formData.location.coordinates.length === 2 ? 'success' : 'outline'}
                  leftIcon={locationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                  className="w-full"
                >
                  {locationLoading ? 'Capturando localização...' : 
                   formData.location.coordinates.length === 2 ? 
                   `Localização capturada (${formData.location.coordinates[1].toFixed(6)}, ${formData.location.coordinates[0].toFixed(6)})` :
                   'Capturar Localização Atual'}
                </Button>
                <p className="text-xs text-gray-500 mt-1">
                  Permita o acesso à localização para marcar o ponto exato da coleta
                </p>
              </div>

              {/* Agendamento */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Agendamento</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Desejada *
                  </label>
                  <input
                    type="date"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Período Preferencial
                  </label>
                  <select
                    name="scheduledTimeSlot.start"
                    value={formData.scheduledTimeSlot.start}
                    onChange={(e) => {
                      const start = e.target.value;
                      const endMap: Record<string, string> = {
                        '08:00': '12:00',
                        '13:00': '17:00'
                      };
                      setFormData(prev => ({
                        ...prev,
                        scheduledTimeSlot: {
                          start,
                          end: endMap[start] || '12:00'
                        }
                      }));
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="08:00">Manhã (08:00 - 12:00)</option>
                    <option value="13:00">Tarde (13:00 - 17:00)</option>
                  </select>
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/usuario/dashboard')}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading || createCollectionMutation.isPending}
                  className="flex-1"
                >
                  {loading || createCollectionMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Cadastrando...
                    </>
                  ) : (
                    'Cadastrar Solicitação'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default NewCollectionPage;
