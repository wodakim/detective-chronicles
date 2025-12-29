import { create } from 'zustand';

export type ClueType = 'visual' | 'document' | 'object' | 'testimony' | 'medical';

export interface Clue {
  id: string;
  title: string;
  description: string;
  type: ClueType;
  image?: string;
  content?: string; // For documents or transcripts
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
  clues: string[]; // IDs of clues found here
  characters: string[]; // IDs of characters found here
}

export interface Connection {
  id: string;
  clueId1: string;
  clueId2: string;
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
  
  // Actions
  setCurrentLocation: (id: string | null) => void;
  discoverClue: (id: string) => void;
  addConnection: (clueId1: string, clueId2: string) => boolean;
  resetGame: () => void;
}

// Initial Data for "L'Écho Silencieux"
const initialClues: Record<string, Clue> = {
  'c1': {
    id: 'c1',
    title: 'Seringue',
    description: 'Une seringue usagée trouvée au sol, à droite du fauteuil.',
    type: 'visual',
    image: '/images/syringe.jpg', // Placeholder
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
    isDiscovered: true, // Known from start
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
    image: '/images/detective_desk_background.jpg', // Reusing for now
    clues: [],
    characters: ['char1']
  },
  'loc3': {
    id: 'loc3',
    name: 'Appartement d\'Elias',
    description: 'Un sanctuaire de musique. Un piano à queue domine la pièce.',
    image: '/images/detective_desk_background.jpg', // Reusing for now
    clues: ['c4'],
    characters: ['char2']
  }
};

const initialCharacters: Record<string, Character> = {
  'char1': {
    id: 'char1',
    name: 'Marcus Vane',
    role: 'Agent',
    description: 'L\'agent d\'Elias. Il semble plus préoccupé par les pertes financières que par la mort de son client.',
    image: '/images/case_file_cover.jpg', // Placeholder
    isSuspect: true
  },
  'char2': {
    id: 'char2',
    name: 'Sarah Jenkins',
    role: 'Rivale',
    description: 'Pianiste talentueuse mais restée dans l\'ombre d\'Elias.',
    image: '/images/case_file_cover.jpg', // Placeholder
    isSuspect: true
  }
};

export const useGameStore = create<GameState>((set, get) => ({
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

  addConnection: (clueId1, clueId2) => {
    // Logic to check if connection is valid
    // For this demo: Gaucher (c4) + Piqûre Bras Gauche (c5) is the winning combo
    const isCorrect = (clueId1 === 'c4' && clueId2 === 'c5') || (clueId1 === 'c5' && clueId2 === 'c4');
    
    const newConnection: Connection = {
      id: Math.random().toString(36).substr(2, 9),
      clueId1,
      clueId2,
      reason: isCorrect ? "Contradiction physique majeure !" : "Lien incertain...",
      isCorrect
    };

    set((state) => ({
      connections: [...state.connections, newConnection]
    }));

    return isCorrect;
  },

  resetGame: () => set({
    currentLocationId: null,
    clues: initialClues,
    connections: [],
    dialogueHistory: []
  })
}));
