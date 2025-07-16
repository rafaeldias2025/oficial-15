import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Download, 
  TrendingUp, 
  Moon, 
  Droplets, 
  Heart, 
  Activity,
  BarChart3,
  Users,
  Calendar
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// Mock data para demonstração
const sleepData = [
  { data: '15/01', horas: 7.5 },
  { data: '16/01', horas: 6.5 },
  { data: '17/01', horas: 8.0 },
  { data: '18/01', horas: 7.0 },
  { data: '19/01', horas: 8.5 },
  { data: '20/01', horas: 7.5 },
  { data: '21/01', horas: 9.0 }
];

const waterData = [
  { data: '15/01', litros: 2.0 },
  { data: '16/01', litros: 1.5 },
  { data: '17/01', litros: 2.5 },
  { data: '18/01', litros: 2.2 },
  { data: '19/01', litros: 3.0 },
  { data: '20/01', litros: 2.8 },
  { data: '21/01', litros: 2.5 }
];

const stressData = [
  { data: '15/01', nivel: 4 },
  { data: '16/01', nivel: 6 },
  { data: '17/01', nivel: 3 },
  { data: '18/01', nivel: 5 },
  { data: '19/01', nivel: 2 },
  { data: '20/01', nivel: 4 },
  { data: '21/01', nivel: 3 }
];

const emotionalRadarData = [
  { aspecto: 'Autocuidado', valor: 8, fullMark: 10 },
  { aspecto: 'Gratidão', valor: 9, fullMark: 10 },
  { aspecto: 'Apoio Familiar', valor: 7, fullMark: 10 },
  { aspecto: 'Motivação', valor: 6, fullMark: 10 },
  { aspecto: 'Disciplina', valor: 5, fullMark: 10 },
  { aspecto: 'Bem-estar', valor: 8, fullMark: 10 }
];

const mockClients = [
  { id: '1', name: 'Ana Silva' },
  { id: '2', name: 'Carlos Santos' },
  { id: '3', name: 'Maria Costa' }
];

export const ClientReports: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [reportType, setReportType] = useState<string>('completo');

  const handleExportPDF = () => {
    // Aqui seria implementada a exportação em PDF
    console.log('Exportando relatório para:', { cliente: selectedClient, tipo: reportType });
    // Implementar com bibliotecas como jsPDF ou html2canvas
  };

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="bg-netflix-gray border-netflix-border text-netflix-text">
              <SelectValue placeholder="Selecionar Cliente" />
            </SelectTrigger>
            <SelectContent>
              {mockClients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="bg-netflix-gray border-netflix-border text-netflix-text">
              <SelectValue placeholder="Tipo de Relatório" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="completo">Relatório Completo</SelectItem>
              <SelectItem value="sono">Evolução do Sono</SelectItem>
              <SelectItem value="agua">Consumo de Água</SelectItem>
              <SelectItem value="estresse">Níveis de Estresse</SelectItem>
              <SelectItem value="emocional">Perfil Emocional</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleExportPDF}
          disabled={!selectedClient}
          className="instituto-button"
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar PDF
        </Button>
      </div>

      {selectedClient ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Evolução do Sono */}
          <Card className="bg-netflix-card border-netflix-border">
            <CardHeader>
              <CardTitle className="text-netflix-text flex items-center gap-2">
                <Moon className="h-5 w-5 text-instituto-purple" />
                Evolução do Sono
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={sleepData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="data" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a1a', 
                      border: '1px solid #333',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="horas" 
                    stroke="#8B5FBF" 
                    strokeWidth={2}
                    dot={{ fill: '#8B5FBF', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 p-3 bg-instituto-purple/10 rounded-lg">
                <div className="text-sm text-netflix-text">
                  <strong>Média:</strong> 7.6 horas/noite
                </div>
                <div className="text-xs text-netflix-text-muted mt-1">
                  Recomendação: 7-9 horas por noite
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consumo de Água */}
          <Card className="bg-netflix-card border-netflix-border">
            <CardHeader>
              <CardTitle className="text-netflix-text flex items-center gap-2">
                <Droplets className="h-5 w-5 text-instituto-blue" />
                Consumo de Água
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={waterData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="data" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a1a', 
                      border: '1px solid #333',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="litros" 
                    stroke="#4FC3F7" 
                    strokeWidth={2}
                    dot={{ fill: '#4FC3F7', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 p-3 bg-blue-500/10 rounded-lg">
                <div className="text-sm text-netflix-text">
                  <strong>Média:</strong> 2.4 litros/dia
                </div>
                <div className="text-xs text-netflix-text-muted mt-1">
                  Meta: 2.5 litros por dia
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Níveis de Estresse */}
          <Card className="bg-netflix-card border-netflix-border">
            <CardHeader>
              <CardTitle className="text-netflix-text flex items-center gap-2">
                <Activity className="h-5 w-5 text-instituto-orange" />
                Níveis de Estresse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={stressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="data" stroke="#666" />
                  <YAxis domain={[0, 10]} stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a1a', 
                      border: '1px solid #333',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="nivel" 
                    stroke="#FF7043" 
                    strokeWidth={2}
                    dot={{ fill: '#FF7043', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 p-3 bg-orange-500/10 rounded-lg">
                <div className="text-sm text-netflix-text">
                  <strong>Média:</strong> 4.0/10
                </div>
                <div className="text-xs text-netflix-text-muted mt-1">
                  Tendência: Em redução
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Radar Emocional */}
          <Card className="bg-netflix-card border-netflix-border">
            <CardHeader>
              <CardTitle className="text-netflix-text flex items-center gap-2">
                <Heart className="h-5 w-5 text-instituto-green" />
                Perfil Emocional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={emotionalRadarData}>
                  <PolarGrid stroke="#333" />
                  <PolarAngleAxis dataKey="aspecto" tick={{ fontSize: 10, fill: '#666' }} />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 10]} 
                    tick={{ fontSize: 8, fill: '#666' }}
                  />
                  <Radar
                    name="Pontuação"
                    dataKey="valor"
                    stroke="#66BB6A"
                    fill="#66BB6A"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-3 bg-green-500/10 rounded-lg">
                <div className="text-sm text-netflix-text">
                  <strong>Score Geral:</strong> 7.2/10
                </div>
                <div className="text-xs text-netflix-text-muted mt-1">
                  Área de foco: Motivação e Disciplina
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-netflix-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-bold text-netflix-text mb-2">
              Relatórios Personalizados
            </h3>
            <p className="text-netflix-text-muted mb-6">
              Selecione um cliente para visualizar gráficos detalhados de progresso
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="p-4 bg-netflix-hover rounded-lg">
                <Moon className="h-8 w-8 text-instituto-purple mx-auto mb-2" />
                <div className="text-sm text-netflix-text">Sono</div>
              </div>
              <div className="p-4 bg-netflix-hover rounded-lg">
                <Droplets className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-sm text-netflix-text">Hidratação</div>
              </div>
              <div className="p-4 bg-netflix-hover rounded-lg">
                <Activity className="h-8 w-8 text-instituto-orange mx-auto mb-2" />
                <div className="text-sm text-netflix-text">Estresse</div>
              </div>
              <div className="p-4 bg-netflix-hover rounded-lg">
                <Heart className="h-8 w-8 text-instituto-green mx-auto mb-2" />
                <div className="text-sm text-netflix-text">Emocional</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-instituto-orange" />
              <div>
                <div className="text-2xl font-bold text-netflix-text">{mockClients.length}</div>
                <div className="text-sm text-netflix-text-muted">Clientes Ativos</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-instituto-green" />
              <div>
                <div className="text-2xl font-bold text-netflix-text">89%</div>
                <div className="text-sm text-netflix-text-muted">Taxa de Adesão</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-netflix-card border-netflix-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-instituto-purple" />
              <div>
                <div className="text-2xl font-bold text-netflix-text">+15%</div>
                <div className="text-sm text-netflix-text-muted">Melhoria Geral</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};