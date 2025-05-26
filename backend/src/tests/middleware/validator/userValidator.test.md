# Documentation des Tests de Validation Utilisateur

## Aperçu

Cette suite de tests d'intégration vérifie le bon fonctionnement des validateurs de données utilisateur dans la plateforme **(RE)Sources Relationnelles**. Ces tests s'exécutent contre l'endpoint `/api/v1/users/create-user` pour valider que les règles de validation côté serveur fonctionnent correctement et rejettent les données invalides avec les messages d'erreur appropriés.

## Objectif des Tests

Ces tests d'intégration servent à :

- **Vérifier** que les validateurs rejettent les pseudonymes trop courts ou de type incorrect
- **S'assurer** que les mots de passe sont validés selon les critères de sécurité
- **Valider** le format des adresses email
- **Tester** la gestion de multiples erreurs de validation simultanées
- **Garantir** que les utilisateurs de la plateforme relationnelle fournissent des données valides

## Cas de Test

### TC-001 : Validation pseudonyme trop court

- **ID** : VT-001-01
- **Description** : Vérifie que la validation rejette un pseudonyme trop court
- **Entrée** : 
  * Email: "test@test.com"
  * Password: "testtest"
  * Pseudonyme: "test" (< longueur minimale)
- **Sortie Attendue** : 
  * Statut HTTP 400 (Bad Request)
  * Erreur de validation avec message de longueur
  * Référence aux limites min/max du pseudonyme
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-002 : Validation pseudonyme type incorrect

- **ID** : VT-001-02
- **Description** : Vérifie que la validation rejette un pseudonyme qui n'est pas une chaîne
- **Entrée** : 
  * Email: "test@test.com"
  * Password: "testtest"
  * Pseudonyme: 123 (nombre)
- **Sortie Attendue** : 
  * Statut HTTP 400 (Bad Request)
  * Erreurs multiples : type incorrect + longueur
  * Messages spécifiques pour chaque violation
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-003 : Validation mot de passe trop court

- **ID** : VT-001-03
- **Description** : Vérifie que la validation rejette un mot de passe trop court
- **Entrée** : 
  * Email: "test@test.com"
  * Password: "test" (< longueur minimale)
  * Pseudonyme: "testtest"
- **Sortie Attendue** : 
  * Statut HTTP 400 (Bad Request)
  * Erreur de validation avec message de longueur
  * Référence aux limites min/max du mot de passe
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-004 : Validation mot de passe type incorrect

- **ID** : VT-001-04
- **Description** : Vérifie que la validation rejette un mot de passe qui n'est pas une chaîne
- **Entrée** : 
  * Email: "test@test.com"
  * Password: 123 (nombre)
  * Pseudonyme: "testtest"
- **Sortie Attendue** : 
  * Statut HTTP 400 (Bad Request)
  * Erreurs multiples : type incorrect + longueur
  * Messages spécifiques pour chaque violation
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-005 : Validation email invalide

- **ID** : VT-001-05
- **Description** : Vérifie que la validation rejette un email mal formaté
- **Entrée** : 
  * Email: "testtest.com" (sans @)
  * Password: "testtesttest"
  * Pseudonyme: "testtest"
- **Sortie Attendue** : 
  * Statut HTTP 400 (Bad Request)
  * Erreur de validation avec message email invalide
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

### TC-006 : Validation multiple erreurs

- **ID** : VT-001-06
- **Description** : Vérifie que la validation retourne toutes les erreurs pour des données complètement invalides
- **Entrée** : 
  * Email: "testtest.com" (invalide)
  * Password: 123 (type et longueur invalides)
  * Pseudonyme: 122 (type et longueur invalides)
- **Sortie Attendue** : 
  * Statut HTTP 400 (Bad Request)
  * Tableau de 5 erreurs distinctes
  * Messages spécifiques pour chaque champ et violation
- **Statut** : RÉUSSI
- **Date d'Ajout** : 2025-05-26

## Méthodologie

Ces tests utilisent une approche d'intégration avec l'API :

- **Tests avec** `supertest` contre l'application Express complète
- **Envoi de requêtes HTTP POST** réelles à l'endpoint de création
- **Validation des codes de statut HTTP** et de la structure des réponses
- **Vérification des messages d'erreur** exacts retournés par les validateurs

## Points techniques importants

- Import des constantes de validation depuis les configurations
- Utilisation de `request(app).post()` pour simuler les requêtes clients
- Validation de la structure des erreurs avec `toContainEqual()` et `toEqual()`
- Tests des limites de longueur avec les constantes configurées
- Vérification des chemins d'erreur (path) et locations (body)

## Spécificités (RE)Sources Relationnelles

- **Champ pseudonyme** : Identifiant public spécifique à la plateforme relationnelle
- **Contraintes de sécurité** : Validation stricte des mots de passe pour protéger les comptes
- **Expérience utilisateur** : Messages d'erreur clairs pour guider la création de compte
- **Validation complète** : Gestion de multiples erreurs simultanées pour feedback immédiat