import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, User, Eye, EyeOff, CheckCircle, AlertCircle, Phone, Calendar, UserCheck, Ruler, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import butterflyLogo from '@/assets/butterfly-logo.png';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [celular, setCelular] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [sexo, setSexo] = useState('');
  const [altura, setAltura] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showAdminButton, setShowAdminButton] = useState(false);

  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Verificar se deve mostrar botão admin (só para usuários já logados como admin)
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', user.id)
            .single();
          
          setShowAdminButton(profile?.role === 'admin');
        } catch (error) {
          console.error('Erro ao verificar status admin:', error);
        }
      }
    };

    checkAdminStatus();
  }, [user]);

  const validateEmail = (email: string) => {
    if (!email.trim()) {
      setEmailError('E-mail é obrigatório');
      return false;
    }
    
    const trimmedEmail = email.trim().toLowerCase();
    
    // Verificar formato básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setEmailError('Por favor, digite um e-mail válido (exemplo: nome@email.com)');
      return false;
    }
    
    // Verificar comprimento
    if (trimmedEmail.length > 254) {
      setEmailError('E-mail muito longo. Use no máximo 254 caracteres.');
      return false;
    }
    
    // Verificar caracteres especiais problemáticos
    if (trimmedEmail.includes('..') || trimmedEmail.startsWith('.') || trimmedEmail.endsWith('.')) {
      setEmailError('E-mail contém pontos consecutivos ou em posições inválidas.');
      return false;
    }
    
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password.trim()) {
      setPasswordError('Senha é obrigatória');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    if (password.length > 50) {
      setPasswordError('A senha deve ter no máximo 50 caracteres');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 25, label: 'Muito fraca', color: 'bg-red-500' };
    if (password.length < 8) return { strength: 50, label: 'Fraca', color: 'bg-orange-500' };
    if (password.length < 12 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 75, label: 'Boa', color: 'bg-yellow-500' };
    }
    if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) {
      return { strength: 100, label: 'Muito forte', color: 'bg-green-500' };
    }
    return { strength: 50, label: 'Razoável', color: 'bg-blue-500' };
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!validateEmail(email) || !validatePassword(password)) {
      setLoading(false);
      return;
    }

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: "❌ Erro no Login",
        description: error.message === 'Invalid login credentials' 
          ? "E-mail ou senha incorretos. Verifique suas credenciais." 
          : "Erro ao fazer login. Tente novamente.",
        variant: "destructive"
      });
    } else {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', currentUser.id)
            .single();

          localStorage.setItem('userType', 'cliente');
          
          if (profile?.role === 'admin') {
            toast({
              title: "✨ Bem-vindo Administrador!",
              description: "Redirecionando para o painel administrativo..."
            });
            navigate('/admin');
          } else {
            toast({
              title: "✨ Bem-vindo de volta!",
              description: "Login realizado com sucesso. Redirecionando..."
            });
            navigate('/dashboard');
          }
        }
      } catch (error) {
        console.error('Erro ao verificar role:', error);
        localStorage.setItem('userType', 'cliente');
        navigate('/dashboard');
      }
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!fullName.trim()) {
      toast({
        title: "❌ Nome obrigatório",
        description: "Por favor, digite seu nome completo.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (!celular.trim()) {
      toast({
        title: "❌ Celular obrigatório",
        description: "Por favor, digite seu celular com DDD.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    // Validar formato do celular (básico)
    const celularLimpo = celular.replace(/\D/g, '');
    if (celularLimpo.length < 10 || celularLimpo.length > 11) {
      toast({
        title: "❌ Celular inválido",
        description: "Digite um celular válido com DDD (10 ou 11 dígitos).",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (!dataNascimento.trim()) {
      toast({
        title: "❌ Data de nascimento obrigatória",
        description: "Por favor, informe sua data de nascimento.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (!sexo.trim()) {
      toast({
        title: "❌ Sexo obrigatório",
        description: "Por favor, selecione seu sexo.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (!altura.trim() || isNaN(Number(altura)) || Number(altura) < 100 || Number(altura) > 250) {
      toast({
        title: "❌ Altura inválida",
        description: "Por favor, informe uma altura válida entre 100 e 250 cm.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (!validateEmail(email) || !validatePassword(password)) {
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password, fullName, celular, dataNascimento, sexo, Number(altura));

    if (error) {
      let errorMessage = "Erro ao criar conta. Tente novamente.";
      
      // Tratar erros específicos do sistema
      if (error.message === 'Nome completo é obrigatório') {
        errorMessage = "❌ Nome completo é obrigatório";
      } else if (error.message === 'Celular é obrigatório') {
        errorMessage = "❌ Celular é obrigatório";
      } else if (error.message === 'Data de nascimento é obrigatória') {
        errorMessage = "❌ Data de nascimento é obrigatória";
      } else if (error.message === 'Sexo é obrigatório') {
        errorMessage = "❌ Sexo é obrigatório";
      } else if (error.message === 'Altura deve estar entre 100 e 250 cm') {
        errorMessage = "❌ Altura deve estar entre 100 e 250 cm";
      } else if (error.message === 'E-mail já registrado. Tente outro.') {
        errorMessage = "📧 E-mail já registrado. Tente outro.";
      } else if (error.message.includes('already registered') || error.message.includes('User already registered')) {
        errorMessage = "📧 Este e-mail já está cadastrado! Tente fazer login ou use outro e-mail.";
      } else if (error.message.includes('Password should be')) {
        errorMessage = "🔒 A senha deve ter pelo menos 6 caracteres.";
      } else if (error.message.includes('Invalid email')) {
        errorMessage = "📧 E-mail inválido. Verifique se digitou corretamente.";
      } else if (error.message.includes('Signup requires a valid password')) {
        errorMessage = "🔒 Senha inválida. Use pelo menos 6 caracteres.";
      } else if (error.message.includes('Unable to validate email address')) {
        errorMessage = "📧 Não foi possível validar o e-mail. Verifique se está correto.";
      } else if (error.message.includes('email rate limit exceeded')) {
        errorMessage = "⏳ Muitas tentativas de cadastro. Aguarde alguns minutos e tente novamente.";
      } else if (error.message.includes('password')) {
        errorMessage = "🔒 Erro relacionado à senha. Verifique se atende aos requisitos.";
      } else if (error.message.includes('email')) {
        errorMessage = "📧 Erro relacionado ao e-mail. Verifique se está correto.";
      } else if (error.message.includes('network')) {
        errorMessage = "🌐 Erro de conexão. Verifique sua internet e tente novamente.";
      }

      console.error('❌ Erro detalhado no cadastro:', error);

      toast({
        title: "❌ Erro no Cadastro",
        description: errorMessage,
        variant: "destructive"
      });
    } else {
      localStorage.setItem('userType', 'cliente');
      toast({
        title: "🎉 Conta criada com sucesso!",
        description: "Seus dados foram salvos. Redirecionando para o dashboard..."
      });
      
      // Pequeno delay para mostrar a mensagem de sucesso antes de redirecionar
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-instituto-light via-white to-instituto-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo e Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img src={butterflyLogo} alt="Instituto dos Sonhos" className="w-16 h-16" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-instituto-dark">Instituto dos Sonhos</h1>
            <p className="text-instituto-dark/70 mt-2">Transforme sua vida com nossa metodologia</p>
          </div>
        </div>

        {/* Botão Admin - sempre visível */}
        <div className="text-center">
          <Button 
            onClick={() => navigate('/admin')} 
            variant="outline" 
            className="border-instituto-orange text-instituto-orange hover:bg-instituto-orange hover:text-white"
          >
            <Crown className="mr-2 h-4 w-4" />
            Painel Administrativo
          </Button>
        </div>

        <Card className="shadow-warm">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Cadastrar</TabsTrigger>
            </TabsList>

            {/* Tab Login */}
            <TabsContent value="login">
              <CardHeader>
                <CardTitle className="text-center text-instituto-dark">
                  Bem-vindo de volta! 
                </CardTitle>
                <CardDescription className="text-center">
                  Entre com suas credenciais para continuar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="Seu e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`pl-10 ${emailError ? 'border-red-500' : ''}`}
                        disabled={loading}
                      />
                    </div>
                    {emailError && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {emailError}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`pl-10 pr-10 ${passwordError ? 'border-red-500' : ''}`}
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {passwordError && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {passwordError}
                      </p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-instituto-orange hover:bg-instituto-orange-hover" 
                    disabled={loading}
                  >
                    {loading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            {/* Tab Cadastro */}
            <TabsContent value="signup">
              <CardHeader>
                <CardTitle className="text-center text-instituto-dark">
                  Crie sua conta
                </CardTitle>
                <CardDescription className="text-center">
                  Preencha os dados para começar sua jornada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  {/* Nome Completo */}
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Nome completo"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>

                  {/* Celular */}
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="Celular com DDD (11) 99999-9999"
                      value={celular}
                      onChange={(e) => setCelular(e.target.value)}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>

                  {/* Data de Nascimento */}
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="date"
                      placeholder="Data de nascimento"
                      value={dataNascimento}
                      onChange={(e) => setDataNascimento(e.target.value)}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>

                  {/* Sexo */}
                  <Select value={sexo} onValueChange={setSexo} disabled={loading}>
                    <SelectTrigger className="w-full">
                      <UserCheck className="h-5 w-5 text-muted-foreground mr-2" />
                      <SelectValue placeholder="Selecione seu sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Altura */}
                  <div className="relative">
                    <Ruler className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="Altura em cm (ex: 170)"
                      value={altura}
                      onChange={(e) => setAltura(e.target.value)}
                      className="pl-10"
                      min="100"
                      max="250"
                      disabled={loading}
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Seu e-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`pl-10 ${emailError ? 'border-red-500' : ''}`}
                      disabled={loading}
                    />
                  </div>
                  {emailError && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {emailError}
                    </p>
                  )}

                  {/* Senha */}
                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Crie uma senha (min. 6 caracteres)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`pl-10 pr-10 ${passwordError ? 'border-red-500' : ''}`}
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {passwordError && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {passwordError}
                      </p>
                    )}
                    
                    {/* Indicador de força da senha */}
                    {password && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Força da senha:</span>
                          <span className={`font-medium ${
                            getPasswordStrength(password).strength >= 75 ? 'text-green-600' : 
                            getPasswordStrength(password).strength >= 50 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {getPasswordStrength(password).label}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrength(password).color}`}
                            style={{ width: `${getPasswordStrength(password).strength}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-instituto-orange hover:bg-instituto-orange-hover" 
                    disabled={loading}
                  >
                    {loading ? "Criando conta..." : "Criar conta"}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;