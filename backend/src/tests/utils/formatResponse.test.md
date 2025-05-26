# Documentation des Tests de Formatage des Réponses

## Aperçu

Cette suite de tests unitaires vérifie le bon fonctionnement des utilitaires de formatage des réponses dans la plateforme **(RE)Sources Relationnelles**. Les modules `dataResponse` et `errorResponse` sont responsables de la standardisation du format des réponses API, garantissant une cohérence dans la communication entre le serveur et les applications clientes (web et mobile).

## Objectif des Tests

Ces tests unitaires servent à :

- **Vérifier** que les réponses de succès sont correctement formatées avec la structure standardisée
- **S'assurer** que les réponses d'erreur suivent le format attendu par les clients
- **Valider** la gestion de différents types de données (utilisateur, tokens, listes)
- **Tester** la flexibilité du système de formatage pour différents cas d'usage
- **Garantir** la cohérence des interfaces API pour les applications front-end

## Cas de Test

### TC-001 : Réponse avec message uniquement

- **ID** : UT-005-01
- **Description** : Vérifie qu'une réponse avec message seul est correctement formatée
- **Entrée** : Message "Success"
- **Sortie Attendue** : Objet `{ message: "Success", data: undefined }`
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-002 : Réponse avec données utilisateur

- **ID** : UT-005-02
- **Description** : Vérifie qu'une réponse avec données utilisateur est correctement formatée
- **Entrée** : Message "User found" et objet utilisateur avec _id, email, pseudonyme
- **Sortie Attendue** : Objet structuré avec message et données utilisateur encapsulées
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-003 : Réponse avec liste d'utilisateurs

- **ID** : UT-005-03
- **Description** : Vérifie qu'une réponse avec liste d'utilisateurs est correctement formatée
- **Entrée** : Message "Users found" et tableau de deux utilisateurs
- **Sortie Attendue** : Objet structuré avec message et tableau d'utilisateurs
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-004 : Réponse avec tokens d'authentification

- **ID** : UT-005-04
- **Description** : Vérifie qu'une réponse avec tokens est correctement formatée
- **Entrée** : Message "Tokens found" et objet TokensInterface (accessToken, refreshToken)
- **Sortie Attendue** : Objet structuré avec message et données tokens
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-005 : Réponse d'erreur

- **ID** : UT-005-05
- **Description** : Vérifie qu'une réponse d'erreur est correctement formatée
- **Entrée** : Message d'erreur "Error occurred"
- **Sortie Attendue** : Objet avec propriété error contenant le message
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-006 : Réponse complexe avec utilisateur et tokens

- **ID** : UT-005-06
- **Description** : Vérifie qu'une réponse complexe avec utilisateur et tokens est correctement formatée
- **Entrée** : Message, objet utilisateur (John Doe) et tokens d'authentification
- **Sortie Attendue** : Objet structuré avec message et données combinées (user + tokens)
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

## Méthodologie

Ces tests utilisent une approche de validation de structure :

- **Tests unitaires purs** sans mocking ni dépendances externes
- **Validation de la structure exacte** des objets de réponse
- **Tests de différents scénarios** de données pour couvrir tous les cas d'usage
- **Vérification de la cohérence** du format entre les types de réponses

## Points techniques importants

- Import de l'interface `TokensInterface` pour le typage strict des tokens
- Utilisation du champ `pseudonyme` spécifique à la plateforme relationnelle
- Tests de formatage pour différents types de contenu (simple, complexe, erreur)
- Validation de l'encapsulation des données dans la propriété `data`

## Spécificités (RE)Sources Relationnelles

- **Champ pseudonyme** : Identifiant public spécifique à la plateforme relationnelle
- **Gestion des tokens** : Support des tokens d'accès et de rafraîchissement
- **Flexibilité** : Support de réponses simples et complexes pour différents endpoints
- **Standardisation** : Format cohérent pour toutes les API de la plateforme