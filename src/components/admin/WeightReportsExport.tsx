import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Download, FileSpreadsheet, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  nome_completo_dados: string | null;
}

interface WeightEntry {
  id: string;
  user_id: string;
  peso_kg: number;
  data_medicao: string;
  circunferencia_abdominal_cm?: number;
  gordura_corporal_pct?: number;
  massa_muscular_kg?: number;
  agua_corporal_pct?: number;
  gordura_visceral?: number;
  idade_metabolica?: number;
  massa_ossea_kg?: number;
  taxa_metabolica_basal?: number;
  tipo_corpo?: string;
  origem_medicao: string;
  imc?: number;
  created_at: string;
}

interface WeightReportsExportProps {
  selectedUser: User;
  weightHistory: WeightEntry[];
}

export const WeightReportsExport: React.FC<WeightReportsExportProps> = ({
  selectedUser,
  weightHistory,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const getUserDisplayName = () => {
    return selectedUser.nome_completo_dados || selectedUser.full_name || selectedUser.email;
  };

  const exportToCSV = () => {
    if (weightHistory.length === 0) {
      toast({
        title: "Aviso",
        description: "Não há dados para exportar",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);

    try {
      const headers = [
        'Data',
        'Peso (kg)',
        'IMC',
        'Circunferência Abdominal (cm)',
        'Gordura Corporal (%)',
        'Massa Muscular (kg)',
        'Água Corporal (%)',
        'Gordura Visceral',
        'Idade Metabólica',
        'Massa Óssea (kg)',
        'Taxa Metabólica Basal',
        'Tipo Corpo',
        'Origem'
      ];

      const csvContent = [
        headers.join(','),
        ...weightHistory.map(entry => [
          format(new Date(entry.data_medicao), 'dd/MM/yyyy', { locale: ptBR }),
          entry.peso_kg,
          entry.imc || '',
          entry.circunferencia_abdominal_cm || '',
          entry.gordura_corporal_pct || '',
          entry.massa_muscular_kg || '',
          entry.agua_corporal_pct || '',
          entry.gordura_visceral || '',
          entry.idade_metabolica || '',
          entry.massa_ossea_kg || '',
          entry.taxa_metabolica_basal || '',
          entry.tipo_corpo || '',
          entry.origem_medicao
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `pesagens-${getUserDisplayName()}-${format(new Date(), 'dd-MM-yyyy')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Sucesso",
        description: "Relatório exportado com sucesso",
      });
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível exportar o relatório",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const generatePrintReport = () => {
    if (weightHistory.length === 0) {
      toast({
        title: "Aviso",
        description: "Não há dados para imprimir",
        variant: "destructive"
      });
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório de Pesagens - ${getUserDisplayName()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .client-info { background: #f5f5f5; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
            .summary-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px; }
            .stat-card { background: #e8f4fd; padding: 15px; border-radius: 5px; text-align: center; }
            .data-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .data-table th, .data-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .data-table th { background-color: #f2f2f2; font-weight: bold; }
            .data-table tr:nth-child(even) { background-color: #f9f9f9; }
            .trend-indicator { font-weight: bold; }
            .trend-positive { color: #10b981; }
            .trend-negative { color: #ef4444; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Relatório de Pesagens</h1>
            <h2>Trend Track Wellness Hub</h2>
            <p>Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
          </div>
          
          <div class="client-info">
            <h3>Informações do Cliente</h3>
            <p><strong>Nome:</strong> ${getUserDisplayName()}</p>
            <p><strong>Email:</strong> ${selectedUser.email}</p>
            <p><strong>Período:</strong> ${format(new Date(weightHistory[weightHistory.length - 1].data_medicao), 'dd/MM/yyyy', { locale: ptBR })} a ${format(new Date(weightHistory[0].data_medicao), 'dd/MM/yyyy', { locale: ptBR })}</p>
            <p><strong>Total de registros:</strong> ${weightHistory.length}</p>
          </div>

          <div class="summary-stats">
            <div class="stat-card">
              <h4>Peso Atual</h4>
              <p style="font-size: 24px; font-weight: bold; margin: 0;">${weightHistory[0].peso_kg}kg</p>
            </div>
            <div class="stat-card">
              <h4>IMC Atual</h4>
              <p style="font-size: 24px; font-weight: bold; margin: 0;">${weightHistory[0].imc?.toFixed(1) || '--'}</p>
            </div>
            <div class="stat-card">
              <h4>Variação Total</h4>
              <p style="font-size: 24px; font-weight: bold; margin: 0;" class="trend-indicator ${(weightHistory[0].peso_kg - weightHistory[weightHistory.length - 1].peso_kg) < 0 ? 'trend-positive' : 'trend-negative'}">
                ${(weightHistory[0].peso_kg - weightHistory[weightHistory.length - 1].peso_kg) > 0 ? '+' : ''}${(weightHistory[0].peso_kg - weightHistory[weightHistory.length - 1].peso_kg).toFixed(1)}kg
              </p>
            </div>
          </div>

          <table class="data-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Peso (kg)</th>
                <th>IMC</th>
                <th>Circunf. Abd. (cm)</th>
                <th>Gordura (%)</th>
                <th>Massa Musc. (kg)</th>
                <th>Origem</th>
              </tr>
            </thead>
            <tbody>
              ${weightHistory.map(entry => `
                <tr>
                  <td>${format(new Date(entry.data_medicao), 'dd/MM/yyyy', { locale: ptBR })}</td>
                  <td>${entry.peso_kg}</td>
                  <td>${entry.imc?.toFixed(1) || '--'}</td>
                  <td>${entry.circunferencia_abdominal_cm || '--'}</td>
                  <td>${entry.gordura_corporal_pct || '--'}</td>
                  <td>${entry.massa_muscular_kg || '--'}</td>
                  <td>${entry.origem_medicao}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="margin-top: 40px; text-align: center; color: #666;">
            <p>Relatório gerado automaticamente pelo sistema Trend Track Wellness Hub</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <Card className="bg-netflix-card border-netflix-border">
      <CardHeader>
        <CardTitle className="text-netflix-text flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-instituto-orange" />
          Exportar Relatórios - {getUserDisplayName()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-netflix-text-muted text-sm">
            Exporte os dados de pesagem em diferentes formatos para análise externa ou arquivo.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={exportToCSV}
              disabled={isExporting || weightHistory.length === 0}
              className="bg-instituto-green hover:bg-instituto-green/90 h-16 flex flex-col items-center justify-center"
            >
              <Download className="h-5 w-5 mb-1" />
              <span className="text-sm">Exportar CSV</span>
              <span className="text-xs opacity-75">Excel/Planilha</span>
            </Button>

            <Button
              onClick={generatePrintReport}
              disabled={weightHistory.length === 0}
              variant="outline"
              className="border-netflix-border text-netflix-text hover:bg-netflix-hover h-16 flex flex-col items-center justify-center"
            >
              <Printer className="h-5 w-5 mb-1" />
              <span className="text-sm">Imprimir Relatório</span>
              <span className="text-xs opacity-75">PDF/Impressão</span>
            </Button>
          </div>

          {weightHistory.length === 0 && (
            <div className="text-center py-8 bg-netflix-hover rounded-lg">
              <FileSpreadsheet className="h-12 w-12 text-netflix-text-muted mx-auto mb-2" />
              <p className="text-netflix-text-muted">
                Nenhum dado disponível para exportação
              </p>
            </div>
          )}

          <div className="mt-6 p-4 bg-netflix-hover rounded-lg">
            <h4 className="font-medium text-netflix-text mb-2">Dados inclusos no relatório:</h4>
            <ul className="text-sm text-netflix-text-muted space-y-1">
              <li>• Histórico completo de pesagens</li>
              <li>• Composição corporal (quando disponível)</li>
              <li>• Cálculos de IMC e tendências</li>
              <li>• Origem das medições</li>
              <li>• Estatísticas resumidas</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};