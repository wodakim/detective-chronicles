#!/usr/bin/env python3
"""
Script pour générer les clés de traduction manquantes dans translations.ts
"""

# Mapping des clés existantes vers les nouvelles clés
clue_mappings = {
    'c1': 'Seringue trouvée près du corps',
    'c2': 'Morphine détectée dans le sang',
    'c3': 'Marques d\'injection au bras gauche',
    'c4': 'Elias était gaucher',
    'c5': 'Injection au mauvais bras (contradiction)',
    'c8': 'Reçu d\'achat du champagne',
    'c11': 'Contrat de rupture de contrat',
    'c12': 'Marcus Vane était l\'agent',
    'c14': 'Lettre signée par Sarah Jenkins',
    'c21': 'Piqûre d\'assurance',
    'c23': 'Billet d\'avion trouvé',
    'c30': 'Témoin du changement',
}

# Descriptions détaillées pour chaque clue
clue_descriptions = {
    'c1': 'Une seringue médicale vide trouvée à proximité du corps d\'Elias. Elle contient des traces de morphine.',
    'c2': 'Le rapport toxicologique révèle une concentration élevée de morphine dans le sang de la victime.',
    'c3': 'Des marques d\'injection récentes sont visibles sur le bras gauche d\'Elias.',
    'c4': 'Selon les témoignages et les observations, Elias Thorne était gaucher de naissance.',
    'c5': 'L\'injection a été faite au bras gauche, ce qui est inhabituel pour un gaucher qui se serait auto-administré une substance.',
    'c8': 'Un reçu d\'achat d\'une bouteille de champagne rare datant du soir du décès.',
    'c11': 'Un document officiel de rupture de contrat entre Elias et son agent Marcus Vane.',
    'c12': 'Marcus Vane était l\'agent artistique d\'Elias depuis 5 ans et gérait sa carrière.',
    'c14': 'Une lettre d\'amour déchirée, signée par Sarah Jenkins, l\'ex-compagne d\'Elias.',
    'c21': 'Enregistrement vidéo de surveillance montrant des mouvements suspects le soir du décès.',
    'c23': 'Un billet d\'avion pour l\'Italie au nom d\'Elias, prévu pour la semaine suivant son décès.',
    'c30': 'Témoignage du notaire concernant une modification récente du testament d\'Elias.',
}

# Contenu des documents
clue_contents = {
    'c2': 'Rapport toxicologique : Concentration de morphine : 450 mg/L (dose létale). Heure estimée de l\'injection : 22h30.',
    'c8': 'Reçu Cave Prestige - Champagne Dom Pérignon 1996 - 450€ - Payé en espèces - 20h15',
}

# Générer les traductions pour le français
print("// Traductions françaises à ajouter :\n")
for clue_id, title in clue_mappings.items():
    print(f"    'clue.{clue_id}.title': '{title}',")
    if clue_id in clue_descriptions:
        print(f"    'clue.{clue_id}.desc': '{clue_descriptions[clue_id]}',")
    if clue_id in clue_contents:
        print(f"    'clue.{clue_id}.content': '{clue_contents[clue_id]}',")
    print()

# Locations
print("\n// Locations :")
locations = {
    'loc1': {
        'name': 'La Loge d\'Elias',
        'desc': 'La loge privée où Elias a été retrouvé mort. Une pièce élégante avec un piano à queue et des souvenirs de sa carrière.'
    },
    'loc2': {
        'name': 'Bureau de l\'Agent Marcus Vane',
        'desc': 'Le bureau professionnel de Marcus Vane, agent artistique. Des contrats et documents financiers sont éparpillés.'
    },
    'loc3': {
        'name': 'Appartement d\'Elias',
        'desc': 'L\'appartement personnel d\'Elias Thorne, révélant des aspects intimes de sa vie.'
    },
    'loc4': {
        'name': 'Coulisses du Club',
        'desc': 'Les coulisses du club de jazz où Elias se produisait régulièrement.'
    },
    'loc5': {
        'name': 'Bureau du Directeur',
        'desc': 'Le bureau du directeur du club, contenant des archives et des enregistrements de surveillance.'
    },
    'loc6': {
        'name': 'Appartement de Sarah Jenkins',
        'desc': 'L\'appartement de Sarah Jenkins, l\'ex-compagne d\'Elias.'
    },
    'loc7': {
        'name': 'Clinique du Dr. Aris Thorne',
        'desc': 'La clinique privée du Dr. Aris Thorne, frère d\'Elias et médecin.'
    }
}

for loc_id, loc_data in locations.items():
    print(f"    'loc.{loc_id}.name': '{loc_data['name']}',")
    print(f"    'loc.{loc_id}.desc': '{loc_data['desc']}',")
    print()
