# 🌐 IPSSI PATCH — Serveur Web Sécurisé

![Security](https://img.shields.io/badge/Security-Hardening-blue?logo=shield&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js%2FExpress-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/Database-MySQL%208-4479A1?logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-black?logo=jsonwebtokens&logoColor=white)

---

## 🎯 Objectifs du projet

Mettre en place un serveur web sécurisé et maintenable, en appliquant les bonnes pratiques de
conteneurisation, d'authentification et de gestion des données :

- 🔐 Authentification JWT avec mots de passe hashés (bcrypt)
- 🐳 Conteneuriser tous les services avec Docker pour faciliter le déploiement et l'isolation
- 🧱 Séparer clairement les couches de l'application : routes, contrôleurs, services, modèles
- 🗄️ Connexion sécurisée à une base MySQL via un ORM (Sequelize)
- 🛡️ Durcissement HTTP (Helmet, CORS) et secrets externalisés (aucun identifiant en dur dans le code)

---

## 🏗️ Architecture

```
┌─────────────┐      HTTP :3000      ┌──────────────┐      :5000      ┌─────────────┐
│   Frontend  │ ───────────────────► │   Backend    │ ───────────────►│    MySQL    │
│ React (CRA) │                      │ Express + JWT│                 │   (db)      │
│ servi par   │ ◄─────────────────── │  Sequelize   │ ◄───────────────│   :3306     │
│   nginx     │                      └──────────────┘                 └─────────────┘
└─────────────┘
```
*(le frontend appelle le backend via la variable `REACT_APP_API_URL`)*

3 services orchestrés par `docker-compose.yml`, chacun dans son propre conteneur, reliés par un
réseau Docker dédié (`ipssi_network`).

---

## 🧰 Stack technique

**Backend** (`backend/`)
- Express 5, Sequelize (ORM) + `mysql2`
- Authentification : `jsonwebtoken`, `bcryptjs`
- Sécurité HTTP : `helmet`, `cors`
- Config via variables d'environnement : `dotenv`

**Frontend** (`frontend/my-app/`)
- React (Create React App), `axios` pour les appels API
- Servi en production via nginx (voir `frontend/my-app/nginx.conf`)

**Base de données**
- MySQL 8.0, volume Docker persistant (`mysql_data`)

---

## 📚 Structure du projet

```
IPSSI_PATCH/
├── docker-compose.yml
├── .env.example
├── backend/
│   ├── Dockerfile
│   ├── server.js
│   ├── .env.example
│   └── src/
│       ├── app.js
│       ├── config/database.js
│       ├── controllers/        # authController, userController
│       ├── services/           # authService, userService
│       ├── middleware/         # authMiddleware, errorHandler
│       ├── models/             # User (Sequelize)
│       └── routes/             # authRoutes, userRoutes
├── frontend/
│   └── my-app/
│       ├── Dockerfile
│       ├── nginx.conf
│       └── src/
└── README.md
```

---

## 🚀 Mise en place

1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/Anne-LaureS/IPSSI_PATCH.git
   cd IPSSI_PATCH
   ```

2. **Configurer les secrets** (jamais commités — voir `.env.example`) :
   ```bash
   ./setup.sh
   ```
   Demande interactivement `MYSQL_ROOT_PASSWORD` et `JWT_SECRET` (ou en génère si laissé vide),
   et prévient si un volume MySQL existant risque de rendre le nouveau mot de passe inopérant.

3. **Construire et lancer les services** :
   ```bash
   docker compose up -d --build
   ```

4. **Vérifier l'état des services** :
   ```bash
   docker compose ps
   docker compose logs -f backend
   ```

### 🌍 Accès

| Service | URL |
|---|---|
| Frontend (React) | http://localhost:3000 |
| Backend (API) | http://localhost:5000/api |
| MySQL | localhost:3306 |

---

## 🔐 Bonnes pratiques appliquées

- **Aucun secret en dur** : `MYSQL_ROOT_PASSWORD` et `JWT_SECRET` externalisés via `.env` (gitignoré),
  jamais committés en clair.
- **Mots de passe hashés** (`bcryptjs`), jamais stockés en clair en base.
- **En-têtes HTTP durcis** via `helmet`.
- **Isolation des services** : chaque composant (frontend, backend, db) tourne dans son propre
  conteneur, communication limitée au réseau Docker interne.
- **ORM (Sequelize)** pour éviter les injections SQL et centraliser l'accès aux données.
- **Séparation nette des responsabilités** : routes → contrôleurs → services → modèles.
