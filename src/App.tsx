import React, { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';
import { ErrorDisplay, useErrorHandler } from '@/hooks/useErrorHandler';
import { initAnalytics, trackPageView } from '@/lib/analytics';
import { MainLayout } from '@/components/layout/MainLayout';
import '@/styles/health-dashboard.css';

// Lazy loading das páginas principais
const Index = lazy(() => import('@/pages/Index'));
const Auth = lazy(() => import('@/pages/Auth'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const FullSession = lazy(() => import('@/pages/FullSession'));
const SampleSession = lazy(() => import('@/pages/SampleSession'));
const PublicRanking = lazy(() => import('@/pages/PublicRanking'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const HealthMetrics = lazy(() => import('@/pages/HealthMetrics'));

// Lazy loading do painel administrativo
const AdminTestRoute = lazy(() => import('@/components/admin/AdminTestRoute').then(module => ({ default: module.AdminTestRoute })));
const AdminUserCreator = lazy(() => import('@/components/admin/AdminUserCreator').then(module => ({ default: module.AdminUserCreator })));

// Configuração otimizada do cliente de query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      staleTime: 10 * 60 * 1000, // 10 minutos (aumentado para melhor cache)
      gcTime: 30 * 60 * 1000, // 30 minutos (aumentado para melhor performance)
      refetchOnMount: false, // Evita refetch desnecessário
      refetchOnReconnect: 'always', // Revalida ao reconectar
    },
    mutations: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});

// Componente de loading otimizado
const LoadingSpinner = React.memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-brand-50 to-background">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-brand-300/30 rounded-full animate-pulse"></div>
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
            Instituto dos Sonhos
          </h3>
          <p className="text-brand-600 text-sm">Carregando sua experiência...</p>
        </div>
      </div>
    </motion.div>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

// Componente de fallback para páginas específicas
const PageFallback = React.memo(({ page }: { page: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-brand-50 to-background">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-center"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-3 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-brand-600 text-sm">Carregando {page}...</p>
      </div>
    </motion.div>
  </div>
));

PageFallback.displayName = 'PageFallback';

// Componente de erro boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-md mx-auto p-8"
          >
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
              <h2 className="text-xl font-bold text-red-400 mb-4">
                Ops! Algo deu errado
              </h2>
              <p className="text-red-200 mb-6">
                Ocorreu um erro inesperado. Por favor, recarregue a página.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Recarregar página
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Componente principal da aplicação - Otimizado para performance
const AppContent = React.memo(() => {
  const { errors, clearError, clearErrors } = useErrorHandler();
  const [isInitialized, setIsInitialized] = useState(false);

  const location = useLocation();

  // Inicializar ferramentas de Analytics (executa apenas uma vez)
  useEffect(() => {
    let isMounted = true;
    
    const initAnalyticsAsync = async () => {
      if (isMounted) {
        initAnalytics();
      }
    };
    
    initAnalyticsAsync();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Registrar pageviews a cada mudança de rota
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      trackPageView(location.pathname + location.search);
    }, 100); // Pequeno delay para melhor tracking

    return () => clearTimeout(timeoutId);
  }, [location]);

  useEffect(() => {
    let isMounted = true;
    
    // Inicialização da aplicação com cleanup
    const initApp = async () => {
      try {
        // Preload de recursos críticos com timeout
        const preloadPromises = [
          // Preload de imagens importantes com timeout
          Promise.race([
            new Promise((resolve) => {
              const img = new Image();
              img.onload = resolve;
              img.onerror = resolve;
              img.src = '/src/assets/butterfly-logo.png';
            }),
            new Promise(resolve => setTimeout(resolve, 2000)) // Timeout de 2s
          ]),
          // Simular inicialização de configurações com timeout reduzido
          new Promise((resolve) => setTimeout(resolve, 300))
        ];
        
        await Promise.all(preloadPromises);
      } catch (error) {
        console.error('Erro na inicialização:', error);
      } finally {
        if (isMounted) {
          setIsInitialized(true);
        }
      }
    };

    initApp();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isInitialized) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <MainLayout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={
              <Suspense fallback={<PageFallback page="Página Inicial" />}>
                <Index />
              </Suspense>
            } />
            <Route path="/auth" element={
              <Suspense fallback={<PageFallback page="Autenticação" />}>
                <Auth />
              </Suspense>
            } />
            <Route path="/dashboard" element={
              <Suspense fallback={<PageFallback page="Dashboard" />}>
                <Dashboard />
              </Suspense>
            } />
            <Route path="/admin" element={
              <Suspense fallback={<PageFallback page="Painel Administrativo" />}>
                <AdminTestRoute />
              </Suspense>
            } />
            <Route path="/create-admin" element={
              <Suspense fallback={<PageFallback page="Criar Admin" />}>
                <AdminUserCreator />
              </Suspense>
            } />
            <Route path="/session" element={
              <Suspense fallback={<PageFallback page="Sessão" />}>
                <FullSession />
              </Suspense>
            } />
            <Route path="/sample-session" element={
              <Suspense fallback={<PageFallback page="Sessão Demonstrativa" />}>
                <SampleSession />
              </Suspense>
            } />
            <Route path="/ranking" element={
              <Suspense fallback={<PageFallback page="Ranking" />}>
                <PublicRanking />
              </Suspense>
            } />
            <Route path="/health/metrics" element={
              <Suspense fallback={<PageFallback page="Métricas de Saúde" />}>
                <HealthMetrics />
              </Suspense>
            } />
            <Route path="*" element={
              <Suspense fallback={<PageFallback page="Página" />}>
                <NotFound />
              </Suspense>
            } />
          </Routes>
        </AnimatePresence>
        
        <Toaster />
        <ErrorDisplay 
          errors={errors} 
          onClearError={clearError} 
          onClearAll={clearErrors} 
        />
      </MainLayout>
    </ErrorBoundary>
  );
});

AppContent.displayName = 'AppContent';

// Componente raiz da aplicação
const App = React.memo(() => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
});

App.displayName = 'App';

export default App;
