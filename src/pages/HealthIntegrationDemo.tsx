import React from 'react';
import { HealthIntegration } from '@/components/HealthIntegration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, Smartphone, Zap, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HealthIntegrationDemo() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Heart className="h-6 w-6 text-red-500" />,
      title: "Sincronização Automática",
      description: "Dados de peso, altura e composição corporal sincronizados automaticamente",
      status: "Ativo"
    },
    {
      icon: <Smartphone className="h-6 w-6 text-blue-500" />,
      title: "Compatibilidade Multiplataforma",
      description: "Funciona com iOS (Apple Health) e Android (Google Fit)",
      status: "Ativo"
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: "Dados em Tempo Real",
      description: "Atualizações instantâneas dos seus dados de saúde",
      status: "Ativo"
    }
  ];

  const integrationBenefits = [
    "✅ Eliminação de entrada manual de dados",
    "✅ Histórico completo de saúde e fitness",
    "✅ Sincronização automática e segura",
    "✅ Compatibilidade com dispositivos wearables",
    "✅ Análise avançada de tendências",
    "✅ Backup automático na nuvem"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Integração com Apple Health & Google Fit
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conecte seus dados de saúde nativos e tenha uma visão completa do seu progresso
            </p>
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  {feature.icon}
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {feature.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <CheckCircle className="h-6 w-6" />
              Benefícios da Integração
            </CardTitle>
            <CardDescription className="text-blue-600">
              Vantagens de conectar seus aplicativos de saúde
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integrationBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-blue-700">
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Integration Component */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <HealthIntegration />
        </div>

        {/* Technical Information */}
        <Card className="mt-8 border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800">Informações Técnicas</CardTitle>
            <CardDescription>
              Detalhes sobre a implementação da integração
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Apple Health (iOS)</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Utiliza HealthKit Framework</li>
                  <li>• Suporte a todos os tipos de dados de saúde</li>
                  <li>• Integração nativa com aplicativos iOS</li>
                  <li>• Sincronização em tempo real</li>
                  <li>• Compatível com Apple Watch</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Google Fit (Android/Web)</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Utiliza Google Fit API</li>
                  <li>• Compatível com Android e Web</li>
                  <li>• Suporte a fitness trackers</li>
                  <li>• Sincronização na nuvem</li>
                  <li>• Integração com Wear OS</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Dados Suportados</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                <span>• Peso</span>
                <span>• Altura</span>
                <span>• Composição corporal</span>
                <span>• Frequência cardíaca</span>
                <span>• Passos</span>
                <span>• Calorias</span>
                <span>• Sono</span>
                <span>• Água</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader className="text-center">
            <CardTitle className="text-green-800">
              Comece Agora a Sincronizar Seus Dados
            </CardTitle>
            <CardDescription className="text-green-600">
              Configure sua integração acima e tenha todos os seus dados de saúde em um só lugar
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => document.getElementById('health-integration')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Heart className="h-4 w-4 mr-2" />
              Configurar Integração
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 