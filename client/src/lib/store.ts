import { create } from 'zustand';

export type ClueType = 'visual' | 'document' | 'object' | 'testimony' | 'medical' | 'video' | 'financial';

export interface Clue {
  id: string;
  title: string; // This will now be a translation key
  description: string; // This will now be a translation key
  type: ClueType;
  image?: string;
  content?: string; // This will now be a translation key if it exists
  isDiscovered: boolean;
  locationId: string;
  isMisleading?: boolean;
}

export interface Character {
  id: string;
  name: string; // This will now be a translation key
  role: string; // This will now be a translation key
  description: string; // This will now be a translation key
  image: string;
  isSuspect: boolean;
  suspicionLevel?: number;
}

export interface Location {
  id: string;
  name: string; // This will now be a translation key
  description: string; // This will now be a translation key
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
  reason: string; // This will now be a translation key
  isCorrect: boolean;
}

export interface DialogueOption {
  id: string;
  text: string;
  response: string;
  revealClue?: string;
  suspicionIncrease?: number;
}

export interface DialogueNode {
  id: string;
  characterId: string;
  question: string;
  options: DialogueOption[];
}

export interface CaseAnalysis {
  solved: boolean;
  culpritId: string;
  correctConnections: number;
  totalConnections: number;
  verdict: string; // This will now be a translation key
  explanation: string; // This will now be a translation key
}

export interface Note {
  id: string;
  clueId?: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface GameState {
  currentLocationId: string | null;
  clues: Record<string, Clue>;
  characters: Record<string, Character>;
  locations: Record<string, Location>;
  connections: Connection[];
  dialogueHistory: string[];
  caseAnalysis: CaseAnalysis | null;
  notes: Record<string, Note>;
  language: 'fr' | 'en' | 'pl';
  saves: Record<string, { timestamp: number; state: Partial<GameState> }>;
  
  setCurrentLocation: (id: string | null) => void;
  discoverClue: (id: string) => void;
  addConnection: (id1: string, id2: string, type1: 'clue' | 'character', type2: 'clue' | 'character') => boolean;
  clearConnections: () => void;
  analyzeCase: () => CaseAnalysis;
  addNote: (title: string, content: string, clueId?: string) => string;
  updateNote: (id: string, title: string, content: string) => void;
  deleteNote: (id: string) => void;
  setLanguage: (lang: 'fr' | 'en' | 'pl') => void;
  saveGame: (slot: number) => void;
  loadGame: (slot: number) => boolean;
  deleteSave: (slot: number) => void;
  resetGame: () => void;
}

// Initial Clues with translation keys
const initialClues: Record<string, Clue> = {
  'c1': { id: 'c1', title: 'clue.c1.title', description: 'clue.c1.desc', type: 'visual', isDiscovered: false, locationId: 'loc1' },
  'c2': { id: 'c2', title: 'clue.c2.title', description: 'clue.c2.desc', type: 'document', content: 'clue.c2.content', isDiscovered: false, locationId: 'loc1', isMisleading: true },
  'c3': { id: 'c3', title: 'clue.c3.title', description: 'clue.c3.desc', type: 'object', isDiscovered: false, locationId: 'loc1' },
  'c4': { id: 'c4', title: 'clue.c4.title', description: 'clue.c4.desc', type: 'medical', isDiscovered: true, locationId: 'loc3' },
  'c5': { id: 'c5', title: 'clue.c5.title', description: 'clue.c5.desc', type: 'medical', isDiscovered: false, locationId: 'loc1' },
  'c8': { id: 'c8', title: 'clue.c8.title', description: 'clue.c8.desc', type: 'document', content: 'clue.c8.content', isDiscovered: false, locationId: 'loc1' },
  'c11': { id: 'c11', title: 'clue.c11.title', description: 'clue.c11.desc', type: 'financial', isDiscovered: false, locationId: 'loc2' },
  'c12': { id: 'c12', title: 'clue.c12.title', description: 'clue.c12.desc', type: 'financial', isDiscovered: false, locationId: 'loc2' },
  'c14': { id: 'c14', title: 'clue.c14.title', description: 'clue.c14.desc', type: 'document', isDiscovered: false, locationId: 'loc2' },
  'c21': { id: 'c21', title: 'clue.c21.title', description: 'clue.c21.desc', type: 'video', isDiscovered: false, locationId: 'loc5' },
  'c23': { id: 'c23', title: 'clue.c23.title', description: 'clue.c23.desc', type: 'document', isDiscovered: false, locationId: 'loc5' },
  'c30': { id: 'c30', title: 'clue.c30.title', description: 'clue.c30.desc', type: 'document', isDiscovered: false, locationId: 'loc7' }
};

// Initial Locations with translation keys
const initialLocations: Record<string, Location> = {
  'loc1': { id: 'loc1', name: 'loc.loc1.name', description: 'loc.loc1.desc', image: '/images/crime_scene_photo.jpg', clues: ['c1', 'c2', 'c3', 'c5', 'c8'], characters: [] },
  'loc2': { id: 'loc2', name: 'loc.loc2.name', description: 'loc.loc2.desc', image: '/images/detective_desk_background.jpg', clues: ['c11', 'c12', 'c14'], characters: ['char1'] },
  'loc3': { id: 'loc3', name: 'loc.loc3.name', description: 'loc.loc3.desc', image: '/images/detective_desk_background.jpg', clues: ['c4'], characters: ['char2'] },
  'loc4': { id: 'loc4', name: 'loc.loc4.name', description: 'loc.loc4.desc', image: '/images/investigation_board.jpg', clues: [], characters: ['char5', 'char6'] },
  'loc5': { id: 'loc5', name: 'loc.loc5.name', description: 'loc.loc5.desc', image: '/images/detective_desk_background.jpg', clues: ['c21', 'c23'], characters: ['char4'] },
  'loc6': { id: 'loc6', name: 'loc.loc6.name', description: 'loc.loc6.desc', image: '/images/case_file_cover.jpg', clues: [], characters: ['char2'] },
  'loc7': { id: 'loc7', name: 'loc.loc7.name', description: 'loc.loc7.desc', image: '/images/detective_desk_background.jpg', clues: ['c30'], characters: ['char3', 'char7'] }
};

// Initial Characters with translation keys
const initialCharacters: Record<string, Character> = {
  'char1': { id: 'char1', name: 'char.char1.name', role: 'char.char1.role', description: 'char.char1.desc', image: '/images/case_file_cover.jpg', isSuspect: true, suspicionLevel: 0 },
  'char2': { id: 'char2', name: 'char.char2.name', role: 'char.char2.role', description: 'char.char2.desc', image: '/images/case_file_cover.jpg', isSuspect: true, suspicionLevel: 0 },
  'char3': { id: 'char3', name: 'char.char3.name', role: 'char.char3.role', description: 'char.char3.desc', image: '/images/case_file_cover.jpg', isSuspect: true, suspicionLevel: 0 },
  'char4': { id: 'char4', name: 'char.char4.name', role: 'char.char4.role', description: 'char.char4.desc', image: '/images/case_file_cover.jpg', isSuspect: false, suspicionLevel: 0 },
  'char5': { id: 'char5', name: 'char.char5.name', role: 'char.char5.role', description: 'char.char5.desc', image: '/images/case_file_cover.jpg', isSuspect: false, suspicionLevel: 0 },
  'char6': { id: 'char6', name: 'char.char6.name', role: 'char.char6.role', description: 'char.char6.desc', image: '/images/case_file_cover.jpg', isSuspect: false, suspicionLevel: 0 },
  'char7': { id: 'char7', name: 'char.char7.name', role: 'char.char7.role', description: 'char.char7.desc', image: '/images/case_file_cover.jpg', isSuspect: false, suspicionLevel: 0 }
};

export const getSuspects = (characters: Record<string, Character>) => {
  return Object.values(characters).filter(c => c.isSuspect);
};

// Dialogues will be handled by translation keys in the components
// For now, we keep the structure but use keys
const dialogues: Record<string, DialogueNode[]> = {
  'char1': [
    {
      id: 'd1-1',
      characterId: 'char1',
      question: 'interrogation.marcus.q1',
      options: [
        { id: 'opt1', text: 'interrogation.marcus.q1.opt1', response: 'interrogation.marcus.q1.opt1.resp', suspicionIncrease: 0 },
        { id: 'opt2', text: 'interrogation.marcus.q1.opt2', response: 'interrogation.marcus.q1.opt2.resp', suspicionIncrease: 2 },
        { id: 'opt3', text: 'interrogation.marcus.q1.opt3', response: 'interrogation.marcus.q1.opt3.resp', suspicionIncrease: 1 }
      ]
    }
  ]
};

export const getDialoguesForCharacter = (characterId: string) => {
  return dialogues[characterId] || [];
};

export const useGameStore = create<GameState>((set, get) => ({
  currentLocationId: null,
  clues: initialClues,
  characters: initialCharacters,
  locations: initialLocations,
  connections: [],
  dialogueHistory: [],
  caseAnalysis: null,
  notes: {},
  language: 'fr',
  saves: {},
  
  setCurrentLocation: (id) => set({ currentLocationId: id }),
  
  discoverClue: (id) => set((state) => ({
    clues: {
      ...state.clues,
      [id]: { ...state.clues[id], isDiscovered: true }
    }
  })),

  addConnection: (id1, id2, type1, type2) => {
    const keyConnections = [
      (id1 === 'c4' && id2 === 'c5') || (id1 === 'c5' && id2 === 'c4'),
      (id1 === 'c11' && id2 === 'c12') || (id1 === 'c12' && id2 === 'c11'),
      (id1 === 'c14' && id2 === 'c21') || (id1 === 'c21' && id2 === 'c14'),
      (id1 === 'c8' && id2 === 'c23') || (id1 === 'c23' && id2 === 'c8'),
      (id1 === 'char1' && id2 === 'c12') || (id1 === 'c12' && id2 === 'char1')
    ];
    
    const isCorrect = keyConnections.some(conn => conn);
    
    const newConnection: Connection = {
      id: Math.random().toString(36).substr(2, 9),
      clueId1: id1,
      clueId2: id2,
      clueId1Type: type1,
      clueId2Type: type2,
      reason: isCorrect ? "deduction.relevant_connection" : "deduction.potential_connection",
      isCorrect
    };

    set((state) => ({
      connections: [...state.connections, newConnection]
    }));

    return isCorrect;
  },

  clearConnections: () => set({ connections: [] }),

  analyzeCase: () => {
    const state = get();
    const { connections } = state;

    const keyConnections = connections.filter(conn => {
      const keyPairs = [
        (conn.clueId1 === 'c4' && conn.clueId2 === 'c5') || (conn.clueId1 === 'c5' && conn.clueId2 === 'c4'),
        (conn.clueId1 === 'c11' && conn.clueId2 === 'c12') || (conn.clueId1 === 'c12' && conn.clueId2 === 'c11'),
        (conn.clueId1 === 'c14' && conn.clueId2 === 'c21') || (conn.clueId1 === 'c21' && conn.clueId2 === 'c14'),
        (conn.clueId1 === 'c8' && conn.clueId2 === 'c23') || (conn.clueId1 === 'c23' && conn.clueId2 === 'c8'),
        (conn.clueId1 === 'char1' && conn.clueId2 === 'c12') || (conn.clueId1 === 'c12' && conn.clueId2 === 'char1')
      ];
      return keyPairs.some(pair => pair);
    });

    const correctConnCount = keyConnections.length;
    const totalConnCount = connections.length;

    let solved = false;
    let verdict = "";
    let explanation = "";

    if (correctConnCount >= 3) {
      solved = true;
      verdict = "conclusion.verdict_solved";
      explanation = "conclusion.explanation_solved";
    } else if (totalConnCount > 0) {
      solved = false;
      verdict = "conclusion.incomplete";
      explanation = "conclusion.explanation_incomplete";
    } else {
      solved = false;
      verdict = "conclusion.not_started";
      explanation = "conclusion.explanation_not_started";
    }

    const analysis: CaseAnalysis = {
      solved,
      culpritId: solved ? 'char1' : '',
      correctConnections: correctConnCount,
      totalConnections: totalConnCount,
      verdict,
      explanation
    };

    set({ caseAnalysis: analysis });
    return analysis;
  },

  addNote: (title, content, clueId) => {
    const id = Math.random().toString(36).substr(2, 9);
    const now = Date.now();
    const newNote: Note = { id, title, content, clueId, createdAt: now, updatedAt: now };
    set((state) => ({ notes: { ...state.notes, [id]: newNote } }));
    return id;
  },

  updateNote: (id, title, content) => set((state) => ({
    notes: {
      ...state.notes,
      [id]: { ...state.notes[id], title, content, updatedAt: Date.now() }
    }
  })),

  deleteNote: (id) => set((state) => {
    const newNotes = { ...state.notes };
    delete newNotes[id];
    return { notes: newNotes };
  }),

  setLanguage: (lang) => set({ language: lang }),

  saveGame: (slot) => {
    const state = get();
    const saveState = {
      currentLocationId: state.currentLocationId,
      clues: state.clues,
      characters: state.characters,
      locations: state.locations,
      connections: state.connections,
      notes: state.notes,
      language: state.language
    };
    set((state) => ({
      saves: {
        ...state.saves,
        [slot]: { timestamp: Date.now(), state: saveState }
      }
    }));
  },

  loadGame: (slot) => {
    const save = get().saves[slot];
    if (save) {
      set(save.state);
      return true;
    }
    return false;
  },

  deleteSave: (slot) => set((state) => {
    const newSaves = { ...state.saves };
    delete newSaves[slot];
    return { saves: newSaves };
  }),

  resetGame: () => set({
    currentLocationId: null,
    clues: initialClues,
    characters: initialCharacters,
    locations: initialLocations,
    connections: [],
    dialogueHistory: [],
    caseAnalysis: null,
    notes: {}
  })
}));
