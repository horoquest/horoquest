# CLAUDE.md — Horoquest

## Projet
Quiz horloger PWA avec une logique dopaminergique : défi quotidien, streaks, duels entre amis, classements. Objectif = faire revenir l'utilisateur souvent.

Public cible : grand public, professionnels de l'horlogerie, apprenants.

## Stack
- **Frontend** : Vanilla JS + React 18 (CDN, pas de build tool). Tout le code de l'app est dans un seul `index.html`.
- **Base de données** : Supabase (PostgreSQL + auth + REST API)
- **Hébergement** : Vercel
- **Repos** : GitHub public
  - App : https://github.com/horoquest/horoquest
  - Admin : https://github.com/horoquest/horoquest-admin

## Structure des fichiers
```
Horoquest/
├── app/
│   ├── index.html       ← Toute l'app (React inline, ~1500 lignes)
│   ├── sw.js            ← Service Worker (PWA offline)
│   ├── manifest.json
│   └── icon-*.png / icon.svg
├── admin/
│   └── index.html       ← Interface de gestion des questions (même stack)
└── questions_backup.json ← Backup local des 63 questions actives (ne pas commit)
```

## Architecture
L'app est volontairement monolithique (tout dans `index.html`) pour éviter tout build tool. Joshua n'est pas développeur — privilégier la simplicité et l'efficacité sur l'élégance technique.

## Base de données (Supabase)
Tables principales : `questions`, `answers`, `categories`, `profiles`, `scores`, `duels`, `themes`, `events`

URL du projet : `https://bqnawfnkukcbqkujsskr.supabase.co`

## Admin
URL : https://horoquest-admin.vercel.app
Accès protégé par email (`joshua.grillet@proton.me`).

⚠️ **Attention** : le repo GitHub est public, donc la clé anon Supabase est visible. Ce n'est pas critique (c'est une clé anon avec RLS), mais à surveiller. Ne jamais mettre de clé `service_role` dans le code.

## Offline / Fallback
`FALLBACK_QS` dans `app/index.html` contient les 63 questions actives en dur. Mis à jour manuellement depuis Supabase quand nécessaire. Backup complet : `questions_backup.json`.

## Règles de travail
- **Ne jamais faire d'action irréversible sans confirmation** (suppression, push, migration DB destructive)
- Expliquer le code seulement si demandé — ne pas surcharger
- Préférer modifier des fichiers existants plutôt que d'en créer de nouveaux
- Garder le code lisible (pas de minification manuelle)
- Le service worker (`sw.js`) est sensible — le modifier avec précaution

## Déploiement
Push sur GitHub → Vercel déploie automatiquement. Pas de CI/CD supplémentaire.
