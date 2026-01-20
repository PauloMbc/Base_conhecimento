
import { Note, LearningStep } from './types';

export const INITIAL_LEARNING_STEPS: LearningStep[] = [
  {
    id: 'l1',
    title: 'O Despertar da Pena',
    description: 'Aprenda a preparar a superfície do pergaminho para aceitar a tinta encantada sem que ela sangre entre as dimensões.',
    tags: ['Básico', 'Escriba'],
    isCompleted: true,
    level: 'Iniciante',
    icon: 'edit_note'
  },
  {
    id: 'l2',
    title: 'Botânica de Sombras',
    description: 'Identificação de ervas lunares e sua destilação em frascos de cristal. O primeiro passo para a cura mística.',
    tags: ['Alquimia', 'Natureza'],
    isCompleted: false,
    level: 'Iniciante',
    icon: 'eco'
  },
  {
    id: 'l3',
    title: 'Geometria das Runas',
    description: 'O traçado perfeito do círculo de proteção. Um erro de um milímetro pode atrair entidades indesejadas.',
    tags: ['Runas', 'Proteção'],
    isCompleted: false,
    level: 'Intermediário',
    icon: 'pentagon'
  },
  {
    id: 'l4',
    title: 'Simbolismo Arcaico',
    description: 'Decifre os glifos das eras passadas encontrados nas ruínas de calcário ao norte.',
    tags: ['História', 'Runas'],
    isCompleted: false,
    level: 'Intermediário',
    icon: 'history_edu'
  },
  {
    id: 'l5',
    title: 'Cartografia Estelar',
    description: 'Mapeie o movimento de Órion para entender os ciclos de mana no Velho Mundo.',
    tags: ['Astronomia', 'Navegação'],
    isCompleted: false,
    level: 'Mestre',
    icon: 'auto_awesome'
  },
  {
    id: 'l6',
    title: 'A Transmutação Final',
    description: 'O segredo para converter pensamentos abstratos em realidade física através da vontade pura.',
    tags: ['Alquimia', 'Filosofia'],
    isCompleted: false,
    level: 'Mestre',
    icon: 'Cyclone'
  }
];

export const INITIAL_NOTES: Note[] = [
  {
    id: '1',
    title: 'Alquimia Herbácea',
    content: 'Lavanda seca misturada com orvalho da manhã... ferva sob a lua minguante até que a essência se torne um violeta profundo.',
    category: 'ARCANOS',
    timestamp: 'Notado há 2 dias',
    isArchived: false,
    isPrivate: false,
    icon: 'auto_stories'
  },
  {
    id: '2',
    title: 'Portões de Ferro',
    content: 'A terceira chave é mantida pelo vigia silencioso na torre norte. Cuidado com os sussurros da guarda de ferro.',
    category: 'ARCANOS',
    timestamp: 'Equinócio de Outono',
    isArchived: false,
    isPrivate: false,
    icon: 'vpn_key'
  },
  {
    id: '3',
    title: 'Bosques Sussurrantes',
    content: 'Os caminhos mudam com o vento. Não se afaste dos marcadores de prata ou você poderá se perder no tempo.',
    category: 'CARTOGRAFIA',
    timestamp: 'Ontem',
    isArchived: false,
    isPrivate: false,
    icon: 'explore'
  },
  {
    id: '7',
    title: 'Ritual Secreto',
    content: 'Esta nota está protegida pelo selo do silêncio. Apenas para os olhos do mestre escriba.',
    category: 'PRIVADO',
    timestamp: 'Oculto',
    isArchived: false,
    isPrivate: true,
    icon: 'lock'
  },
  {
    id: '5',
    title: 'Suprimentos de Alquimia',
    content: '- Raiz de mandrágora\n- Mercúrio purificado\n- Lavanda seca\n- Pó de cinábrio',
    category: 'FILOSOFIA',
    timestamp: 'Inscrito há: 2m',
    isArchived: false,
    isPrivate: false,
    icon: 'inventory_2'
  },
  {
    id: '6',
    title: 'A Grande Obra',
    content: 'A transmutação de pensamentos de chumbo em insights dourados requer o fogo do foco constante e paciência.',
    category: 'FILOSOFIA',
    timestamp: 'Ano 2024 • Out',
    isArchived: false,
    isPrivate: false,
    icon: 'auto_fix_high'
  }
];
