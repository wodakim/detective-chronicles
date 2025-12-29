export type Language = 'fr' | 'en' | 'pl';

export const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.interrogations': 'Interrogatoires',
    'nav.notebook': 'Carnet de Notes',
    'nav.deduction': 'Tableau de Déduction',
    'nav.settings': 'Paramètres',
    
    // Locations
    'loc.loge': 'La Loge d\'Elias',
    'loc.bureau_agent': 'Bureau de l\'Agent Marcus Vane',
    'loc.appartement': 'Appartement d\'Elias',
    'loc.coulisses': 'Coulisses du Club',
    'loc.bureau_directeur': 'Bureau du Directeur',
    'loc.appartement_sarah': 'Appartement de Sarah Jenkins',
    'loc.clinique': 'Clinique du Dr. Aris Thorne',
    
    // Characters
    'char.marcus': 'Marcus Vane',
    'char.sarah': 'Sarah Jenkins',
    'char.aris': 'Dr. Aris Thorne',
    'char.chen': 'Dr. Chen',
    'char.thomas': 'Thomas Mercier',
    'char.veronique': 'Véronique Leclerc',
    'char.isabelle': 'Isabelle Thorne',
    
    // Game
    'game.title': 'L\'ÉCHO SILENCIEUX',
    'game.subtitle': 'Le pianiste Elias Thorne est mort. La police dit suicide. Sa sœur dit meurtre.',
    'game.description': 'Vous avez 24 heures pour trouver la vérité dans les notes discordantes de sa vie.',
    'game.open_file': 'OUVRIR LE DOSSIER',
    'game.back': 'Retour',
    
    // Interrogation
    'interrogation.title': 'INTERROGATOIRES',
    'interrogation.subtitle': 'Testez les alibis des suspects',
    'interrogation.interrogate': 'Interroger',
    'interrogation.question': 'QUESTION',
    'interrogation.response': 'RÉPONSE',
    'interrogation.confirm': 'Confirmer le choix',
    'interrogation.continue': 'Continuer',
    'interrogation.other_questions': 'Autres questions',
    'interrogation.change_suspect': 'Changer de suspect',
    
    // Deduction Board
    'deduction.title': 'TABLEAU DE DÉDUCTION',
    'deduction.subtitle': 'Connectez les indices pour former des hypothèses',
    'deduction.clues': 'INDICES',
    'deduction.suspects': 'SUSPECTS',
    'deduction.connections': 'CONNEXIONS',
    'deduction.mode_link': 'Mode Liaison',
    'deduction.reset': 'Réinitialiser',
    'deduction.conclude': 'Conclure l\'Enquête',
    'deduction.reset_message': 'Tableau réinitialisé. Recommencez votre analyse.',
    
    // Conclusion
    'conclusion.title': 'CONCLUSION DE L\'ENQUÊTE',
    'conclusion.solved': 'AFFAIRE RÉSOLUE',
    'conclusion.culprit': 'Coupable identifié',
    'conclusion.incomplete': 'ENQUÊTE INCOMPLÈTE',
    'conclusion.not_started': 'ENQUÊTE NON COMMENCÉE',
    'conclusion.connections_made': 'Connexions établies',
    'conclusion.correct_connections': 'Connexions correctes',
    'conclusion.restart': 'Recommencer l\'Enquête',
    'conclusion.back_to_game': 'Retour au Jeu',
    
    // Notebook
    'notebook.title': 'CARNET DE NOTES',
    'notebook.subtitle': 'Organisez vos pensées et annotations',
    'notebook.new_note': 'Nouvelle Note',
    'notebook.no_notes': 'Aucune note pour le moment',
    'notebook.title_label': 'TITRE',
    'notebook.content_label': 'CONTENU',
    'notebook.create': 'Créer',
    'notebook.update': 'Mettre à jour',
    'notebook.delete': 'Supprimer',
    'notebook.cancel': 'Annuler',
    'notebook.select_note': 'Sélectionnez une note ou créez-en une nouvelle',
    'notebook.note_created': 'Note créée',
    'notebook.note_updated': 'Note mise à jour',
    'notebook.note_deleted': 'Note supprimée',
    
    // Settings
    'settings.title': 'PARAMÈTRES',
    'settings.language': 'Langue',
    'settings.save_game': 'Sauvegarder la Partie',
    'settings.load_game': 'Charger une Partie',
    'settings.delete_save': 'Supprimer',
    'settings.no_saves': 'Aucune sauvegarde',
    'settings.save_slot': 'Emplacement',
    'settings.save_time': 'Sauvegardé le',
    'settings.confirm_delete': 'Êtes-vous sûr de vouloir supprimer cette sauvegarde ?',
    'settings.game_saved': 'Partie sauvegardée',
    'settings.game_loaded': 'Partie chargée',
    'settings.save_deleted': 'Sauvegarde supprimée',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.interrogations': 'Interrogations',
    'nav.notebook': 'Notebook',
    'nav.deduction': 'Deduction Board',
    'nav.settings': 'Settings',
    
    // Locations
    'loc.loge': 'Elias\'s Dressing Room',
    'loc.bureau_agent': 'Marcus Vane\'s Office',
    'loc.appartement': 'Elias\'s Apartment',
    'loc.coulisses': 'Club Backstage',
    'loc.bureau_directeur': 'Director\'s Office',
    'loc.appartement_sarah': 'Sarah Jenkins\' Apartment',
    'loc.clinique': 'Dr. Aris Thorne\'s Clinic',
    
    // Characters
    'char.marcus': 'Marcus Vane',
    'char.sarah': 'Sarah Jenkins',
    'char.aris': 'Dr. Aris Thorne',
    'char.chen': 'Dr. Chen',
    'char.thomas': 'Thomas Mercier',
    'char.veronique': 'Véronique Leclerc',
    'char.isabelle': 'Isabelle Thorne',
    
    // Game
    'game.title': 'THE SILENT ECHO',
    'game.subtitle': 'Pianist Elias Thorne is dead. Police say suicide. His sister says murder.',
    'game.description': 'You have 24 hours to find the truth in the discordant notes of his life.',
    'game.open_file': 'OPEN FILE',
    'game.back': 'Back',
    
    // Interrogation
    'interrogation.title': 'INTERROGATIONS',
    'interrogation.subtitle': 'Test the suspects\' alibis',
    'interrogation.interrogate': 'Interrogate',
    'interrogation.question': 'QUESTION',
    'interrogation.response': 'RESPONSE',
    'interrogation.confirm': 'Confirm choice',
    'interrogation.continue': 'Continue',
    'interrogation.other_questions': 'Other questions',
    'interrogation.change_suspect': 'Change suspect',
    
    // Deduction Board
    'deduction.title': 'DEDUCTION BOARD',
    'deduction.subtitle': 'Connect clues to form hypotheses',
    'deduction.clues': 'CLUES',
    'deduction.suspects': 'SUSPECTS',
    'deduction.connections': 'CONNECTIONS',
    'deduction.mode_link': 'Link Mode',
    'deduction.reset': 'Reset',
    'deduction.conclude': 'Conclude Investigation',
    'deduction.reset_message': 'Board reset. Start your analysis over.',
    
    // Conclusion
    'conclusion.title': 'INVESTIGATION CONCLUSION',
    'conclusion.solved': 'CASE SOLVED',
    'conclusion.culprit': 'Culprit identified',
    'conclusion.incomplete': 'INCOMPLETE INVESTIGATION',
    'conclusion.not_started': 'INVESTIGATION NOT STARTED',
    'conclusion.connections_made': 'Connections made',
    'conclusion.correct_connections': 'Correct connections',
    'conclusion.restart': 'Restart Investigation',
    'conclusion.back_to_game': 'Back to Game',
    
    // Notebook
    'notebook.title': 'NOTEBOOK',
    'notebook.subtitle': 'Organize your thoughts and annotations',
    'notebook.new_note': 'New Note',
    'notebook.no_notes': 'No notes yet',
    'notebook.title_label': 'TITLE',
    'notebook.content_label': 'CONTENT',
    'notebook.create': 'Create',
    'notebook.update': 'Update',
    'notebook.delete': 'Delete',
    'notebook.cancel': 'Cancel',
    'notebook.select_note': 'Select a note or create a new one',
    'notebook.note_created': 'Note created',
    'notebook.note_updated': 'Note updated',
    'notebook.note_deleted': 'Note deleted',
    
    // Settings
    'settings.title': 'SETTINGS',
    'settings.language': 'Language',
    'settings.save_game': 'Save Game',
    'settings.load_game': 'Load Game',
    'settings.delete_save': 'Delete',
    'settings.no_saves': 'No saves',
    'settings.save_slot': 'Slot',
    'settings.save_time': 'Saved on',
    'settings.confirm_delete': 'Are you sure you want to delete this save?',
    'settings.game_saved': 'Game saved',
    'settings.game_loaded': 'Game loaded',
    'settings.save_deleted': 'Save deleted',
  },
  pl: {
    // Navigation
    'nav.home': 'Strona główna',
    'nav.interrogations': 'Przesłuchania',
    'nav.notebook': 'Notatnik',
    'nav.deduction': 'Tablica Dedukcji',
    'nav.settings': 'Ustawienia',
    
    // Locations
    'loc.loge': 'Garderoba Eliasa',
    'loc.bureau_agent': 'Biuro Marcusa Vane\'a',
    'loc.appartement': 'Mieszkanie Eliasa',
    'loc.coulisses': 'Zaplecze Klubu',
    'loc.bureau_directeur': 'Biuro Dyrektora',
    'loc.appartement_sarah': 'Mieszkanie Sary Jenkins',
    'loc.clinique': 'Klinika Dr. Arisa Thorne\'a',
    
    // Characters
    'char.marcus': 'Marcus Vane',
    'char.sarah': 'Sara Jenkins',
    'char.aris': 'Dr. Aris Thorne',
    'char.chen': 'Dr. Chen',
    'char.thomas': 'Thomas Mercier',
    'char.veronique': 'Véronique Leclerc',
    'char.isabelle': 'Isabelle Thorne',
    
    // Game
    'game.title': 'CICHE ECHO',
    'game.subtitle': 'Pianista Elias Thorne nie żyje. Policja mówi o samobójstwie. Jego siostra mówi o morderстwie.',
    'game.description': 'Masz 24 godziny, aby znaleźć prawdę w dysonansowych nutach jego życia.',
    'game.open_file': 'OTWÓRZ PLIK',
    'game.back': 'Wróć',
    
    // Interrogation
    'interrogation.title': 'PRZESŁUCHANIA',
    'interrogation.subtitle': 'Testuj alibi podejrzanych',
    'interrogation.interrogate': 'Przesłuchaj',
    'interrogation.question': 'PYTANIE',
    'interrogation.response': 'ODPOWIEDŹ',
    'interrogation.confirm': 'Potwierdź wybór',
    'interrogation.continue': 'Kontynuuj',
    'interrogation.other_questions': 'Inne pytania',
    'interrogation.change_suspect': 'Zmień podejrzanego',
    
    // Deduction Board
    'deduction.title': 'TABLICA DEDUKCJI',
    'deduction.subtitle': 'Połącz wskazówki, aby sformułować hipotezy',
    'deduction.clues': 'WSKAZÓWKI',
    'deduction.suspects': 'PODEJRZANI',
    'deduction.connections': 'POŁĄCZENIA',
    'deduction.mode_link': 'Tryb Łączenia',
    'deduction.reset': 'Resetuj',
    'deduction.conclude': 'Zakończ Śledztwo',
    'deduction.reset_message': 'Tablica zresetowana. Zacznij analizę od nowa.',
    
    // Conclusion
    'conclusion.title': 'PODSUMOWANIE ŚLEDZTWA',
    'conclusion.solved': 'SPRAWA ROZWIĄZANA',
    'conclusion.culprit': 'Sprawca zidentyfikowany',
    'conclusion.incomplete': 'NIEKOMPLETNE ŚLEDZTWO',
    'conclusion.not_started': 'ŚLEDZTWO NIEROZPOCZĘTE',
    'conclusion.connections_made': 'Wykonane połączenia',
    'conclusion.correct_connections': 'Poprawne połączenia',
    'conclusion.restart': 'Wznów Śledztwo',
    'conclusion.back_to_game': 'Wróć do Gry',
    
    // Notebook
    'notebook.title': 'NOTATNIK',
    'notebook.subtitle': 'Organizuj swoje myśli i adnotacje',
    'notebook.new_note': 'Nowa Notatka',
    'notebook.no_notes': 'Brak notatek',
    'notebook.title_label': 'TYTUŁ',
    'notebook.content_label': 'TREŚĆ',
    'notebook.create': 'Utwórz',
    'notebook.update': 'Aktualizuj',
    'notebook.delete': 'Usuń',
    'notebook.cancel': 'Anuluj',
    'notebook.select_note': 'Wybierz notatkę lub utwórz nową',
    'notebook.note_created': 'Notatka utworzona',
    'notebook.note_updated': 'Notatka zaktualizowana',
    'notebook.note_deleted': 'Notatka usunięta',
    
    // Settings
    'settings.title': 'USTAWIENIA',
    'settings.language': 'Język',
    'settings.save_game': 'Zapisz Grę',
    'settings.load_game': 'Wczytaj Grę',
    'settings.delete_save': 'Usuń',
    'settings.no_saves': 'Brak zapisów',
    'settings.save_slot': 'Slot',
    'settings.save_time': 'Zapisano',
    'settings.confirm_delete': 'Czy na pewno chcesz usunąć ten zapis?',
    'settings.game_saved': 'Gra zapisana',
    'settings.game_loaded': 'Gra wczytana',
    'settings.save_deleted': 'Zapis usunięty',
  }
};

export const useTranslation = (language: Language) => {
  return (key: string, defaultValue?: string) => {
    return translations[language][key] || defaultValue || key;
  };
};
