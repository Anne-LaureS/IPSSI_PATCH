<img src="https://upload.wikimedia.org/wikipedia/commons/3/32/Server-icon.svg" alt="Web Server Logo" width="60" align="left">

# 🌐 Serveur Web — IPSSI PATCH

![Security](https://img.shields.io/badge/Security-Hardening-blue?logo=shield&logoColor=white)
![NGINX](https://img.shields.io/badge/Web%20Server-NGINX-009639?logo=nginx&logoColor=white)
![Patch](https://img.shields.io/badge/Patch-Applied-brightgreen?logo=git&logoColor=white)

---

## 🎯 Objectifs du projet :
Ce projet vise à mettre en place un serveur web sécurisé et maintenable, en appliquant les bonnes pratiques de conteneurisation et de gestion des données.
- Mettre à jour et sécuriser le serveur web.
- Conteneuriser tous les services avec Docker pour faciliter le déploiement et l’isolation.
- Séparer clairement les couches de l’application : services et contrôleurs.
- Mettre en place une connexion sécurisée au serveur SQL.
- Utiliser un ORM (Object-Relational Mapping) pour gérer les interactions avec la base de données de manière sécurisée et efficace.

---

## Technologies utilisées :
- Docker & Docker Compose
- Serveur web (Node.js)
- Base de données SQL
- ORM (Sequelize)
- Bonnes pratiques de sécurité : SSL/TLS, gestion des utilisateurs, isolation des services

---

## Mise en place :

1. Cloner le dépôt :
https://github.com/ademjemaa/IPSSI_PATCH

3. Construire les conteneurs Docker :
   docker-compose build

4. Lancer les services :
   docker-compose up -d

5. Vérifier la connexion sécurisée à la base de données et l’état des services

---

## Structure du projet

```
/projet-secure-server

├── docker-compose.yml
├── services/
│   └── ...
├── controllers/
│   └── ...
├── config/
│   └── database.js
└── README.md
```

--- 

## 🔐 Bonnes pratiques

- Isolation des services via Docker.
- Connexion sécurisée au serveur SQL.
- Utilisation d’un ORM pour éviter les injections SQL et simplifier les requêtes.
- Séparation nette des responsabilités entre contrôleurs et services.
