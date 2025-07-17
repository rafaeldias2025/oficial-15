import {
  Home,
  Activity,
  Heart,
  Calendar,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Smartphone,
  FileText,
  TrendingUp,
  Scale,
  Trophy,
  Target,
  Award,
  User,
  GraduationCap,
  LucideIcon,
} from 'lucide-react';

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path?: string;
  badge?: string | number;
  subItems?: MenuItem[];
}

export const mainMenuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/dashboard',
  },
  {
    id: 'health',
    label: 'Saúde',
    icon: Heart,
    subItems: [
      {
        id: 'metrics',
        label: 'Métricas',
        icon: Activity,
        path: '/health/metrics',
      },
      {
        id: 'physical-data',
        label: 'Dados Físicos',
        icon: Scale,
        path: '/health/physical-data',
      },
      {
        id: 'progress',
        label: 'Meu Progresso',
        icon: TrendingUp,
        path: '/health/progress',
      },
    ],
  },
  {
    id: 'courses',
    label: 'Cursos',
    icon: GraduationCap,
    subItems: [
      {
        id: 'library',
        label: 'Biblioteca',
        icon: FileText,
        path: '/courses/library',
      },
      {
        id: 'paid',
        label: 'Cursos Pagos',
        icon: Award,
        path: '/courses/paid',
      },
    ],
  },
  {
    id: 'activities',
    label: 'Atividades',
    icon: Target,
    subItems: [
      {
        id: 'missions',
        label: 'Missões Diárias',
        icon: Calendar,
        path: '/activities/missions',
      },
      {
        id: 'challenges',
        label: 'Desafios',
        icon: Trophy,
        path: '/activities/challenges',
      },
      {
        id: 'goals',
        label: 'Metas',
        icon: Target,
        path: '/activities/goals',
      },
    ],
  },
  {
    id: 'devices',
    label: 'Dispositivos',
    icon: Smartphone,
    path: '/devices',
    badge: 2,
  },
  {
    id: 'reports',
    label: 'Relatórios',
    icon: FileText,
    path: '/reports',
  },
];

export const bottomMenuItems: MenuItem[] = [
  {
    id: 'profile',
    label: 'Perfil',
    icon: User,
    path: '/profile',
  },
  {
    id: 'settings',
    label: 'Configurações',
    icon: Settings,
    path: '/settings',
  },
  {
    id: 'help',
    label: 'Ajuda',
    icon: HelpCircle,
    path: '/help',
  },
  {
    id: 'logout',
    label: 'Sair',
    icon: LogOut,
    path: '/logout',
  },
];
