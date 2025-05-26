# Documentation des Tests des Contrôleurs Utilisateur

## Aperçu

Cette suite de tests d'intégration vérifie le bon fonctionnement des contrôleurs utilisateur dans la plateforme **(RE)Sources Relationnelles**. Les tests couvrent l'ensemble du cycle de vie des utilisateurs : création de compte, authentification, déconnexion, et opérations d'administration. Ces tests utilisent des mocks stratégiques pour isoler la logique métier tout en validant les interactions avec les composants système.

## Objectif des Tests

Ces tests d'intégration servent à :

- **Vérifier** que les utilisateurs peuvent créer des comptes et s'authentifier sur la plateforme
- **Valider** le système de gestion des tokens (accès et rafraîchissement)
- **S'assurer** que les opérations d'administration fonctionnent avec les bonnes autorisations
- **Tester** la gestion des erreurs pour les cas d'authentification échoués
- **Garantir** la sécurité et l'intégrité des opérations utilisateur

## Cas de Test

### TC-001 : Création d'utilisateur standard

- **ID** : FT-001-01
- **Description** : Vérifie qu'un nouvel utilisateur peut être créé avec succès
- **Entrée** : 
  * Email: "test@test.com"
  * Password: "testtest?A123NN"
  * Pseudonyme: "usertest"
  * Role: "utilisateur"
- **Sortie Attendue** : 
  * Statut HTTP 201 (Created)
  * Tokens d'accès et de rafraîchissement valides
  * Données utilisateur avec pseudonyme et rôle
  * Message de succès de création
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-002 : Connexion utilisateur valide

- **ID** : FT-001-02
- **Description** : Vérifie qu'un utilisateur peut se connecter avec des identifiants valides
- **Entrée** : 
  * Email: "test@test.com"
  * Password: "Test!test1R?"
- **Sortie Attendue** : 
  * Statut HTTP 200 (OK)
  * Tokens d'accès et de rafraîchissement
  * Appel de bcrypt.compare pour vérification mot de passe
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-003 : Connexion utilisateur inexistant

- **ID** : FT-001-03
- **Description** : Vérifie qu'une erreur est retournée si l'utilisateur n'existe pas
- **Entrée** : 
  * Email: "error@test.com" (inexistant)
  * Password: "errorError1E!"
- **Sortie Attendue** : 
  * Statut HTTP 401 (Unauthorized)
  * Message "Incorrect username/password pair!"
  * Appel de User.findOne avec l'email fourni
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-004 : Connexion mot de passe incorrect

- **ID** : FT-001-04
- **Description** : Vérifie qu'une erreur est retournée pour un mot de passe incorrect
- **Entrée** : 
  * Email valide existant
  * Mot de passe incorrect
- **Sortie Attendue** : 
  * Statut HTTP 401 (Unauthorized)
  * Message "Incorrect username/password pair!"
  * bcrypt.compare retourne false
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-005 : Déconnexion utilisateur

- **ID** : FT-001-05
- **Description** : Vérifie qu'un utilisateur peut se déconnecter avec succès
- **Entrée** : Token de rafraîchissement valide existant en base
- **Sortie Attendue** : 
  * Statut HTTP 200 (OK)
  * Message de succès de déconnexion
  * Suppression du token de la base de données
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-006 : Déconnexion token inexistant

- **ID** : FT-001-06
- **Description** : Vérifie que la déconnexion fonctionne même avec un token inexistant
- **Entrée** : Token de rafraîchissement "non-existent-token"
- **Sortie Attendue** : 
  * Statut HTTP 200 (OK)
  * Message de succès de déconnexion
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-007 : Déconnexion sans token

- **ID** : FT-001-07
- **Description** : Vérifie qu'une erreur est retournée si aucun token n'est fourni
- **Entrée** : Requête de déconnexion sans refreshToken
- **Sortie Attendue** : 
  * Statut HTTP 400 (Bad Request)
  * Erreur de validation sur le champ refreshToken
  * Message "Refresh token must be a string"
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-008 : Création utilisateur par administrateur

- **ID** : FT-001-08
- **Description** : Vérifie qu'un administrateur peut créer un utilisateur
- **Entrée** : 
  * Token administrateur valide
  * Données utilisateur standard
- **Sortie Attendue** : 
  * Statut HTTP 201 (Created)
  * Message de création réussie
  * Vérification des autorisations admin
  * Appel de bcrypt.hash pour le mot de passe
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

## Méthodologie

Ces tests utilisent une approche d'intégration avec mocking stratégique :

- **Tests avec** `supertest` contre l'application Express complète
- **Mocking de bcrypt** pour contrôler les comparaisons de mots de passe
- **Mocking des modèles** User et RefreshToken pour simuler la base de données
- **Mocking des utilitaires** de génération de tokens
- **Middleware d'authentification** mocké pour les tests d'autorisation
- **Utilisation de** `beforeEach()` pour configurer les mocks

## Points techniques importants

- Configuration des mocks avec `jest.Mock` et valeurs de retour contrôlées
- Tests de persistance réelle avec mongoose pour les tokens de rafraîchissement
- Vérification des appels de méthodes avec `toHaveBeenCalledWith()`
- Validation de la structure des réponses JSON
- Gestion des cas d'erreur avec codes HTTP appropriés

## Spécificités (RE)Sources Relationnelles

- **Champ pseudonyme** : Utilisé comme identifiant public sur la plateforme
- **Système de rôles** : Validation des autorisations pour les opérations admin
- **Sécurité renforcée** : Double système de tokens pour l'authentification
- **Messages contextuels** : Erreurs adaptées au domaine des relations sociales
- **Gestion complète** : Cycle de vie complet des utilisateurs de la plateforme