import { create } from 'zustand';

export type ClueType = 'visual' | 'document' | 'object' | 'testimony' | 'medical' | 'video' | 'financial';

export interface Clue {
  id: string;
  title: string;
  description: string;
  type: ClueType;
  image?: string;
  content?: string;
  isDiscovered: boolean;
  locationId: string;
  isMisleading?: boolean;
}

export interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
  isSuspect: boolean;
  suspicionLevel?: number;
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
  verdict: string;
  explanation: string;
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
  
  setCurrentLocation: (id: string | null) => void;
  discoverClue: (id: string) => void;
  addConnection: (id1: string, id2: string, type1: 'clue' | 'character', type2: 'clue' | 'character') => boolean;
  clearConnections: () => void;
  analyzeCase: () => CaseAnalysis;
  addNote: (title: string, content: string, clueId?: string) => string;
  updateNote: (id: string, title: string, content: string) => void;
  deleteNote: (id: string) => void;
  resetGame: () => void;
}

// Expanded Clues
const initialClues: Record<string, Clue> = {
  'c1': { id: 'c1', title: 'Seringue', description: 'Une seringue usagée trouvée au sol, à droite du fauteuil.', type: 'visual', isDiscovered: false, locationId: 'loc1' },
  'c2': { id: 'c2', title: 'Lettre d\'adieu', description: 'Une lettre tapée à la machine. "Je ne peux plus continuer. La musique s\'est tue."', type: 'document', content: 'Je ne peux plus continuer. La musique s\'est tue. Adieu.', isDiscovered: false, locationId: 'loc1', isMisleading: true },
  'c3': { id: 'c3', title: 'Partition "Renaissance"', description: 'La dernière composition d\'Elias. Le titre et les notes suggèrent un renouveau, pas une fin.', type: 'object', isDiscovered: false, locationId: 'loc1' },
  'c4': { id: 'c4', title: 'Elias est Gaucher', description: 'Observation confirmée par sa sœur et des photos de concert.', type: 'medical', isDiscovered: true, locationId: 'loc3' },
  'c5': { id: 'c5', title: 'Piqûre Bras Gauche', description: 'Le rapport d\'autopsie indique le point d\'injection sur le bras gauche.', type: 'medical', isDiscovered: false, locationId: 'loc1' },
  'c6': { id: 'c6', title: 'Bouteille de Champagne Vide', description: 'Trouvée sur le piano. Elias buvait régulièrement du champagne après ses performances.', type: 'visual', isDiscovered: false, locationId: 'loc1', isMisleading: true },
  'c7': { id: 'c7', title: 'Billet d\'Avion pour Tokyo', description: 'Daté de 3 jours après la mort. Elias avait planifié un voyage secret.', type: 'document', isDiscovered: false, locationId: 'loc1', isMisleading: true },
  'c8': { id: 'c8', title: 'Carnet de Notes', description: 'Contient la phrase "M.V. veut 50%" - preuve de conflit avec Marcus.', type: 'document', content: 'M.V. veut 50%. Inacceptable. Je dois partir.', isDiscovered: false, locationId: 'loc1' },
  'c9': { id: 'c9', title: 'Fleur Fanée', description: 'Une rose rouge fanée sur le piano. Symbole romantique.', type: 'visual', isDiscovered: false, locationId: 'loc1', isMisleading: true },
  'c10': { id: 'c10', title: 'Reçu de Pharmacie', description: 'Prescription de somnifères au nom d\'Elias. Datée de 2 mois avant.', type: 'document', isDiscovered: false, locationId: 'loc1', isMisleading: true },
  'c11': { id: 'c11', title: 'Contrat de Rupture', description: 'Contrat signé par Elias le jour du meurtre. Il voulait quitter Marcus.', type: 'financial', isDiscovered: false, locationId: 'loc2' },
  'c12': { id: 'c12', title: 'Assurance Vie', description: 'Assurance vie d\'Elias pour 2 millions. Bénéficiaire : Marcus Vane.', type: 'financial', isDiscovered: false, locationId: 'loc2' },
  'c13': { id: 'c13', title: 'Emails Marcus-Dr. Chen', description: 'Correspondance entre Marcus et le médecin du club sur "la santé d\'Elias".', type: 'document', isDiscovered: false, locationId: 'loc2', isMisleading: true },
  'c14': { id: 'c14', title: 'Ticket de Parking', description: 'Ticket de parking du club, émis à 20h25. Voiture de Marcus.', type: 'document', isDiscovered: false, locationId: 'loc2' },
  'c15': { id: 'c15', title: 'Rendez-vous "Dr. Thorne"', description: 'Agenda d\'Elias : "Dr. Thorne 19h". C\'est son frère, pas un médecin.', type: 'document', isDiscovered: false, locationId: 'loc3', isMisleading: true },
  'c16': { id: 'c16', title: 'Photos de Voyage', description: 'Photos d\'Elias en Asie du Sud-Est. Projet d\'évasion personnel.', type: 'visual', isDiscovered: false, locationId: 'loc3', isMisleading: true },
  'c17': { id: 'c17', title: 'Lettre d\'Amour Inachevée', description: 'Lettre manuscrite à Sarah Jenkins. "Tu es la seule qui me comprenne..."', type: 'document', isDiscovered: false, locationId: 'loc3', isMisleading: true },
  'c18': { id: 'c18', title: 'Registre de Présence', description: 'Registre des coulisses. Sarah absent de 20h45 à 21h15.', type: 'document', isDiscovered: false, locationId: 'loc4' },
  'c19': { id: 'c19', title: 'Bouteille de Morphine Vide', description: 'Trouvée dans un coin des coulisses. Appartient au Dr. Chen.', type: 'visual', isDiscovered: false, locationId: 'loc4', isMisleading: true },
  'c20': { id: 'c20', title: 'Reçu de Livraison', description: 'Reçu de livraison de matériel pour les décors. Fausse piste.', type: 'document', isDiscovered: false, locationId: 'loc4', isMisleading: true },
  'c21': { id: 'c21', title: 'Enregistrement Vidéo', description: 'Vidéo des coulisses. Marcus entrant dans la loge à 20h30.', type: 'video', isDiscovered: false, locationId: 'loc5' },
  'c22': { id: 'c22', title: 'Contrat Marcus-Club', description: 'Marcus reçoit 15% des revenus d\'Elias du club.', type: 'financial', isDiscovered: false, locationId: 'loc5' },
  'c23': { id: 'c23', title: 'Rapport d\'Incident', description: 'Altercation entre Marcus et Elias, datée de 2 semaines avant le meurtre.', type: 'document', isDiscovered: false, locationId: 'loc5' },
  'c24': { id: 'c24', title: 'Agenda de Sarah', description: 'Agenda musical détaillé. Montre ses répétitions et alibis vérifiables.', type: 'document', isDiscovered: false, locationId: 'loc6' },
  'c25': { id: 'c25', title: 'Correspondance avec Agent Concurrent', description: 'Sarah cherchait à changer d\'agent avant le meurtre.', type: 'document', isDiscovered: false, locationId: 'loc6', isMisleading: true },
  'c26': { id: 'c26', title: 'Reçu de Cours de Danse', description: 'Sarah prenait des cours de danse le jour du meurtre.', type: 'document', isDiscovered: false, locationId: 'loc6', isMisleading: true },
  'c27': { id: 'c27', title: 'Dossier Médical d\'Elias', description: 'Dépression diagnostiquée 6 mois avant. Fausse piste suicide.', type: 'medical', isDiscovered: false, locationId: 'loc7', isMisleading: true },
  'c28': { id: 'c28', title: 'Consultation du Dr. Thorne', description: 'Rendez-vous d\'Elias avec son frère, daté de 2 jours avant le meurtre.', type: 'document', isDiscovered: false, locationId: 'loc7' },
  'c29': { id: 'c29', title: 'Prescription de Morphine', description: 'Prescription au nom du Dr. Thorne pour usage médical légitime.', type: 'medical', isDiscovered: false, locationId: 'loc7', isMisleading: true },
  'c30': { id: 'c30', title: 'Agenda du Dr. Thorne', description: 'Rendez-vous avec "patient E." à 20h le soir du meurtre.', type: 'document', isDiscovered: false, locationId: 'loc7' },
  'c31': { id: 'c31', title: 'Emails Marcus-Dr. Chen', description: 'Discussions normales sur la santé d\'Elias. Rien de suspect.', type: 'document', isDiscovered: false, locationId: 'loc2', isMisleading: true },
  'c32': { id: 'c32', title: 'Reçu Morphine Dr. Chen', description: 'Morphine prescrite au Dr. Chen pour usage médical au club.', type: 'document', isDiscovered: false, locationId: 'loc5', isMisleading: true },
  'c33': { id: 'c33', title: 'Contrats de Tous les Artistes', description: 'Contrats du club. Montre les revenus importants d\'Elias.', type: 'financial', isDiscovered: false, locationId: 'loc5' },
  'c34': { id: 'c34', title: 'Email de Véronique', description: 'Productrice : "Nous devons garder Elias à tout prix."', type: 'document', isDiscovered: false, locationId: 'loc5', isMisleading: true },
  'c35': { id: 'c35', title: 'Reçu de Cours de Piano', description: 'Thomas était élève d\'Elias. Pas de motif.', type: 'document', isDiscovered: false, locationId: 'loc4', isMisleading: true },
  'c36': { id: 'c36', title: 'Commentaires sur les Réseaux', description: 'Thomas criait "Elias est surcoté" sur les réseaux. Jalousie.', type: 'document', isDiscovered: false, locationId: 'loc4', isMisleading: true },
  'c37': { id: 'c37', title: 'Registre de Présence Clinique', description: 'Isabelle était présente à la clinique toute la soirée.', type: 'document', isDiscovered: false, locationId: 'loc7', isMisleading: true },
  'c38': { id: 'c38', title: 'Correspondance Isabelle-Elias', description: 'Correspondance amoureuse entre Isabelle et Elias. Fausse piste.', type: 'document', isDiscovered: false, locationId: 'loc7', isMisleading: true }
};

// Expanded Locations
const initialLocations: Record<string, Location> = {
  'loc1': { id: 'loc1', name: 'La Loge d\'Elias', description: 'Pièce sombre et encombrée. Odeur de tabac et de parfum.', image: '/images/crime_scene_photo.jpg', clues: ['c1', 'c2', 'c3', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10'], characters: [] },
  'loc2': { id: 'loc2', name: 'Bureau de l\'Agent Marcus Vane', description: 'Bureau moderne, froid, impersonnel. Disques d\'or aux murs.', image: '/images/detective_desk_background.jpg', clues: ['c11', 'c12', 'c13', 'c14', 'c31'], characters: ['char1'] },
  'loc3': { id: 'loc3', name: 'Appartement d\'Elias', description: 'Sanctuaire de musique. Piano à queue dominant la pièce.', image: '/images/detective_desk_background.jpg', clues: ['c4', 'c15', 'c16', 'c17'], characters: ['char2'] },
  'loc4': { id: 'loc4', name: 'Coulisses du Club', description: 'Espace chaotique avec costumes, instruments et matériel technique.', image: '/images/investigation_board.jpg', clues: ['c18', 'c19', 'c20', 'c35', 'c36'], characters: ['char5', 'char6'] },
  'loc5': { id: 'loc5', name: 'Bureau du Directeur', description: 'Luxueux, vue sur la scène. Murs couverts de photos de célébrités.', image: '/images/detective_desk_background.jpg', clues: ['c21', 'c22', 'c23', 'c32', 'c33', 'c34'], characters: ['char4'] },
  'loc6': { id: 'loc6', name: 'Appartement de Sarah Jenkins', description: 'Petit studio d\'artiste, spartiate mais organisé.', image: '/images/case_file_cover.jpg', clues: ['c24', 'c25', 'c26'], characters: ['char2'] },
  'loc7': { id: 'loc7', name: 'Clinique du Dr. Aris Thorne', description: 'Cabinet médical moderne et discret. Équipement médical sophistiqué.', image: '/images/detective_desk_background.jpg', clues: ['c27', 'c28', 'c29', 'c30', 'c37', 'c38'], characters: ['char3', 'char7'] }
};

// Expanded Characters
const initialCharacters: Record<string, Character> = {
  'char1': { id: 'char1', name: 'Marcus Vane', role: 'Agent', description: 'Manipulateur, narcissique. Mobile: rupture de contrat. Alibi: Au bar (confirmé, mais a pu s\'éclipser).', image: '/images/case_file_cover.jpg', isSuspect: true, suspicionLevel: 0 },
  'char2': { id: 'char2', name: 'Sarah Jenkins', role: 'Rivale', description: 'Jalousie professionnelle. Impulsive, colérique. Alibi: En coulisses (pas de témoins).', image: '/images/case_file_cover.jpg', isSuspect: true, suspicionLevel: 0 },
  'char3': { id: 'char3', name: 'Dr. Aris Thorne', role: 'Frère', description: 'Froid, calculateur, connaissances médicales. Mobile: héritage. Alibi: Chez lui (voiture vue près du club).', image: '/images/case_file_cover.jpg', isSuspect: true, suspicionLevel: 0 },
  'char4': { id: 'char4', name: 'Dr. Chen', role: 'Médecin du Club', description: 'Responsable des soins d\'urgence. Avait accès à la morphine et à la seringue.', image: '/images/case_file_cover.jpg', isSuspect: false, suspicionLevel: 0 },
  'char5': { id: 'char5', name: 'Thomas Mercier', role: 'Rival Pianiste', description: 'Autre pianiste du club. Jalousie professionnelle envers Elias.', image: '/images/case_file_cover.jpg', isSuspect: false, suspicionLevel: 0 },
  'char6': { id: 'char6', name: 'Véronique Leclerc', role: 'Productrice', description: 'Productrice du club. Motif financier (Elias voulait partir).', image: '/images/case_file_cover.jpg', isSuspect: false, suspicionLevel: 0 },
  'char7': { id: 'char7', name: 'Isabelle Thorne', role: 'Infirmière', description: 'Infirmière à la clinique du Dr. Thorne. Avait accès à la morphine.', image: '/images/case_file_cover.jpg', isSuspect: false, suspicionLevel: 0 }
};

export const getSuspects = (characters: Record<string, Character>) => {
  return Object.values(characters).filter(c => c.isSuspect);
};

// Expanded Dialogues
const dialogues: Record<string, DialogueNode[]> = {
  'char1': [
    {
      id: 'd1-1',
      characterId: 'char1',
      question: 'Où étiez-vous le soir du meurtre ?',
      options: [
        { id: 'opt1', text: 'Vous dites que vous étiez au bar du club. Quelqu\'un peut le confirmer ?', response: 'Oui, plusieurs personnes m\'ont vu au bar toute la soirée. Le barman peut témoigner.', suspicionIncrease: 0 },
        { id: 'opt2', text: 'Combien de temps avez-vous quitté le bar ?', response: 'Je... je suis allé aux toilettes une ou deux fois. Mais pas longtemps.', suspicionIncrease: 2 },
        { id: 'opt3', text: 'Aviez-vous accès à la loge d\'Elias ?', response: 'Bien sûr, j\'étais son agent. Mais pourquoi cette question ?', suspicionIncrease: 1 }
      ]
    },
    {
      id: 'd1-2',
      characterId: 'char1',
      question: 'Quelle était votre relation avec Elias ?',
      options: [
        { id: 'opt4', text: 'Vous vous entendiez bien ?', response: 'Excellente relation. Je l\'ai rendu riche et célèbre. Il me devait tout.', suspicionIncrease: 1 },
        { id: 'opt5', text: 'Aviez-vous des conflits récemment ?', response: 'Non, aucun. Pourquoi ? Vous pensez que j\'ai quelque chose à voir avec sa mort ?', suspicionIncrease: 3 },
        { id: 'opt6', text: 'Elias parlait-il de vouloir changer d\'agent ?', response: 'Quoi ? Non... enfin, il y a eu quelques discussions, mais rien de sérieux.', suspicionIncrease: 4, revealClue: 'c11' }
      ]
    },
    {
      id: 'd1-3',
      characterId: 'char1',
      question: 'Aviez-vous une assurance vie sur Elias ?',
      options: [
        { id: 'opt7', text: 'Aviez-vous une assurance vie sur Elias ?', response: 'Oui, c\'est standard dans le métier. Mais ce n\'est rien.', suspicionIncrease: 2 },
        { id: 'opt8', text: 'Combien valait cette assurance ?', response: 'Je... je ne me souviens pas exactement. Peut-être 500k.', suspicionIncrease: 3, revealClue: 'c12' },
        { id: 'opt9', text: 'Vous aviez des dettes de jeu ?', response: 'Quoi ? D\'où tenez-vous ça ? C\'est... c\'est une question privée.', suspicionIncrease: 4 }
      ]
    }
  ],
  'char2': [
    {
      id: 'd2-1',
      characterId: 'char2',
      question: 'Où étiez-vous le soir du meurtre ?',
      options: [
        { id: 'opt10', text: 'Vous dites que vous étiez en coulisses. Quelqu\'un vous a vu ?', response: 'J\'étais seule. Je me préparais mentalement pour ma performance après Elias.', suspicionIncrease: 2 },
        { id: 'opt11', text: 'Aviez-vous accès à la loge d\'Elias ?', response: 'Oui, comme tous les artistes. Mais je n\'y suis pas allée ce soir-là.', suspicionIncrease: 1 },
        { id: 'opt12', text: 'Le registre montre une absence de 30 minutes. Où étiez-vous ?', response: 'Je... j\'étais aux toilettes. Ou peut-être j\'ai pris l\'air dehors.', suspicionIncrease: 3 }
      ]
    },
    {
      id: 'd2-2',
      characterId: 'char2',
      question: 'Comment était votre relation avec Elias ?',
      options: [
        { id: 'opt13', text: 'Vous vous entendiez bien ?', response: 'Bien sûr. C\'était un grand musicien. Je l\'admirais.', suspicionIncrease: 0 },
        { id: 'opt14', text: 'Aviez-vous des tensions professionnelles ?', response: 'Tensions ? Non, pas vraiment. Enfin... il avait toujours les meilleurs rôles, les meilleures salles.', suspicionIncrease: 2 },
        { id: 'opt15', text: 'Aviez-vous envie de sa place ?', response: 'Quoi ? Non ! Enfin... c\'est normal de vouloir progresser dans ce métier.', suspicionIncrease: 3, revealClue: 'c25' }
      ]
    }
  ],
  'char3': [
    {
      id: 'd3-1',
      characterId: 'char3',
      question: 'Où étiez-vous le soir du meurtre ?',
      options: [
        { id: 'opt16', text: 'Vous dites que vous étiez chez vous. Quelqu\'un peut le confirmer ?', response: 'J\'étais seul. Je lis généralement le soir.', suspicionIncrease: 2 },
        { id: 'opt17', text: 'Votre voiture a été vue près du club ce soir-là.', response: 'Quoi ? C\'est impossible. Ma voiture était au garage.', suspicionIncrease: 4, revealClue: 'c21' },
        { id: 'opt18', text: 'Aviez-vous un rendez-vous avec Elias ?', response: 'Rendez-vous ? Non... enfin, peut-être que j\'ai oublié.', suspicionIncrease: 3, revealClue: 'c30' }
      ]
    },
    {
      id: 'd3-2',
      characterId: 'char3',
      question: 'Comment était votre relation avec Elias ?',
      options: [
        { id: 'opt19', text: 'Vous vous entendiez bien ?', response: 'Bien sûr. C\'était mon frère. Nous nous voyions régulièrement.', suspicionIncrease: 0 },
        { id: 'opt20', text: 'Aviez-vous des conflits familiaux ?', response: 'Non, aucun. Pourquoi cette question ?', suspicionIncrease: 1 },
        { id: 'opt21', text: 'Héritiez-vous de quelque chose à sa mort ?', response: 'Héritage ? Je... je ne sais pas. C\'est une question étrange.', suspicionIncrease: 3, revealClue: 'c27' }
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
      reason: isCorrect ? "Connexion pertinente détectée !" : "Lien potentiel détecté...",
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
      verdict = "AFFAIRE RÉSOLUE : Marcus Vane est le coupable.";
      explanation = "Vous avez correctement identifié les connexions clés. La contradiction physique (gaucher + piqûre bras gauche) prouve un meurtre. Le motif financier (assurance + rupture de contrat) et la présence au club (parking + vidéo) établissent Marcus comme coupable. Marcus a utilisé la morphine pour simuler un suicide, mais l\'injection au mauvais bras l\'a trahi.";
    } else if (totalConnCount > 0) {
      solved = false;
      verdict = "ENQUÊTE INCOMPLÈTE";
      explanation = "Vous avez créé " + totalConnCount + " connexion(s), mais vous n\'avez pas identifié suffisamment de preuves. Cherchez au moins 3 connexions clés : la contradiction physique, le motif financier, et la présence du coupable au club. Vous avez peut-être suivi des fausses pistes.";
    } else {
      solved = false;
      verdict = "ENQUÊTE NON COMMENCÉE";
      explanation = "Vous n\'avez créé aucune connexion. Explorez tous les lieux, interrogez les suspects, et reliez les indices pour former des hypothèses solides.";
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
    const note: Note = {
      id,
      clueId,
      title,
      content,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    set((state) => ({
      notes: { ...state.notes, [id]: note }
    }));
    return id;
  },

  updateNote: (id, title, content) => {
    set((state) => ({
      notes: {
        ...state.notes,
        [id]: {
          ...state.notes[id],
          title,
          content,
          updatedAt: Date.now()
        }
      }
    }));
  },

  deleteNote: (id) => {
    set((state) => {
      const newNotes = { ...state.notes };
      delete newNotes[id];
      return { notes: newNotes };
    });
  },

  resetGame: () => set({
    currentLocationId: null,
    clues: initialClues,
    characters: initialCharacters,
    connections: [],
    dialogueHistory: [],
    caseAnalysis: null,
    notes: {}
  })
}));
