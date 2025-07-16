import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  UserPlus, 
  Activity, 
  Heart, 
  Scale, 
  Droplets,
  Moon,
  AlertTriangle,
  Smile,
  User
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ClientData {
  nomeCompleto: string;
  dataNascimento: string;
  sexo: string;
  altura: string;
  peso: string;
  circunferenciaAbdominal: string;
  email: string;
  telefone: string;
  // Campos opcionais
  tentativaEmagrecimento?: string;
  motivoDesistencia?: string;
  apoioFamiliar?: string;
  nivelAutocuidado?: string;
  horasSono?: string;
  litrosAgua?: string;
  nivelEstresse?: string;
  gratidao?: string;
}

export const ClientRegistrationForm: React.FC = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<ClientData>({
    nomeCompleto: '',
    dataNascimento: '',
    sexo: '',
    altura: '',
    peso: '',
    circunferenciaAbdominal: '',
    email: '',
    telefone: ''
  });

  const [calculatedIMC, setCalculatedIMC] = useState<number | null>(null);
  const [riscoCardiometabolico, setRiscoCardiometabolico] = useState<string>('');

  const calculateIMC = () => {
    const peso = parseFloat(formData.peso);
    const altura = parseFloat(formData.altura) / 100; // converter cm para metros
    
    if (peso && altura) {
      const imc = peso / (altura * altura);
      setCalculatedIMC(parseFloat(imc.toFixed(1)));
      
      // Determinar risco cardiometabólico baseado no IMC e circunferência abdominal
      const circunferencia = parseFloat(formData.circunferenciaAbdominal);
      let risco = 'Baixo';
      
      if (imc >= 30 || (formData.sexo === 'masculino' && circunferencia > 102) || (formData.sexo === 'feminino' && circunferencia > 88)) {
        risco = 'Alto';
      } else if (imc >= 25 || (formData.sexo === 'masculino' && circunferencia > 94) || (formData.sexo === 'feminino' && circunferencia > 80)) {
        risco = 'Moderado';
      }
      
      setRiscoCardiometabolico(risco);
    }
  };

  React.useEffect(() => {
    if (formData.peso && formData.altura && formData.circunferenciaAbdominal && formData.sexo) {
      calculateIMC();
    }
  }, [formData.peso, formData.altura, formData.circunferenciaAbdominal, formData.sexo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 1. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: 'tempPassword123!', // Senha temporária
        options: {
          data: {
            full_name: formData.nomeCompleto
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Aguardar um pouco para o trigger criar o perfil
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 3. Buscar o perfil criado
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', authData.user.id)
          .single();

        if (profileError) throw profileError;

        // 4. Inserir dados físicos
        const { error: dadosFisicosError } = await supabase
          .from('dados_fisicos_usuario')
          .insert({
            user_id: profile.id,
            nome_completo: formData.nomeCompleto,
            data_nascimento: formData.dataNascimento,
            sexo: formData.sexo,
            altura_cm: parseInt(formData.altura),
            peso_atual_kg: parseFloat(formData.peso),
            circunferencia_abdominal_cm: parseFloat(formData.circunferenciaAbdominal),
            meta_peso_kg: parseFloat(formData.peso) // Default meta é o peso atual
          });

        if (dadosFisicosError) throw dadosFisicosError;

        // 5. Inserir perfil comportamental se dados foram preenchidos
        if (formData.tentativaEmagrecimento || formData.apoioFamiliar || formData.nivelAutocuidado) {
          const { error: perfilError } = await supabase
            .from('perfil_comportamental')
            .insert({
              user_id: profile.id,
              tentativa_emagrecimento: formData.tentativaEmagrecimento,
              apoio_familiar: formData.apoioFamiliar,
              nivel_autocuidado: formData.nivelAutocuidado ? parseInt(formData.nivelAutocuidado) : null,
              nivel_estresse: formData.nivelEstresse ? parseInt(formData.nivelEstresse) : null,
              gratidao_hoje: formData.gratidao
            });

          if (perfilError) throw perfilError;
        }
      }

      toast({
        title: "Cliente cadastrado com sucesso!",
        description: `${formData.nomeCompleto} foi adicionado ao sistema.`,
      });

      // Reset form
      setFormData({
        nomeCompleto: '',
        dataNascimento: '',
        sexo: '',
        altura: '',
        peso: '',
        circunferenciaAbdominal: '',
        email: '',
        telefone: ''
      });
      setCalculatedIMC(null);
      setRiscoCardiometabolico('');
      setIsOpen(false);

    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      toast({
        title: "Erro ao cadastrar cliente",
        description: "Não foi possível cadastrar o cliente. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const getRiscoColor = (risco: string) => {
    switch (risco) {
      case 'Alto': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Moderado': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Baixo': return 'bg-green-500/10 text-green-400 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="w-full instituto-button">
            <UserPlus className="h-4 w-4 mr-2" />
            Cadastrar Novo Cliente
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-instituto-orange" />
              Cadastro Completo de Cliente
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dados Obrigatórios */}
            <Card className="bg-netflix-hover border-netflix-border">
              <CardHeader>
                <CardTitle className="text-lg text-netflix-text">Dados Obrigatórios</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    value={formData.nomeCompleto}
                    onChange={(e) => setFormData({...formData, nomeCompleto: e.target.value})}
                    className="bg-netflix-gray border-netflix-border text-netflix-text"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="nascimento">Data de Nascimento *</Label>
                  <Input
                    id="nascimento"
                    type="date"
                    value={formData.dataNascimento}
                    onChange={(e) => setFormData({...formData, dataNascimento: e.target.value})}
                    className="bg-netflix-gray border-netflix-border text-netflix-text"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="sexo">Sexo *</Label>
                  <Select value={formData.sexo} onValueChange={(value) => setFormData({...formData, sexo: value})}>
                    <SelectTrigger className="bg-netflix-gray border-netflix-border text-netflix-text">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="altura">Altura (cm) *</Label>
                  <Input
                    id="altura"
                    type="number"
                    value={formData.altura}
                    onChange={(e) => setFormData({...formData, altura: e.target.value})}
                    className="bg-netflix-gray border-netflix-border text-netflix-text"
                    placeholder="Ex: 170"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="peso">Peso (kg) *</Label>
                  <Input
                    id="peso"
                    type="number"
                    step="0.1"
                    value={formData.peso}
                    onChange={(e) => setFormData({...formData, peso: e.target.value})}
                    className="bg-netflix-gray border-netflix-border text-netflix-text"
                    placeholder="Ex: 70.5"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="circunferencia">Circunferência Abdominal (cm) *</Label>
                  <Input
                    id="circunferencia"
                    type="number"
                    value={formData.circunferenciaAbdominal}
                    onChange={(e) => setFormData({...formData, circunferenciaAbdominal: e.target.value})}
                    className="bg-netflix-gray border-netflix-border text-netflix-text"
                    placeholder="Ex: 80"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-netflix-gray border-netflix-border text-netflix-text"
                    placeholder="cliente@email.com"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    className="bg-netflix-gray border-netflix-border text-netflix-text"
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Resultados Calculados */}
            {calculatedIMC && (
              <Card className="bg-netflix-hover border-netflix-border">
                <CardHeader>
                  <CardTitle className="text-lg text-netflix-text flex items-center gap-2">
                    <Activity className="h-5 w-5 text-instituto-green" />
                    Resultados Calculados
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-instituto-orange/10 rounded-lg">
                    <Scale className="h-6 w-6 text-instituto-orange" />
                    <div>
                      <p className="text-sm text-netflix-text-muted">IMC</p>
                      <p className="text-xl font-bold text-netflix-text">{calculatedIMC}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <AlertTriangle className="h-6 w-6" />
                    <div>
                      <p className="text-sm text-netflix-text-muted">Risco Cardiometabólico</p>
                      <Badge className={getRiscoColor(riscoCardiometabolico)}>
                        {riscoCardiometabolico}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Perfil Comportamental (Opcional) */}
            <Card className="bg-netflix-hover border-netflix-border">
              <CardHeader>
                <CardTitle className="text-lg text-netflix-text">Perfil Comportamental (Opcional)</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tentativa">Já tentou emagrecer?</Label>
                  <Select value={formData.tentativaEmagrecimento || ''} onValueChange={(value) => setFormData({...formData, tentativaEmagrecimento: value})}>
                    <SelectTrigger className="bg-netflix-gray border-netflix-border text-netflix-text">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sim">Sim</SelectItem>
                      <SelectItem value="nao">Não</SelectItem>
                      <SelectItem value="varias-vezes">Várias vezes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="apoio">Apoio familiar?</Label>
                  <Select value={formData.apoioFamiliar || ''} onValueChange={(value) => setFormData({...formData, apoioFamiliar: value})}>
                    <SelectTrigger className="bg-netflix-gray border-netflix-border text-netflix-text">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="total">Total</SelectItem>
                      <SelectItem value="parcial">Parcial</SelectItem>
                      <SelectItem value="nenhum">Nenhum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="autocuidado">Nível de Autocuidado (0-5)</Label>
                  <Input
                    id="autocuidado"
                    type="number"
                    min="0"
                    max="5"
                    value={formData.nivelAutocuidado || ''}
                    onChange={(e) => setFormData({...formData, nivelAutocuidado: e.target.value})}
                    className="bg-netflix-gray border-netflix-border text-netflix-text"
                  />
                </div>
                
                <div>
                  <Label htmlFor="sono">Horas de sono por noite</Label>
                  <Input
                    id="sono"
                    type="number"
                    min="0"
                    max="12"
                    step="0.5"
                    value={formData.horasSono || ''}
                    onChange={(e) => setFormData({...formData, horasSono: e.target.value})}
                    className="bg-netflix-gray border-netflix-border text-netflix-text"
                    placeholder="Ex: 7.5"
                  />
                </div>
                
                <div>
                  <Label htmlFor="agua">Litros de água por dia</Label>
                  <Input
                    id="agua"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.litrosAgua || ''}
                    onChange={(e) => setFormData({...formData, litrosAgua: e.target.value})}
                    className="bg-netflix-gray border-netflix-border text-netflix-text"
                    placeholder="Ex: 2.5"
                  />
                </div>
                
                <div>
                  <Label htmlFor="estresse">Nível de Estresse (0-10)</Label>
                  <Input
                    id="estresse"
                    type="number"
                    min="0"
                    max="10"
                    value={formData.nivelEstresse || ''}
                    onChange={(e) => setFormData({...formData, nivelEstresse: e.target.value})}
                    className="bg-netflix-gray border-netflix-border text-netflix-text"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="gratidao">Pelo que você é grato hoje?</Label>
                  <Textarea
                    id="gratidao"
                    value={formData.gratidao || ''}
                    onChange={(e) => setFormData({...formData, gratidao: e.target.value})}
                    className="bg-netflix-gray border-netflix-border text-netflix-text"
                    placeholder="Descreva algo pelo qual se sente grato..."
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button type="submit" className="instituto-button flex-1">
                <UserPlus className="h-4 w-4 mr-2" />
                Cadastrar Cliente
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                className="border-netflix-border text-netflix-text hover:bg-netflix-gray"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Lista rápida de clientes recentes */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-netflix-text">Últimos Cadastros</h4>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {/* Placeholder para lista de clientes */}
          <div className="p-2 bg-netflix-hover rounded text-center text-sm text-netflix-text-muted">
            Nenhum cliente cadastrado ainda
          </div>
        </div>
      </div>
    </div>
  );
};