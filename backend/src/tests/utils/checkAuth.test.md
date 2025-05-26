# Documentation des Tests d'Authentification et d'Autorisation

## Aperçu

Cette suite de tests unitaires vérifie le bon fonctionnement des mécanismes d'authentification et d'autorisation dans la plateforme **(RE)Sources Relationnelles**. Les tests couvrent la vérification de l'authentification des utilisateurs, la gestion des rôles hiérarchiques et la validation des paramètres utilisateur. Ces tests utilisent des mocks pour isoler les fonctionnalités et garantir des vérifications indépendantes de l'état de la base de données.

## Objectif des Tests

Ces tests unitaires servent à :

- **Vérifier** que les mécanismes d'authentification fonctionnent correctement et rejettent les requêtes non authentifiées
- **Valider** le système de rôles hiérarchiques spécifique à la plateforme relationnelle (*utilisateur, modérateur, administrateur, super-administrateur*)
- **S'assurer** que la vérification des paramètres utilisateur fonctionne de manière robuste
- **Tester** tous les cas d'erreur potentiels pour l'authentification et l'autorisation
- **Garantir** la sécurité du système en validant les contrôles d'accès

## Cas de Test

### TC-001 : Vérification de l'authentification sans req.auth

- **ID** : UT-001-01
- **Description** : Vérifie qu'une erreur est levée si req.auth n'est pas présent dans la requête
- **Entrée** : Objet de requête vide sans propriété auth
- **Sortie Attendue** : Exception "unauthorized"
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-002 : Vérification de l'authentification sans userId

- **ID** : UT-001-02
- **Description** : Vérifie qu'une erreur est levée si req.auth.userId n'est pas présent
- **Entrée** : Requête avec auth mais sans userId
- **Sortie Attendue** : Exception "unauthorized"
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-003 : Authentification réussie

- **ID** : UT-001-03
- **Description** : Vérifie que l'utilisateur est retourné si l'authentification est réussie
- **Entrée** : Requête avec auth.userId valide ("123")
- **Sortie Attendue** : Objet utilisateur correspondant avec _id et name
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-004 : Gestion utilisateur inexistant

- **ID** : UT-001-04
- **Description** : Vérifie que null est retourné si l'utilisateur n'est pas trouvé en base de données
- **Entrée** : ID utilisateur inexistant
- **Sortie Attendue** : null
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-005 : Validation rôle utilisateur standard

- **ID** : UT-002-01
- **Description** : Vérifie que l'index correct est retourné pour le rôle "utilisateur"
- **Entrée** : Rôle "utilisateur"
- **Sortie Attendue** : Index correspondant dans ROLE_HIERARCHY
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-006 : Validation rôle modérateur

- **ID** : UT-002-02
- **Description** : Vérifie que l'index correct est retourné pour le rôle "moderateur"
- **Entrée** : Rôle "moderateur"
- **Sortie Attendue** : Index correspondant dans ROLE_HIERARCHY
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-007 : Validation rôle administrateur

- **ID** : UT-002-03
- **Description** : Vérifie que l'index correct est retourné pour le rôle "administrateur"
- **Entrée** : Rôle "administrateur"
- **Sortie Attendue** : Index correspondant dans ROLE_HIERARCHY
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-008 : Validation rôle super-administrateur

- **ID** : UT-002-04
- **Description** : Vérifie que l'index correct est retourné pour le rôle "super-administrateur"
- **Entrée** : Rôle "super-administrateur"
- **Sortie Attendue** : Index correspondant dans ROLE_HIERARCHY
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-009 : Gestion rôle invalide

- **ID** : UT-002-05
- **Description** : Vérifie qu'une erreur est levée pour un rôle invalide non reconnu par le système
- **Entrée** : Rôle "user-role-test" (invalide)
- **Sortie Attendue** : Exception "invRole"
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-010 : Paramètres utilisateur inexistants

- **ID** : UT-003-01
- **Description** : Vérifie qu'une erreur est levée si les paramètres utilisateur ne sont pas présents en base
- **Entrée** : ID utilisateur inexistant ("22qef5")
- **Sortie Attendue** : Exception "missingInfo"
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-011 : Paramètres utilisateur vides

- **ID** : UT-003-02
- **Description** : Vérifie qu'une erreur est levée si l'ID utilisateur est une chaîne vide
- **Entrée** : Chaîne vide pour l'ID utilisateur
- **Sortie Attendue** : Exception "missingInfo"
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-012 : Récupération index rôle valide

- **ID** : UT-003-03
- **Description** : Vérifie que l'index de rôle correct est retourné pour des paramètres utilisateur valides
- **Entrée** : ID utilisateur valide avec rôle "super-administrateur"
- **Sortie Attendue** : Index correspondant au rôle dans ROLE_HIERARCHY
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

## Méthodologie

Ces tests utilisent une approche isolée avec mocking :

- **Mock du modèle User** pour simuler les interactions avec la base de données
- **Tests des fonctions utilitaires** d'authentification sans dépendances externes
- **Vérification des exceptions** levées pour les cas d'erreur
- **Validation des valeurs de retour** pour les cas de succès
- **Tests de la hiérarchie des rôles** spécifique à la plateforme relationnelle

## Points techniques importants

- Utilisation de `jest.mock()` pour mocker le modèle User
- Import des constantes d'erreur depuis les configurations du gestionnaire d'erreurs
- Test de la hiérarchie des rôles avec `ROLE_HIERARCHY.indexOf()`
- Gestion des cas d'authentification avec l'interface `AuthRequest`
- Vérification des appels de méthodes avec `toHaveBeenCalledWith()`

## Spécificités (RE)Sources Relationnelles

- **Hiérarchie des rôles** : *utilisateur < modérateur < administrateur < super-administrateur*
- **Sécurité renforcée** : Double vérification de l'authentification (auth + userId)
- **Gestion contextuelle** : Messages d'erreur adaptés au domaine des relations sociales
- **Intégrité des données** : Validation stricte des paramètres utilisateur pour la sécurité de la plateforme