# Documentation des Tests de Normalisation

## Aperçu

Cette suite de tests unitaires vérifie le bon fonctionnement de la fonction de normalisation dans la plateforme **(RE)Sources Relationnelles**. La fonction `normalize` est responsable de la conversion et validation des valeurs de port pour la configuration serveur, garantissant que les ports utilisés sont valides et dans les plages acceptables.

## Objectif des Tests

Ces tests unitaires servent à :

- **Vérifier** que les ports numériques valides sont correctement convertis depuis des chaînes
- **S'assurer** que les entrées non numériques sont gérées appropriément
- **Valider** le rejet des valeurs de port invalides (≤ 0)
- **Tester** la robustesse de la normalisation des paramètres de configuration
- **Garantir** la stabilité du serveur lors du démarrage

## Cas de Test

### TC-001 : Normalisation port valide

- **ID** : UT-007-01
- **Description** : Vérifie qu'un port numérique valide est correctement converti depuis une chaîne
- **Entrée** : Chaîne "4550"
- **Sortie Attendue** : Nombre 4550
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-002 : Normalisation entrée non numérique

- **ID** : UT-007-02
- **Description** : Vérifie qu'une entrée non numérique est retournée inchangée
- **Entrée** : Chaîne "abc"
- **Sortie Attendue** : Chaîne "abc" inchangée
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-003 : Normalisation valeur négative ou nulle

- **ID** : UT-007-03
- **Description** : Vérifie qu'une erreur est levée pour les valeurs de port ≤ 0
- **Entrée** : Chaîne "-1"
- **Sortie Attendue** : Exception "Value cannot be ≤ to 0: -1"
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

## Méthodologie

Ces tests utilisent une approche de validation directe :

- **Tests unitaires purs** sans dépendances externes
- **Validation des types** de retour (nombre vs chaîne)
- **Tests des cas limites** et des cas d'erreur
- **Vérification des messages d'erreur** spécifiques

## Points techniques importants

- Import direct de la fonction `normalize` depuis les utilitaires
- Tests de conversion de type (string vers number)
- Gestion des erreurs avec `toThrowError()` pour les valeurs invalides
- Validation des valeurs de retour exactes avec `toBe()`

## Spécificités (RE)Sources Relationnelles

- **Configuration serveur** : Validation des ports pour le déploiement de la plateforme
- **Robustesse** : Gestion des erreurs pour éviter les plantages serveur
- **Sécurité** : Validation des plages de ports acceptables
- **Déploiement** : Support de configuration via variables d'environnement