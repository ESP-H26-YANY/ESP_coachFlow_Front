# CoachFlow Front-End

## Présentation
CoachFlow Front-End est l'interface utilisateur de la plateforme web de coaching sportif. Développée en React avec TypeScript et Vite. 

Le projet met l'accent sur un design moderne (grâce à Tailwind CSS et Flowbite React), une gestion d'état centralisée pour l'authentification, et un routage dynamique basé sur les rôles.

## Fonctionnalités Principales
* **Authentification centralisée :** Connexion et inscription avec gestion sécurisée du JWT (via `AuthContext` et `localStorage`).
* **Routage protégé (`RoleRoute`) :** Redirection automatique et sécurisation des pages selon le rôle de l'utilisateur (`coach` ou `user`).
* **Espace Coach :** * Tableau de bord personnalisé.
  * Formulaire de publication de guides avec upload de fichiers (PDF) via `FormData`.
  * Gestion (affichage et suppression) des guides publiés.
* **Espace Élève :**
  * Tableau de bord pour consulter et télécharger les guides.
  * Gestion de la bibliothèque personnelle.
* **UI/UX :** Composants pré-stylisés avec Flowbite React (Modales, Badges, Spinners, formulaires) compatibles avec un thème sombre natif.

## Technologies Utilisées
* **Framework :** React 19
* **Build Tool :** Vite
* **Langage :** TypeScript
* **Styling :** Tailwind CSS v4 & Flowbite React
* **Routage :** React Router DOM v7
* **Appels API :** Fetch API (encapsulé dans `src/services/api.ts` avec gestion des credentials)

## Architecture du Projet
```text
ESP_coachFlow_Front/
├── public/                
├── src/
│   ├── components/         # Composants réutilisables (Navbars, Footers, Layouts, RoleRoute)
│   ├── context/            # Contextes globaux (AuthContext pour l'état utilisateur)
│   ├── pages/              # Vues principales de l'application
│   │   ├── coach/          # Vues spécifiques aux coachs (Dashboard, Guide, etc.)
│   │   └── user/           # Vues spécifiques aux élèves
│   ├── services/           # Logique de communication avec l'API (api.ts)
│   ├── types/              # Définitions des types et interfaces TypeScript (guide.ts, auth.ts)
│   ├── App.tsx             # Configuration principale des routes
│   └── main.tsx            # Point d'entrée React et initialisation du thème
├── .env                    # Variables d'environnement (URL de l'API)
├── tailwind.config.js      # Configuration de Tailwind CSS
└── vite.config.ts          # Configuration du bundler Vite
```

## Installation des dépendances système
Prérequis et lancement en local
Pour faire tourner ce projet sur votre machine, vous avez besoin de :

Node.js (version 18 ou supérieure)

L'API CoachFlow en cours d'exécution.

- installation des dépendances

```bash
npm install
```

- configuration de l'environnement
Créez un fichier .env à la racine du projet et ajoutez l'URL de votre API locale :
```
VITE_API_URL=https://localhost:5144/api
```
- lancer le projet 
```bash
npm run dev
```

## Auteur : **Yany Boudedja**