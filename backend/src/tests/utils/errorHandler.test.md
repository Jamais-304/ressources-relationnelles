# Documentation des Tests de Gestion d'Erreurs

## Aperçu

Cette suite de tests unitaires vérifie le bon fonctionnement du gestionnaire d'erreurs centralisé de la plateforme **(RE)Sources Relationnelles**. Le module errorHandler est responsable de la gestion uniforme des erreurs système et de la formatage approprié des réponses d'erreur pour les clients de l'API. Ces tests garantissent que les erreurs sont correctement traitées et renvoyées avec les codes de statut HTTP appropriés.

## Objectif des Tests

Ces tests unitaires servent à :

- **Vérifier** que le gestionnaire d'erreurs traite correctement les erreurs système inconnues
- **S'assurer** que les réponses d'erreur sont formatées de manière cohérente
- **Valider** que les codes de statut HTTP appropriés sont retournés
- **Tester** la robustesse du système de gestion d'erreurs centralisé
- **Garantir** une expérience utilisateur cohérente lors des erreurs

## Cas de Test

### TC-001 : Gestion erreur serveur générique

- **ID** : UT-004-01
- **Description** : Vérifie que le gestionnaire d'erreurs retourne un statut 500 pour les types d'erreur inconnus
- **Entrée** : Erreur de type serverError (erreur système générique)
- **Sortie Attendue** : 
  * Statut HTTP 500 (Internal Server Error)
  * Réponse JSON avec structure d'erreur standardisée
  * Message d'erreur serveur générique
- **Vérifications Spécifiques** :
  * Appel de `res.status(500)`
  * Appel de `res.json()` avec format d'erreur correct
  * Présence du message d'erreur configuré
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

## Méthodologie

Ces tests utilisent une approche de mocking des objets Express :

- **Mock de l'objet Response** d'Express avec `jest.fn().mockReturnThis()`
- **Test unitaire isolé** du gestionnaire d'erreurs sans dépendances
- **Vérification des appels** de méthodes et de leurs paramètres
- **Validation de la structure** de réponse JSON

## Points techniques importants

- Utilisation de `mockReturnThis()` pour chaîner les appels de méthodes Express
- Import des constantes d'erreur depuis les configurations du gestionnaire d'erreurs
- Test de la gestion d'erreurs centralisée pour maintenir la cohérence
- Vérification de la structure de réponse d'erreur standardisée

## Spécificités (RE)Sources Relationnelles

- **Messages contextuels** : Erreurs adaptées au domaine des relations sociales
- **Gestion centralisée** : Point unique de gestion d'erreurs pour toute la plateforme
- **Format standardisé** : Structure de réponse cohérente pour l'interface utilisateur
- **Sécurité** : Messages d'erreur génériques pour éviter la fuite d'informations sensibles