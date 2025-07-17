import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  Mail, Lock, User, Eye, EyeOff, CheckCircle, AlertCircle, Phone, Calendar, 
  UserCheck, Ruler, Crown, Shield, Sparkles, Star, ArrowRight, Check, X
} from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('login');
  const [formTouched, setFormTouched] = useState(false);

  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      if (user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', user.id)
            .single();
          
          if (profile?.role === 'admin') {
            console.log('Admin detectado, permitindo acesso à página Auth');
            return;
          } else {
            navigate('/dashboard');
          }
        } catch (error) {
          console.error('Erro ao verificar role:', error);
          navigate('/dashboard');
        }
      }
    };

    checkUserAndRedirect();
  }, [user, navigate]);

  const validateEmail = (email: string) => {
    if (!email.trim()) {
      setEmailError('E-mail é obrigatório');
      return false;
    }
    
    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(trimmedEmail)) {
      setEmailError('Digite um e-mail válido (exemplo: nome@email.com)');
      return false;
    }
    
    if (trimmedEmail.length > 254) {
      setEmailError('E-mail muito longo. Use no máximo 254 caracteres.');
      return false;
    }
    
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
    setFormTouched(true);

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
    setFormTouched(true);

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
        description: "Bem-vindo ao Instituto dos Sonhos! Redirecionando..."
      });
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-slate-900/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),rgba(255,255,255,0.0))]"></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md space-y-6 relative z-10"
      >
        {/* Logo e Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center space-y-6"
        >
          <div className="flex justify-center">
            <div className="relative">
              <img 
                src={butterflyLogo} 
                alt="Instituto dos Sonhos" 
                className="w-20 h-20 drop-shadow-2xl"
              />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Instituto dos Sonhos
            </h1>
            <p className="text-purple-200 text-lg font-medium">
              Sua transformação completa começa aqui
            </p>
            <div className="flex justify-center items-center gap-1 text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm text-purple-200 ml-2">Mais de 10.000 vidas transformadas</span>
            </div>
          </div>
        </motion.div>

        {/* Botão Admin */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center flex gap-4 justify-center"
        >
          <Button 
            onClick={() => navigate('/admin?tab=usuarios')} 
            variant="outline" 
            className="border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-slate-900 shadow-lg hover:shadow-amber-400/25 transition-all duration-300 font-semibold"
          >
            <Shield className="mr-2 h-4 w-4" />
            Acesso Administrativo
          </Button>
          
          <Button 
            onClick={() => navigate('/create-admin')} 
            variant="outline" 
            className="border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-slate-900 shadow-lg hover:shadow-green-400/25 transition-all duration-300 font-semibold"
          >
            <User className="mr-2 h-4 w-4" />
            Criar Admin
          </Button>
        </motion.div>

        {/* Card Principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl shadow-purple-500/20">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-100">
                <TabsTrigger 
                  value="login" 
                  className="data-[state=active]:bg-white data-[state=active]:text-purple-600 font-semibold"
                >
                  Entrar
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="data-[state=active]:bg-white data-[state=active]:text-purple-600 font-semibold"
                >
                  Criar Conta
                </TabsTrigger>
              </TabsList>

              {/* Tab Login */}
              <TabsContent value="login">
                <CardHeader className="space-y-4">
                  <CardTitle className="text-center text-slate-800 text-2xl font-bold">
                    Que bom te ver novamente! 
                  </CardTitle>
                  <CardDescription className="text-center text-slate-600">
                    Continue sua jornada de transformação
                  </CardDescription>
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Acesso seguro e protegido
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignIn} className="space-y-6">
                    <div className="space-y-2">
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <Input
                          type="email"
                          placeholder="Digite seu e-mail"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (formTouched) validateEmail(e.target.value);
                          }}
                          className={`pl-10 h-12 text-lg ${emailError ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-purple-500'} transition-all duration-200`}
                          disabled={loading}
                        />
                        {email && !emailError && (
                          <Check className="absolute right-3 top-3 h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <AnimatePresence>
                        {emailError && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-sm text-red-500 flex items-center gap-1"
                          >
                            <AlertCircle className="h-4 w-4" />
                            {emailError}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Digite sua senha"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (formTouched) validatePassword(e.target.value);
                          }}
                          className={`pl-10 pr-12 h-12 text-lg ${passwordError ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-purple-500'} transition-all duration-200`}
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
                            <EyeOff className="h-4 w-4 text-slate-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-400" />
                          )}
                        </Button>
                      </div>
                      <AnimatePresence>
                        {passwordError && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-sm text-red-500 flex items-center gap-1"
                          >
                            <AlertCircle className="h-4 w-4" />
                            {passwordError}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold text-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300" 
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Entrando...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            Entrar na minha conta
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </TabsContent>

              {/* Tab Cadastro */}
              <TabsContent value="signup">
                <CardHeader className="space-y-4">
                  <CardTitle className="text-center text-slate-800 text-2xl font-bold">
                    Comece sua transformação
                  </CardTitle>
                  <CardDescription className="text-center text-slate-600">
                    Preencha seus dados para criar sua conta gratuita
                  </CardDescription>
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                      <Crown className="w-4 h-4" />
                      Acesso completo por 7 dias grátis
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignUp} className="space-y-4">
                    {/* Nome Completo */}
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <Input
                        type="text"
                        placeholder="Nome completo"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10 h-12 border-slate-200 focus:border-purple-500 transition-all duration-200"
                        disabled={loading}
                      />
                      {fullName && (
                        <Check className="absolute right-3 top-3 h-5 w-5 text-green-500" />
                      )}
                    </div>

                    {/* Celular */}
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <Input
                        type="tel"
                        placeholder="(11) 99999-9999"
                        value={celular}
                        onChange={(e) => setCelular(e.target.value)}
                        className="pl-10 h-12 border-slate-200 focus:border-purple-500 transition-all duration-200"
                        disabled={loading}
                      />
                      {celular && celular.replace(/\D/g, '').length >= 10 && (
                        <Check className="absolute right-3 top-3 h-5 w-5 text-green-500" />
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Data de Nascimento */}
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <Input
                          type="date"
                          value={dataNascimento}
                          onChange={(e) => setDataNascimento(e.target.value)}
                          className="pl-10 h-12 border-slate-200 focus:border-purple-500 transition-all duration-200"
                          disabled={loading}
                        />
                      </div>

                      {/* Altura */}
                      <div className="relative">
                        <Ruler className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <Input
                          type="number"
                          placeholder="Altura (cm)"
                          value={altura}
                          onChange={(e) => setAltura(e.target.value)}
                          className="pl-10 h-12 border-slate-200 focus:border-purple-500 transition-all duration-200"
                          min="100"
                          max="250"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {/* Sexo */}
                    <Select value={sexo} onValueChange={setSexo} disabled={loading}>
                      <SelectTrigger className="h-12 border-slate-200 focus:border-purple-500 transition-all duration-200">
                        <UserCheck className="h-5 w-5 text-slate-400 mr-2" />
                        <SelectValue placeholder="Selecione seu sexo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="feminino">Feminino</SelectItem>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Email */}
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <Input
                        type="email"
                        placeholder="Seu melhor e-mail"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (formTouched) validateEmail(e.target.value);
                        }}
                        className={`pl-10 h-12 ${emailError ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-purple-500'} transition-all duration-200`}
                        disabled={loading}
                      />
                      {email && !emailError && (
                        <Check className="absolute right-3 top-3 h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <AnimatePresence>
                      {emailError && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-sm text-red-500 flex items-center gap-1"
                        >
                          <AlertCircle className="h-4 w-4" />
                          {emailError}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* Senha */}
                    <div className="space-y-2">
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Crie uma senha forte"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (formTouched) validatePassword(e.target.value);
                          }}
                          className={`pl-10 pr-12 h-12 ${passwordError ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-purple-500'} transition-all duration-200`}
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
                            <EyeOff className="h-4 w-4 text-slate-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-400" />
                          )}
                        </Button>
                      </div>
                      <AnimatePresence>
                        {passwordError && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-sm text-red-500 flex items-center gap-1"
                          >
                            <AlertCircle className="h-4 w-4" />
                            {passwordError}
                          </motion.p>
                        )}
                      </AnimatePresence>
                      
                      {/* Indicador de força da senha */}
                      <AnimatePresence>
                        {password && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-2"
                          >
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-500">Força da senha:</span>
                              <span className={`font-medium ${
                                getPasswordStrength(password).strength >= 75 ? 'text-green-600' : 
                                getPasswordStrength(password).strength >= 50 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {getPasswordStrength(password).label}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${getPasswordStrength(password).strength}%` }}
                                transition={{ duration: 0.3 }}
                                className={`h-2 rounded-full ${getPasswordStrength(password).color}`}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold text-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300" 
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Criando sua conta...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            Criar minha conta grátis
                            <Sparkles className="w-4 h-4" />
                          </div>
                        )}
                      </Button>
                    </motion.div>

                    <div className="text-center text-xs text-slate-500">
                      Ao criar sua conta, você concorda com nossos{' '}
                      <span className="text-purple-600 hover:underline cursor-pointer">
                        termos de uso
                      </span>
                    </div>
                  </form>
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-center justify-center gap-1 mb-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
            </div>
            <p className="text-sm text-purple-200 italic">
              "Transformei minha vida em 30 dias! O método funciona mesmo."
            </p>
            <p className="text-xs text-purple-300 mt-1">
              - Maria Silva, Cliente desde 2024
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Auth;