export interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  coverImage: string;
  progress: number;
  duration: string;
  rating: number;
  studentsCount: number;
  status: 'not-started' | 'in-progress' | 'completed';
  instructor: string;
}

export const simulatedCourses: Course[] = [
  {
    id: '1',
    title: 'Reeducação Alimentar Definitiva',
    category: 'Nutrição',
    description: 'Aprenda os fundamentos de uma alimentação saudável e sustentável para toda a vida. Descubra como fazer escolhas inteligentes.',
    coverImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    progress: 65,
    duration: '4h 30min',
    rating: 4.8,
    studentsCount: 1240,
    status: 'in-progress',
    instructor: 'Dr. Ana Silva'
  },
  {
    id: '2',
    title: 'Mindfulness para Emagrecimento',
    category: 'Psicologia',
    description: 'Técnicas de atenção plena aplicadas ao processo de emagrecimento consciente. Transforme sua relação com a comida.',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    progress: 0,
    duration: '3h 15min',
    rating: 4.9,
    studentsCount: 856,
    status: 'not-started',
    instructor: 'Dra. Maria Santos'
  },
  {
    id: '3',
    title: 'Exercícios em Casa: Do Básico ao Avançado',
    category: 'Atividade Física',
    description: 'Programa completo de exercícios para fazer em casa, sem equipamentos. Desenvolva força, resistência e flexibilidade.',
    coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    progress: 100,
    duration: '6h 45min',
    rating: 4.7,
    studentsCount: 2150,
    status: 'completed',
    instructor: 'Prof. João Costa'
  },
  {
    id: '4',
    title: 'Gerenciamento de Estresse e Ansiedade',
    category: 'Bem-estar',
    description: 'Estratégias práticas para lidar com o estresse e ansiedade no dia a dia. Encontre seu equilíbrio interior.',
    coverImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    progress: 25,
    duration: '2h 50min',
    rating: 4.6,
    studentsCount: 674,
    status: 'in-progress',
    instructor: 'Dra. Clara Oliveira'
  },
  {
    id: '5',
    title: 'Meditação e Autocuidado',
    category: 'Mindfulness',
    description: 'Desenvolva uma prática de meditação consistente e aprenda técnicas de autocuidado para uma vida mais plena.',
    coverImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    progress: 0,
    duration: '5h 20min',
    rating: 4.8,
    studentsCount: 920,
    status: 'not-started',
    instructor: 'Mestre Marina Lima'
  },
  {
    id: '6',
    title: 'Detox Natural e Sustentável',
    category: 'Nutrição',
    description: 'Aprenda a desintoxicar seu corpo de forma natural com alimentos e práticas saudáveis.',
    coverImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    progress: 0,
    duration: '3h 45min',
    rating: 4.7,
    studentsCount: 789,
    status: 'not-started',
    instructor: 'Nutricionista Paula'
  },
  {
    id: '7',
    title: 'Yoga para Perda de Peso',
    category: 'Atividade Física',
    description: 'Sequências de yoga específicas para acelerar o metabolismo e promover o emagrecimento saudável.',
    coverImage: 'https://images.unsplash.com/photo-1506629905826-b2562640e3e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    progress: 40,
    duration: '5h 10min',
    rating: 4.9,
    studentsCount: 1580,
    status: 'in-progress',
    instructor: 'Instrutora Carla'
  },
  {
    id: '8',
    title: 'Saúde Mental e Autocuidado',
    category: 'Psicologia',
    description: 'Desenvolva estratégias para cuidar da sua saúde mental e promover o bem-estar emocional.',
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    progress: 0,
    duration: '4h 20min',
    rating: 4.8,
    studentsCount: 945,
    status: 'not-started',
    instructor: 'Psicóloga Helena'
  },
  {
    id: '9',
    title: 'Pilates para Iniciantes',
    category: 'Atividade Física',
    description: 'Método Pilates adaptado para iniciantes, focando no fortalecimento do core e postura.',
    coverImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    progress: 75,
    duration: '3h 30min',
    rating: 4.6,
    studentsCount: 1234,
    status: 'in-progress',
    instructor: 'Prof. Roberto'
  },
  {
    id: '10',
    title: 'Hábitos Saudáveis que Transformam',
    category: 'Bem-estar',
    description: 'Aprenda a criar e manter hábitos saudáveis que irão transformar sua vida para sempre.',
    coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    progress: 0,
    duration: '6h 15min',
    rating: 4.7,
    studentsCount: 2089,
    status: 'not-started',
    instructor: 'Coach Fernanda'
  },
  {
    id: '11',
    title: 'Receitas Saudáveis e Deliciosas',
    category: 'Nutrição',
    description: 'Descubra receitas incríveis que são nutritivas e irresistíveis. Cozinhe com prazer e saúde.',
    coverImage: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    progress: 30,
    duration: '4h 45min',
    rating: 4.9,
    studentsCount: 3267,
    status: 'in-progress',
    instructor: 'Chef Ana Carolina'
  },
  {
    id: '12',
    title: 'Corrida para Iniciantes',
    category: 'Atividade Física',
    description: 'Do sofá aos 5K: um programa completo para começar a correr de forma segura e progressiva.',
    coverImage: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    progress: 0,
    duration: '3h 20min',
    rating: 4.6,
    studentsCount: 2834,
    status: 'not-started',
    instructor: 'Prof. Ricardo Silva'
  },
  {
    id: '13',
    title: 'Terapia Cognitiva para Ansiedade',
    category: 'Psicologia',
    description: 'Técnicas de terapia cognitivo-comportamental para gerenciar ansiedade e pensamentos negativos.',
    coverImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    progress: 0,
    duration: '5h 30min',
    rating: 4.8,
    studentsCount: 1892,
    status: 'not-started',
    instructor: 'Dra. Lucia Mendes'
  },
  {
    id: '14',
    title: 'Musculação em Casa',
    category: 'Atividade Física',
    description: 'Desenvolva músculos e força usando apenas peso corporal e equipamentos básicos.',
    coverImage: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    progress: 85,
    duration: '7h 10min',
    rating: 4.7,
    studentsCount: 4189,
    status: 'in-progress',
    instructor: 'Prof. Marcus Oliveira'
  },
  {
    id: '15',
    title: 'Smoothies e Sucos Detox',
    category: 'Nutrição',
    description: 'Receitas de smoothies e sucos naturais para desintoxicar e nutrir seu corpo.',
    coverImage: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    progress: 0,
    duration: '2h 15min',
    rating: 4.5,
    studentsCount: 1345,
    status: 'not-started',
    instructor: 'Nutricionista Carla'
  },
  {
    id: '16',
    title: 'Relaxamento e Respiração',
    category: 'Mindfulness',
    description: 'Técnicas de respiração e relaxamento para reduzir stress e aumentar o bem-estar.',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    progress: 60,
    duration: '3h 40min',
    rating: 4.9,
    studentsCount: 2978,
    status: 'in-progress',
    instructor: 'Instrutor Paulo'
  },
  {
    id: '17',
    title: 'Sono Reparador e Qualidade de Vida',
    category: 'Bem-estar',
    description: 'Aprenda a melhorar a qualidade do seu sono para ter mais energia e disposição.',
    coverImage: 'https://images.unsplash.com/photo-1520206183501-b80df61043c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    progress: 0,
    duration: '4h 00min',
    rating: 4.6,
    studentsCount: 1623,
    status: 'not-started',
    instructor: 'Dra. Isabela Santos'
  },
  {
    id: '18',
    title: 'Natação para Condicionamento',
    category: 'Atividade Física',
    description: 'Técnicas de natação para melhorar condicionamento físico e queimar calorias.',
    coverImage: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    progress: 0,
    duration: '5h 25min',
    rating: 4.8,
    studentsCount: 756,
    status: 'not-started',
    instructor: 'Prof. André Costa'
  },
  {
    id: '19',
    title: 'Autoestima e Confiança',
    category: 'Psicologia',
    description: 'Desenvolva uma autoestima sólida e ganhe confiança para alcançar seus objetivos.',
    coverImage: 'https://images.unsplash.com/photo-1594824804732-ca58f6d50ffd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    progress: 0,
    duration: '6h 30min',
    rating: 4.7,
    studentsCount: 2456,
    status: 'not-started',
    instructor: 'Coach Beatriz Lima'
  },
  {
    id: '20',
    title: 'Dança Fitness Divertida',
    category: 'Atividade Física',
    description: 'Queime calorias dançando! Aulas divertidas de dança fitness para todos os níveis.',
    coverImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    progress: 45,
    duration: '4h 20min',
    rating: 4.9,
    studentsCount: 5211,
    status: 'in-progress',
    instructor: 'Instrutora Marina'
  },
  {
    id: '21',
    title: 'Planejamento de Refeições',
    category: 'Nutrição',
    description: 'Organize suas refeições da semana de forma prática e nutritiva.',
    coverImage: 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    progress: 0,
    duration: '3h 15min',
    rating: 4.6,
    studentsCount: 1678,
    status: 'not-started',
    instructor: 'Nutricionista Pedro'
  },
  {
    id: '22',
    title: 'Spa em Casa: Autocuidado Total',
    category: 'Bem-estar',
    description: 'Transforme sua casa em um spa e aprenda técnicas de autocuidado e relaxamento.',
    coverImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    progress: 0,
    duration: '3h 50min',
    rating: 4.8,
    studentsCount: 934,
    status: 'not-started',
    instructor: 'Terapeuta Sofia'
  },
  {
    id: '23',
    title: 'Caminhada Consciente',
    category: 'Mindfulness',
    description: 'Combine exercício físico com meditação através da prática de caminhada consciente.',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    progress: 25,
    duration: '2h 45min',
    rating: 4.7,
    studentsCount: 1567,
    status: 'in-progress',
    instructor: 'Instrutor Gabriel'
  },
  {
    id: '24',
    title: 'Suplementação Inteligente',
    category: 'Nutrição',
    description: 'Aprenda sobre suplementos alimentares e como usá-los de forma consciente e segura.',
    coverImage: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    progress: 0,
    duration: '4h 35min',
    rating: 4.5,
    studentsCount: 823,
    status: 'not-started',
    instructor: 'Dr. Eduardo Rocha'
  },
  {
    id: '25',
    title: 'Flexibilidade e Alongamento',
    category: 'Atividade Física',
    description: 'Melhore sua flexibilidade e previna lesões com rotinas de alongamento eficazes.',
    coverImage: 'https://images.unsplash.com/photo-1506629905826-b2562640e3e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    progress: 100,
    duration: '3h 30min',
    rating: 4.8,
    studentsCount: 3234,
    status: 'completed',
    instructor: 'Professora Amanda'
  }
];

export const categories = [
  'Nutrição',
  'Psicologia', 
  'Atividade Física',
  'Bem-estar',
  'Mindfulness'
];