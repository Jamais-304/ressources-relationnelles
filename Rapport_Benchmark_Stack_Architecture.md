
# ADR : Technologies et architecture
*Projet : (Re)Sources Relationnelles*

---

## 1. Introduction

Le choix de la stack technologique et de l'architecture adoptées conditionnent la performance, la pérennité ainsi que les possibilités d'évolution de l'application. Dans la suite du document, nous présenterons deux comparaisons suivant la méthodologie ADR (Architecture Decision Records) afin de comparer les différentes solutions à notre disposition pour le développement de *(Re)Sources Relationnelles*.

1. **Comparatif des piles technologiques** *(front‑end, back‑end, base de données...)* ;  
2. **Comparatif des styles d’architecture**.

Chaque étude s’appuie sur une grille de critères pondérés adaptée au contexte projet. Ensuite, une conclusion globale vérifie la complémentarité entre la stack retenue et l’architecture la plus pertinente, afin de s'assurer de la cohérence globale des choix effectués.

---

## 2. Étude n°1 : Piles technologiques

### 2.1 Critères et pondération

| Critère | Poids | Description |
|---------|------:|----------------------|
| Performance & Scalabilité | 25 % | Latence P95, QPS |
| Maintenabilité & DevEx | 20 % | Lisibilité, tests, tooling |
| Sécurité & Conformité | 15 % | Score OWASP, gestion des identités |
| TCO | 15 % | Coût total de possession |
| Maîtrise de l’équipe | 15 % | Courbe d’apprentissage |
| Communauté & Support | 10 % | GitHUB stars, releases, docs |

<details>
	<summary>
		Description détaillée des critères
	</summary>

- **Latence P95** : elle mesure le temps de réponse en dessous duquel se situent 95% des requêtes effectuées.
- **QPS** : nombre de requêtes par secondes au maximum avant la dégradation du service. (*QPS = queries per second*)
- **Tooling** : définit le confort donné par la stack choisie pour le développement (hot reload, linters, ...) qui vont permettre l'efficacité du développement.
- **OWASP** : score permettant de noter les vulnérabilités de cybersécurité des technologies.
- **Gestion des identités** : gestion des systèmes de login et de la persistance des données, permettant de définir une niveau de conformité avec les lois en vigueur. (*RPGD, conditions d'utilisation, ...*)
- **TOtal Cost Ownership (*TCO*)** : évalue le coût d'infrastructure (machines, serveurs, stockage, trafic...), les licences ainsi que l'effort d'exploitation (monitoring, sauvegardes, CI/CD...) sur la durée de vie prévue.
- **Courbe d'apprentissage** : accessibilité des technologies et maîtrise éventuelle par l'équipe projet selon le temps nécessaire pour atteindre la productivité sur la stack choisie.
- **GitHub Stars** : échelle de popularité liée à l'utilisation sur des repo GitHub. (*Cet indicateur n'est pas le plus objectif, mais il est le plus simple pour permettre une évaluation quantitative de la communauté*)
- **Releases** : fréquence des mises à jour des technologies utilisées
- **Doc** : quantitié de documentation officielle et du nombre d'issues afin de permettre le troubleshooting des problèmes récurrents sur les forums comme *StackOverflow* ou les 
*communautés Discord*.

</details>	



### 2.2 Stacks comparées

| Stack | Front‑end | Back‑end | Base |
|----|-----------|----------|------|
| **A** | Vue 3 + Pinia | Node / Express (TS) | MongoDB |
| **B** | React 18 | Django 4 (Python) | PostgreSQL |
| **C** | Flutter Web | Laravel 10 (PHP) | MySQL |

### 2.3 Résultats

| Stack | Perf | Maint | Sécu | TCO | Maîtrise | Comm. | **Score / 5** |
|-------|------|-------|------|-----|----------|-------|---------------|
| **A** | 4 | 4 | 3 | 4 | 5 | 4 | 4,0 |
| **B** | 4 | 3 | 4 | 3 | 3 | 5 | 3,5 |
| **C** | 3 | 3 | 3 | 3 | 2 | 4 | 3,1 |

**Analyse**  
La solution A, bien qu'elle ne soit pas la plus facile à sécuriser dans le contexte du projet commandité par le ministère, se place en tête grâce à ses solides performances, une adéquation avec les compétences de l'équipe projet et la large utilisation par la communauté. Elle constitue le choix prédominant de stack technologique à adopter pour le développement de (Re)Sources Relationnelles.

---

## 3. Étude n°2 : Architecture

### 3.1 Critères et pondération

| Critère | Poids | Mesure |
|---------|------:|--------|
| Performance & Scalabilité | 25 % | Débit horizontal, tolérance panne |
| Évolutivité (Modularité & Extensibilité) | 25 % | Facilité d'ajout de fonctionnalités, isolation des modules |
| Complexité Opérationnelle | 20 % | Surfaces DevOps, outillage nécessaire |
| Coût / TCO | 15 % | Infra, monitoring, déploiement |
| Sécurité & Gouvernance | 15 % | Surface d’attaque, traçabilité |

<details>
	<summary>
		Description détaillée des critères
	</summary>

- **Débit horizontal** : capacité à augmenter le  nombre d’instances sans effort majeur pour s'adapter au trafic.

- **Tolérance panne** : capacité à poursuivre le service en cas de défaillance d'un des composants. (*par exemple via les stratégies de redondance et de réplication*)

- **Facilité de l'ajout de fonctionnalités** : se mesure en fonction de la capacité à ajouter des fonctionnalités nouvelles sans régression majeure avec l'existant.

- **Isolation de modules** : se mesure en fonction de l'étanchéité des couches (*layers*) et modules, permettant des évolutions indépendantes.

- **Surfaces DevOps** : volume et diversité des éléments à construire, tester, déployer... (*images conteneur, pipelines, secrets, ...*)

- **Outillage nécessaire** : complexité et coût des outils. (*orchestrateur, observabilité distribuée, ...*).

- **Infra / Monitoring / Déploiement** : ressources matérielles ou cloud dont on a besoin pour le projet, coûts de supervision (*logs, ...*) et automatisation du déploiement (*CI/CD*).

- **Surface d’attaque** : nombre de points d’entrée exposés, protocoles et surcouches de protection employés.

- **Traçabilité** : capacité à mener les enquêtes après un incident (*logs corrélés, traces, ...*) et à vérifier la conformité légale à tout moment.

</details>

### 3.2 Evalutation

| Archi | Architecture | Description succincte |
|----|-------|-----------------------|
| **M1** | Monolithique classique | Application unique, déployée dans un seul processus |
| **M2** | Modular Monolith | Un seul déploiement mais découpage interne en modules cohésifs isolés |
| **MS** | Micro‑services | Ensemble de services indépendants communiquant par API et/ou événements |

### 3.3 Résultats

| Archi | Perf | Évolutivité | Complexité Op. | TCO | Sécurité | **Score / 5** |
|-------|------|------------|----------------|-----|----------|---------------|
| M2 | 4 | 5 | 3 | 4 | 4 | 4,2 |
| M1 | 4 | 3 | 4 | 5 | 3 | 3,5 |
| MS | 5 | 5 | 2 | 2 | 4 | 3,4 |

**Analyse**

L'architecture en modular monolith se distingue par un couplage interne faible en raison de l'isolation claire de chaque module. Cela facilite l'évolution et l'éventuelle extraction en services indépendants dans le futur.
Les performances sont celles d'un exécutable local unique sans latence réseau.
Les contraintes relevées, importantes à prendre en compte par l'équipe projet, concernent le DevOps : il faut maintenir une rigueur importante au sein du projet, grâce aux tests, au respect des conventions internes appliquées au projet (*nommage des dossiers, ...*). Il faut également s'assurer que la modularité ne s'atténue pas au cours des évolutions de l'application, par exemple via des interdépendances trop fortes.

---

## 4. Convergence des choix

La stack **Vue / Node / MongoDB** se prête naturellement à un **Modular Monolith** :
- La couche back-end en TS est facile à compartimenter par domaines fonctionnels. 
- La base NoSQL via MongoDB est adaptée à la séparation logique sans multiplier les schémas.
- Les outils de linting, de tests sont unifiés avec ESLint et Jest. De plus, la forte cohérence des types induite par TS permet de réduire les erreurs potentielles.
- Evolutivité : dans le futur, une évolution vers des micro-services est facilitée par ce choix d'architecture, sans aucune refonte du front-end.

---

## 5. Conclusion

La stack choisie appliquée à l'architecture modular monolith offre le meilleur compromis parmi les différentes études réalisées. Elle est également alignée avec les objectifs du projet (Re)Sources Relationnelles et cohérente avec la réalisation d'un projet pour le ministère.
