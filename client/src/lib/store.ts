import { create } from 'zustand';

export type ClueType = 'visual' | 'document' | 'object' | 'testimony' | 'medical';

export interface Clue {
  id: string;
  title: string;
  description: string;
  type: ClueType;
  image?: string;
  content?: string;
  isDiscovered: boolean;
  locationId: string;
}

export interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
  isSuspect: boolean;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  image: string;
  clues: string[];
  characters: string[];
}

export interface Connection {
  id: string;
  clueId1: string;
  clueId2: string;
  clueId1Type: 'clue' | 'character';
  clueId2Type: 'clue' | 'character';
  reason: string;
  isCorrect: boolean;
}

export interface GameState {
  currentLocationId: string | null;
  clues: Record<string, Clue>;
  characters: Record<string, Character>;
  locations: Record<string, Location>;
  connections: Connection[];
  dialogueHistory: string[];
  
  setCurrentLocation: (id: string | null) => void;
  discoverClue: (id: string) => void;
  addConnection: (id1: string, id2: string, type1: 'clue' | 'character', type2: 'clue' | 'character') => boolean;
  clearConnections: () => void;
  resetGame: () => void;
}

// Initial Data for "L'Écho Silencieux"
const initialClues: Record<string, Clue> = {
  'c1': {
    id: 'c1',
    title: 'Seringue',
    description: 'Une seringue usagée trouvée au sol, à droite du fauteuil.',
    type: 'visual',
    image: '/images/syringe.jpg',
    isDiscovered: false,
    locationId: 'loc1'
  },
  'c2': {
    id: 'c2',
    title: 'Lettre d\'adieu',
    description: 'Une lettre tapée à la machine. "Je ne peux plus continuer. La musique s\'est tue."',
    type: 'document',
    content: 'Je ne peux plus continuer. La musique s\'est tue. Adieu.',
    isDiscovered: false,
    locationId: 'loc1'
  },
  'c3': {
    id: 'c3',
    title: 'Partition "Renaissance"',
    description: 'La dernière composition d\'Elias. Le titre et les notes suggèrent un renouveau, pas une fin.',
    type: 'object',
    isDiscovered: false,
    locationId: 'loc1'
  },
  'c4': {
    id: 'c4',
    title: 'Elias est Gaucher',
    description: 'Observation confirmée par sa sœur et des photos de concert.',
    type: 'medical',
    isDiscovered: true,
    locationId: 'loc3'
  },
  'c5': {
    id: 'c5',
    title: 'Piqûre Bras Gauche',
    description: 'Le rapport d\'autopsie indique le point d\'injection sur le bras gauche.',
    type: 'medical',
    isDiscovered: false,
    locationId: 'loc1'
  }
};

const initialLocations: Record<string, Location> = {
  'loc1': {
    id: 'loc1',
    name: 'La Loge d\'Elias',
    description: 'Une pièce sombre et encombrée. L\'odeur du vieux tabac et du parfum bon marché flotte encore.',
    image: '/images/crime_scene_photo.jpg',
    clues: ['c1', 'c2', 'c3', 'c5'],
    characters: []
  },
  'loc2': {
    id: 'loc2',
    name: 'Bureau de l\'Agent',
    description: 'Moderne, froid, impersonnel. Des disques d\'or aux murs.',
    image: '/images/detective_desk_background.jpg',
    clues: [],
    characters: ['char1']
  },
  'loc3': {
    id: 'loc3',
    name: 'Appartement d\'Elias',
    description: 'Un sanctuaire de musique. Un piano à queue domine la pièce.',
    image: '/images/detective_desk_background.jpg',
    clues: ['c4'],
    characters: ['char2']
  }
};

const initialCharacters: Record<string, Character> = {
  'char1': {
    id: 'char1',
    name: 'Marcus Vane',
    role: 'Agent',
    description: 'Manipulateur, narcissique. Mobile: rupture de contrat. Alibi: Au bar (confirmé, mais a pu s\'éclipser).',
    image: '/images/case_file_cover.jpg',
    isSuspect: true
  },
  'char2': {
    id: 'char2',
    name: 'Sarah Jenkins',
    role: 'Rivale',
    description: 'Jalousie professionnelle. Impulsive, colérique. Alibi: En coulisses (pas de témoins).',
    image: '/images/case_file_cover.jpg',
    isSuspect: true
  },
  'char3': {
    id: 'char3',
    name: 'Dr. Aris Thorne',
    role: 'Frère',
    description: 'Froid, calculateur, connaissances médicales. Mobile: héritage. Alibi: Chez lui (voiture vue près du club).',
    image: '/images/case_file_cover.jpg',
    isSuspect: true
  }
};

export const getSuspects = (characters: Record<string, Character>) => {
  return Object.values(characters).filter(c => c.isSuspect);
};

export const useGameStore = create<GameState>((set) => ({
  currentLocationId: null,
  clues: initialClues,
  characters: initialCharacters,
  locations: initialLocations,
  connections: [],
  dialogueHistory: [],

  setCurrentLocation: (id) => set({ currentLocationId: id }),
  
  discoverClue: (id) => set((state) => ({
    clues: {
      ...state.clues,
      [id]: { ...state.clues[id], isDiscovered: true }
    }
  })),

  addConnection: (id1, id2, type1, type2) => {
    const isCorrect = (id1 === 'c4' && id2 === 'c5') || (id1 === 'c5' && id2 === 'c4');
    
    const newConnection: Connection = {
      id: Math.random().toString(36).substr(2, 9),
      clueId1: id1,
      clueId2: id2,
      clueId1Type: type1,
      clueId2Type: type2,
      reason: isCorrect ? "Contradiction physique majeure !" : "Lien potentiel détecté...",
      isCorrect
    };

    set((state) => ({
      connections: [...state.connections, newConnection]
    }));

    return isCorrect;
  },

  clearConnections: () => set({ connections: [] }),

  resetGame: () => set({
    currentLocationId: null,
    clues: initialClues,
    characters: initialCharacters,
    connections: [],
    dialogueHistory: []
  })
}));
