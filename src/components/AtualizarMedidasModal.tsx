
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Removido - não mais necessário
import { Scale, Ruler } from 'lucide-react';
import { useDadosSaude, DadosSaude } from '@/hooks/useDadosSaude';
import { BluetoothScaleConnection } from './BluetoothScaleConnection';
import { useToast } from '@/hooks/use-toast';

interface AtualizarMedidasModalProps {
  trigger?: React.ReactNode;
}

export const AtualizarMedidasModal: React.FC<AtualizarMedidasModalProps> = ({ trigger }) => {
  const { dadosSaude, salvarDadosSaude } = useDadosSaude();
  const { toast } = useToast();
  
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    peso_atual_kg: dadosSaude?.peso_atual_kg || '',
    circunferencia_abdominal_cm: dadosSaude?.circunferencia_abdominal_cm || ''
  });

  // Atualizar formulário quando dados mudarem
  useEffect(() => {
    if (dadosSaude) {
      setFormData({
        peso_atual_kg: dadosSaude.peso_atual_kg || '',
        circunferencia_abdominal_cm: dadosSaude.circunferencia_abdominal_cm || ''
      });
    }
  }, [dadosSaude]);

  // Função para atualizar formulário com dados da balança
  const handleScaleDataReceived = (scaleData: any) => {
    if (scaleData.weight) {
      setFormData(prev => ({
        ...prev,
        peso_atual_kg: scaleData.weight.toString()
      }));
      toast({
        title: "⚖️ Peso capturado!",
        description: `Peso de ${scaleData.weight}kg foi preenchido automaticamente. Agora adicione a circunferência abdominal.`,
      });
    }
    if (scaleData.waistCircumference) {
      setFormData(prev => ({
        ...prev,
        circunferencia_abdominal_cm: scaleData.waistCircumference.toString()
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const dados = {
      peso_atual_kg: parseFloat(formData.peso_atual_kg.toString()),
      circunferencia_abdominal_cm: parseFloat(formData.circunferencia_abdominal_cm.toString()),
      // Manter valores existentes para campos obrigatórios
      altura_cm: dadosSaude?.altura_cm || 170,
      meta_peso_kg: dadosSaude?.meta_peso_kg || parseFloat(formData.peso_atual_kg.toString())
    };

    await salvarDadosSaude(dados);
    toast({
      title: "✅ Medidas atualizadas!",
      description: "Seus dados foram salvos com sucesso. Os gráficos serão atualizados automaticamente.",
    });
    setOpen(false);
    
    // Reload para atualizar gráficos
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleScaleDataSaved = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg bg-instituto-orange hover:bg-instituto-orange/90 text-white"
            size="icon"
          >
            <Scale className="h-6 w-6" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-instituto-orange">
            <Ruler className="h-5 w-5" />
            Atualizar Medidas
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Seção da Balança Inteligente */}
          <div className="p-4 bg-gradient-to-r from-instituto-purple/10 to-instituto-blue/10 rounded-lg border border-instituto-purple/20">
            <h3 className="text-lg font-semibold text-instituto-purple mb-2 flex items-center gap-2">
              <Scale className="h-5 w-5" />
              🎯 Balança Inteligente (Opcional)
            </h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Conecte sua balança Xiaomi para preencher automaticamente peso e composição corporal
            </p>
            
            <BluetoothScaleConnection 
              trigger={
                <Button 
                  variant="outline"
                  className="border-instituto-purple text-instituto-purple hover:bg-instituto-purple/10"
                  size="sm"
                >
                  <Scale className="h-4 w-4 mr-2" />
                  🔗 Conectar Balança Xiaomi
                </Button>
              }
              onDataSaved={() => {
                // Recarregar dados da saúde para atualizar o formulário
                setTimeout(() => {
                  window.location.reload();
                }, 500);
              }}
            />
            
            <div className="mt-3 text-xs text-muted-foreground">
              ✅ Peso será preenchido automaticamente nos campos abaixo
            </div>
          </div>

          {/* Divisor */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">ou preencha manualmente</span>
            </div>
          </div>

          {/* Formulário Manual */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="peso" className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-instituto-orange" />
                  Peso Atual (kg)
                </Label>
                <Input
                  id="peso"
                  type="number"
                  step="0.1"
                  value={formData.peso_atual_kg}
                  onChange={(e) => handleChange('peso_atual_kg', e.target.value)}
                  placeholder="Ex: 70.5"
                  required
                  className="border-instituto-orange/30 focus:border-instituto-orange"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="circunferencia" className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-instituto-orange" />
                  Circunferência Abdominal (cm)
                </Label>
                <Input
                  id="circunferencia"
                  type="number"
                  step="0.1"
                  value={formData.circunferencia_abdominal_cm}
                  onChange={(e) => handleChange('circunferencia_abdominal_cm', e.target.value)}
                  placeholder="Ex: 85.0"
                  required
                  className="border-instituto-orange/30 focus:border-instituto-orange"
                />
                <p className="text-xs text-muted-foreground">
                  💡 Medida importante para avaliar riscos à saúde
                </p>
              </div>
            </div>

            <div className="p-4 bg-instituto-orange/5 rounded-lg border border-instituto-orange/20">
              <h4 className="font-medium text-instituto-orange mb-2">📏 Como medir corretamente:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use uma fita métrica flexível</li>
                <li>• Meça no ponto mais estreito da cintura</li>
                <li>• Mantenha a fita paralela ao chão</li>
                <li>• Respire normalmente durante a medição</li>
              </ul>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="flex-1 bg-instituto-orange hover:bg-instituto-orange/90"
              >
                💾 Salvar Medidas
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
