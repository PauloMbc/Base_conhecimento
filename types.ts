
export type Category = 'ARCANOS' | 'CARTOGRAFIA' | 'FILOSOFIA' | 'ESTRATÉGIA' | 'BIBLIOTECA' | 'PRIVADO' | 'CONFIGURAÇÕES';

export interface LearningStep {
  id: string;
  title: string;
  description: string;
  tags: string[];
  isCompleted: boolean;
  level: 'Iniciante' | 'Intermediário' | 'Mestre';
  icon: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: Category;
  timestamp: string;
  isArchived: boolean;
  isPrivate: boolean;
  color?: string;
  icon?: string;
}

export type Theme = 'light' | 'dark';

export interface AppState {
  notes: Note[];
  theme: Theme;
  searchQuery: string;
  activeCategory: Category | 'ALL';
}
