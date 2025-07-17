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
        id: 'history',
        label: 'Histórico',
        icon: Calendar,
        path: '/health/history',
      },
      {
        id: 'analysis',
        label: 'Análises',
        icon: BarChart3,
        path: '/health/analysis',
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
  {
    id: 'goals',
    label: 'Metas',
    icon: TrendingUp,
    path: '/goals',
    badge: 'New',
  },
];

export const bottomMenuItems: MenuItem[] = [
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
