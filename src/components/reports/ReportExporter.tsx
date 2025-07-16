import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, FileText, Table, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportData {
  missions: any[];
  progress: any[];
  health: any[];
  goals: any[];
}

interface ExportOptions {
  format: 'pdf' | 'csv' | 'json';
  dateRange: { from: Date; to: Date } | null;
  includeCharts: boolean;
  includeMissions: boolean;
  includeProgress: boolean;
  includeHealth: boolean;
  includeGoals: boolean;
}

export const ReportExporter: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    dateRange: null,
    includeCharts: true,
    includeMissions: true,
    includeProgress: true,
    includeHealth: true,
    includeGoals: true
  });
  const { toast } = useToast();

  const generateMockData = (): ReportData => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      missions: [
        { date: '2024-01-15', name: 'Exercício matinal', completed: true, points: 10 },
        { date: '2024-01-16', name: 'Meditação', completed: true, points: 15 },
        { date: '2024-01-17', name: 'Diário da gratidão', completed: false, points: 0 }
      ],
      progress: [
        { date: '2024-01-15', weight: 75.2, waist: 85, mood: 8 },
        { date: '2024-01-16', weight: 75.0, waist: 84.5, mood: 9 },
        { date: '2024-01-17', weight: 74.8, waist: 84, mood: 7 }
      ],
      health: [
        { metric: 'IMC', value: 24.1, status: 'Normal', date: '2024-01-17' },
        { metric: 'Circunferência', value: 84, status: 'Adequado', date: '2024-01-17' }
      ],
      goals: [
        { name: 'Perder 5kg', progress: 60, deadline: '2024-03-01', status: 'Em progresso' },
        { name: 'Correr 5km', progress: 80, deadline: '2024-02-15', status: 'Em progresso' }
      ]
    };
  };

  const exportToPDF = async (data: ReportData) => {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(20);
    doc.text('Relatório de Progresso', 20, 30);
    
    // Data do relatório
    doc.setFontSize(12);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 45);
    
    let yPosition = 60;

    // Missões
    if (exportOptions.includeMissions && data.missions.length > 0) {
      doc.setFontSize(16);
      doc.text('Missões Diárias', 20, yPosition);
      yPosition += 10;

      const missionTableData = data.missions.map(mission => [
        mission.date,
        mission.name,
        mission.completed ? 'Concluída' : 'Pendente',
        mission.points.toString()
      ]);

      autoTable(doc, {
        head: [['Data', 'Missão', 'Status', 'Pontos']],
        body: missionTableData,
        startY: yPosition,
        theme: 'striped'
      });

      yPosition = (doc as any).lastAutoTable.finalY + 20;
    }

    // Progresso
    if (exportOptions.includeProgress && data.progress.length > 0) {
      doc.setFontSize(16);
      doc.text('Progresso Físico', 20, yPosition);
      yPosition += 10;

      const progressTableData = data.progress.map(progress => [
        progress.date,
        `${progress.weight} kg`,
        `${progress.waist} cm`,
        progress.mood.toString()
      ]);

      autoTable(doc, {
        head: [['Data', 'Peso', 'Cintura', 'Humor (1-10)']],
        body: progressTableData,
        startY: yPosition,
        theme: 'striped'
      });

      yPosition = (doc as any).lastAutoTable.finalY + 20;
    }

    // Metas
    if (exportOptions.includeGoals && data.goals.length > 0) {
      doc.setFontSize(16);
      doc.text('Metas', 20, yPosition);
      yPosition += 10;

      const goalsTableData = data.goals.map(goal => [
        goal.name,
        `${goal.progress}%`,
        goal.deadline,
        goal.status
      ]);

      autoTable(doc, {
        head: [['Meta', 'Progresso', 'Prazo', 'Status']],
        body: goalsTableData,
        startY: yPosition,
        theme: 'striped'
      });
    }

    return doc;
  };

  const exportToCSV = (data: ReportData) => {
    let csvContent = '';

    if (exportOptions.includeMissions) {
      csvContent += 'MISSÕES DIÁRIAS\n';
      csvContent += 'Data,Missão,Status,Pontos\n';
      data.missions.forEach(mission => {
        csvContent += `${mission.date},"${mission.name}",${mission.completed ? 'Concluída' : 'Pendente'},${mission.points}\n`;
      });
      csvContent += '\n';
    }

    if (exportOptions.includeProgress) {
      csvContent += 'PROGRESSO FÍSICO\n';
      csvContent += 'Data,Peso,Cintura,Humor\n';
      data.progress.forEach(progress => {
        csvContent += `${progress.date},${progress.weight},${progress.waist},${progress.mood}\n`;
      });
      csvContent += '\n';
    }

    if (exportOptions.includeGoals) {
      csvContent += 'METAS\n';
      csvContent += 'Meta,Progresso,Prazo,Status\n';
      data.goals.forEach(goal => {
        csvContent += `"${goal.name}",${goal.progress}%,${goal.deadline},"${goal.status}"\n`;
      });
    }

    return csvContent;
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const data = generateMockData();
      
      if (exportOptions.format === 'pdf') {
        const doc = await exportToPDF(data);
        doc.save(`relatorio_${new Date().toISOString().split('T')[0]}.pdf`);
      } else if (exportOptions.format === 'csv') {
        const csvContent = exportToCSV(data);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `relatorio_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
      } else if (exportOptions.format === 'json') {
        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `relatorio_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
      }

      toast({
        title: "Relatório exportado ✅",
        description: `Arquivo ${exportOptions.format.toUpperCase()} baixado com sucesso`
      });

    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o relatório",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="bg-netflix-card border-netflix-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-netflix-text">
          <BarChart3 className="h-5 w-5" />
          Exportar Relatórios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formato */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-netflix-text">Formato</label>
          <Select 
            value={exportOptions.format} 
            onValueChange={(value: 'pdf' | 'csv' | 'json') => 
              setExportOptions(prev => ({ ...prev, format: value }))
            }
          >
            <SelectTrigger className="bg-netflix-hover border-netflix-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-netflix-card border-netflix-border">
              <SelectItem value="pdf" className="text-netflix-text">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  PDF - Relatório visual
                </div>
              </SelectItem>
              <SelectItem value="csv" className="text-netflix-text">
                <div className="flex items-center gap-2">
                  <Table className="h-4 w-4" />
                  CSV - Planilha
                </div>
              </SelectItem>
              <SelectItem value="json" className="text-netflix-text">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  JSON - Dados estruturados
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Período */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-netflix-text">Período</label>
          <DatePickerWithRange 
            className="bg-netflix-hover border-netflix-border"
            value={exportOptions.dateRange}
            onChange={(range) => setExportOptions(prev => ({ 
              ...prev, 
              dateRange: range && range.from && range.to ? { from: range.from, to: range.to } : null 
            }))}
          />
        </div>

        {/* Opções de conteúdo */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-netflix-text">Incluir no relatório</label>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="missions"
                checked={exportOptions.includeMissions}
                onCheckedChange={(checked) => 
                  setExportOptions(prev => ({ ...prev, includeMissions: !!checked }))
                }
              />
              <label htmlFor="missions" className="text-sm text-netflix-text">
                Missões diárias
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="progress"
                checked={exportOptions.includeProgress}
                onCheckedChange={(checked) => 
                  setExportOptions(prev => ({ ...prev, includeProgress: !!checked }))
                }
              />
              <label htmlFor="progress" className="text-sm text-netflix-text">
                Progresso físico
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="health"
                checked={exportOptions.includeHealth}
                onCheckedChange={(checked) => 
                  setExportOptions(prev => ({ ...prev, includeHealth: !!checked }))
                }
              />
              <label htmlFor="health" className="text-sm text-netflix-text">
                Dados de saúde
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="goals"
                checked={exportOptions.includeGoals}
                onCheckedChange={(checked) => 
                  setExportOptions(prev => ({ ...prev, includeGoals: !!checked }))
                }
              />
              <label htmlFor="goals" className="text-sm text-netflix-text">
                Metas e objetivos
              </label>
            </div>

            {exportOptions.format === 'pdf' && (
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="charts"
                  checked={exportOptions.includeCharts}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeCharts: !!checked }))
                  }
                />
                <label htmlFor="charts" className="text-sm text-netflix-text">
                  Gráficos e visualizações
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Botão de exportação */}
        <Button 
          onClick={handleExport}
          disabled={isExporting}
          className="w-full bg-instituto-orange hover:bg-instituto-orange-hover"
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? 'Gerando relatório...' : 'Exportar Relatório'}
        </Button>
      </CardContent>
    </Card>
  );
};