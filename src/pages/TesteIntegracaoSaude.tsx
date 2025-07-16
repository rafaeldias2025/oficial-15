import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HealthIntegrationTest } from '@/components/admin/HealthIntegrationTest';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Apple, Chrome } from 'lucide-react';

export default function TesteIntegracaoSaude() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              className="flex items-center gap-2 hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500 animate-pulse" />
              <h1 className="text-2xl font-bold text-gray-900">
                Teste de Integração de Saúde
              </h1>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Apple className="h-4 w-4" />
              <span>iOS</span>
              <span>•</span>
              <Chrome className="h-4 w-4" />
              <span>Android/Web</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg mb-4">
            <Heart className="h-6 w-6 text-red-500 animate-pulse" />
            <span className="text-lg font-semibold text-gray-800">
              Integração Apple Health & Google Fit
            </span>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🩺 Conecte Seus Dados de Saúde
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Veja como funciona a integração em tempo real com seus dados de saúde e fitness
          </p>
        </div>

        {/* Instruções Rápidas */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
            <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5" />
              📋 Como Testar (3 passos simples)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">1</div>
                <p className="text-sm text-blue-800">
                  <strong>Clique no botão</strong><br />
                  "🚀 CONECTAR AGORA"
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-2">2</div>
                <p className="text-sm text-green-800">
                  <strong>Aguarde 2 segundos</strong><br />
                  para simular a conexão
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-2">3</div>
                <p className="text-sm text-purple-800">
                  <strong>Veja os dados</strong><br />
                  em tempo real aparecendo
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Componente Principal */}
        <HealthIntegrationTest />

        {/* Informações Adicionais */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              ℹ️ Informações Técnicas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Apple className="h-4 w-4" />
                  Apple Health (iOS)
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Funciona em dispositivos iOS</li>
                  <li>• Integração com HealthKit</li>
                  <li>• Dados de peso, altura, passos</li>
                  <li>• Sincronização automática</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Chrome className="h-4 w-4" />
                  Google Fit (Android/Web)
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Funciona em Android e Web</li>
                  <li>• Integração com Google Fit API</li>
                  <li>• Dados de fitness e atividade</li>
                  <li>• Sincronização na nuvem</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 