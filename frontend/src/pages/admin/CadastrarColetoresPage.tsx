import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { UserPlus, Mail, Phone, MapPin } from 'lucide-react';

const CadastrarColetoresPage = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    endereco: '',
    cep: '',
    cidade: 'Itacoatiara',
    estado: 'AM',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Cadastrar coletor:', formData);
    // TODO: Implementar chamada à API
    alert('Coletor cadastrado com sucesso!');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary-800 flex items-center gap-3">
          <UserPlus className="h-8 w-8 text-primary-500" />
          Cadastrar Coletores
        </h1>
        <p className="text-cinza-escuro mt-1">Adicione novos coletores ao sistema</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Coletor</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <Input
                      id="nome"
                      name="nome"
                      type="text"
                      required
                      value={formData.nome}
                      onChange={handleChange}
                      placeholder="João Silva"
                    />
                  </div>

                  <div>
                    <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
                      CPF *
                    </label>
                    <Input
                      id="cpf"
                      name="cpf"
                      type="text"
                      required
                      value={formData.cpf}
                      onChange={handleChange}
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="h-4 w-4 inline mr-1" />
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="joao.silva@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="h-4 w-4 inline mr-1" />
                      Telefone *
                    </label>
                    <Input
                      id="telefone"
                      name="telefone"
                      type="tel"
                      required
                      value={formData.telefone}
                      onChange={handleChange}
                      placeholder="(92) 99999-9999"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Endereço *
                  </label>
                  <Input
                    id="endereco"
                    name="endereco"
                    type="text"
                    required
                    value={formData.endereco}
                    onChange={handleChange}
                    placeholder="Rua das Flores, 123"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-2">
                      CEP *
                    </label>
                    <Input
                      id="cep"
                      name="cep"
                      type="text"
                      required
                      value={formData.cep}
                      onChange={handleChange}
                      placeholder="69100-000"
                    />
                  </div>

                  <div>
                    <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-2">
                      Cidade *
                    </label>
                    <Input
                      id="cidade"
                      name="cidade"
                      type="text"
                      required
                      value={formData.cidade}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
                      Estado *
                    </label>
                    <select
                      id="estado"
                      name="estado"
                      required
                      value={formData.estado}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="AM">Amazonas</option>
                      <option value="AC">Acre</option>
                      <option value="AP">Amapá</option>
                      <option value="PA">Pará</option>
                      <option value="RO">Rondônia</option>
                      <option value="RR">Roraima</option>
                      <option value="TO">Tocantins</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" variant="primary" className="flex-1">
                    Cadastrar Coletor
                  </Button>
                  <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Coletores Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-sm text-gray-900">João Silva</p>
                  <p className="text-xs text-gray-500">joao@email.com</p>
                  <p className="text-xs text-gray-500 mt-1">Cadastrado há 2 dias</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-sm text-gray-900">Maria Santos</p>
                  <p className="text-xs text-gray-500">maria@email.com</p>
                  <p className="text-xs text-gray-500 mt-1">Cadastrado há 5 dias</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-sm text-gray-900">Pedro Costa</p>
                  <p className="text-xs text-gray-500">pedro@email.com</p>
                  <p className="text-xs text-gray-500 mt-1">Cadastrado há 1 semana</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CadastrarColetoresPage;
