# Documentation des Tests de Génération de Tokens

## Aperçu

Cette suite de tests unitaires vérifie le bon fonctionnement du système de génération de tokens JWT dans la plateforme **(RE)Sources Relationnelles**. Les fonctions `generateAccesToken` et `generateRefreshToken` sont essentielles pour l'authentification et la sécurité du système, gérant respectivement les tokens d'accès (15 minutes) et les tokens de rafraîchissement (7 jours).

## Objectif des Tests

Ces tests unitaires servent à :

- **Vérifier** que les tokens d'accès JWT sont correctement générés avec les bonnes durées de vie
- **S'assurer** que les tokens de rafraîchissement sont générés et stockés en base de données
- **Valider** la gestion des erreurs lors de l'absence de clé secrète
- **Tester** la robustesse du système d'authentification par tokens
- **Garantir** la sécurité des mécanismes de génération de tokens

## Cas de Test

### TC-001 : Génération token d'accès

- **ID** : UT-006-01
- **Description** : Vérifie qu'un token d'accès JWT est correctement généré
- **Entrée** : Objet utilisateur avec _id ("123"), pseudonyme ("toto") et rôle ("utilisateur")
- **Sortie Attendue** : 
  * Token JWT signé avec la clé secrète
  * Durée de vie de 15 minutes
  * Payload contenant userId et role
- **Vérifications Spécifiques** :
  * Appel de `jwt.sign()` avec les bons paramètres
  * Token retourné correspondant au mock
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-002 : Génération token d'accès sans clé secrète

- **ID** : UT-006-02
- **Description** : Vérifie qu'une erreur est levée si la clé secrète TOKEN_SECRET n'est pas définie
- **Entrée** : Utilisateur valide mais TOKEN_SECRET undefined
- **Sortie Attendue** : Exception "Missing secret key"
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-003 : Génération token de rafraîchissement

- **ID** : UT-006-03
- **Description** : Vérifie qu'un token de rafraîchissement est généré et stocké en base de données
- **Entrée** : Objet utilisateur avec _id, pseudonyme et rôle
- **Sortie Attendue** : 
  * Token JWT signé avec durée de vie de 7 jours
  * Enregistrement en base via RefreshToken.create()
  * Retour du token généré
- **Vérifications Spécifiques** :
  * Appel de `jwt.sign()` avec expiration 7d
  * Appel de `RefreshToken.create()` avec token et userId
  * Token retourné correspondant au mock
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-004 : Génération token de rafraîchissement sans clé secrète

- **ID** : UT-006-04
- **Description** : Vérifie qu'une erreur est levée si la clé secrète n'est pas définie pour le refresh token
- **Entrée** : Utilisateur valide mais TOKEN_SECRET undefined
- **Sortie Attendue** : Exception "Missing secret key"
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

## Méthodologie

Ces tests utilisent une approche de mocking des dépendances :

- **Mock de la bibliothèque** `jsonwebtoken` pour contrôler la génération de tokens
- **Mock du modèle** `RefreshToken` pour simuler les opérations de base de données
- **Tests unitaires isolés** sans appels réseau ni base de données réelle
- **Gestion des variables d'environnement** (TOKEN_SECRET) dans les tests
- **Vérification des appels** de fonctions avec les bons paramètres

## Points techniques importants

- Utilisation de `jest.clearAllMocks()` avant chaque test pour l'isolation
- Manipulation des variables d'environnement avec `delete process.env.TOKEN_SECRET`
- Mock de `jwt.sign()` avec retour de valeur contrôlée
- Interface `IUserToken` pour le typage des objets utilisateur
- Gestion des erreurs asynchrones avec try/catch dans les tests

## Spécificités (RE)Sources Relationnelles

- **Durées de vie** : 15 minutes pour l'accès, 7 jours pour le rafraîchissement
- **Payload JWT** : Contient userId et role pour l'autorisation
- **Champ pseudonyme** : Inclus dans l'objet utilisateur de test
- **Sécurité renforcée** : Validation obligatoire de la clé secrète
- **Persistance** : Tokens de rafraîchissement stockés en base pour révocation