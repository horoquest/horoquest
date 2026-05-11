# CLAUDE.md — Horoquest

## Projet
Quiz horloger bilingue (FR/EN) sur l'univers des montres. 19 collections thématiques, score enregistré anonymement, page de résultat avec moyenne et suggestion du quiz suivant.

Public cible : grand public, professionnels de l'horlogerie, apprenants.

## Stack
- **Frontend** : Vanilla JS, HTML/CSS statiques (pas de build tool, pas de framework)
- **Base de données** : Supabase (PostgreSQL + auth + REST API)
- **Hébergement** : Vercel (horoquest.vercel.app)
- **Repos** : GitHub public
  - App : https://github.com/horoquest/horoquest
  - Admin : https://github.com/horoquest/horoquest-admin

## Structure des fichiers
```
app/
├── index.html              ← Landing page FR (collections, hero, how it works)
├── app.html                ← Ancienne app React (conservée, non liée)
├── fr/
│   ├── collections/index.html  ← Page collection dynamique (?slug=xxx)
│   └── jeu/index.html          ← Quiz dynamique (?slug=xxx)
├── en/
│   ├── index.html              ← Landing page EN
│   ├── collections/index.html  ← Collection page EN
│   └── jeu/index.html          ← Quiz page EN
├── assets/
│   ├── styles.css              ← CSS partagé (toutes les pages)
│   └── placeholders.js         ← Charge les images des thèmes depuis Supabase
├── sw.js                   ← Service Worker (PWA offline)
├── manifest.json
└── icon-*.png / icon.svg
```

## Architecture
Site multi-pages en Vanilla JS, sans build tool. Chaque page charge ses données depuis l'API REST de Supabase. Les pages collection et quiz sont dynamiques via query string (`?slug=xxx`). Joshua n'est pas développeur — privilégier la simplicité.

## Routing
- `/` → Landing FR
- `/en/` → Landing EN
- `/fr/collections/?slug=rolex` → Page collection FR
- `/en/collections/?slug=rolex` → Page collection EN
- `/fr/jeu/?slug=rolex` → Quiz FR
- `/en/jeu/?slug=rolex` → Quiz EN

Le toggle FR/EN dans le header redirige vers la page équivalente dans l'autre langue.

## Base de données (Supabase)
Tables principales : `questions`, `answers`, `categories`, `profiles`, `scores`, `duels`, `themes`, `events`

URL du projet : `https://bqnawfnkukcbqkujsskr.supabase.co`

Colonnes clés :
- `questions` : `text`, `text_en`, `explanation`, `explanation_en`, `image_url`, `theme_slugs` (array), `difficulty`
- `themes` : `name`, `name_en`, `description`, `description_en`, `slug`, `filter_value`, `image_url`, `sort_order`
- `scores` : `correct_count`, `total_questions`, `theme_slug`, `mode`, `score`, `user_id` (nullable)

## Scores
Les scores sont enregistrés anonymement (sans inscription) dans la table `scores` via une RLS policy `anon INSERT`. Chaque quiz terminé enregistre `correct_count`, `total_questions`, `theme_slug`. La moyenne est calculée à l'affichage du résultat à partir des vraies données.

## Admin
URL : https://horoquest-admin.vercel.app
Accès protégé par email (`joshua.grillet@proton.me`).

⚠️ **Attention** : le repo GitHub est public, donc la clé anon Supabase est visible. Ce n'est pas critique (c'est une clé anon avec RLS), mais à surveiller. Ne jamais mettre de clé `service_role` dans le code.

## Règles de travail
- **Ne jamais faire d'action irréversible sans confirmation** (suppression, push, migration DB destructive)
- Expliquer le code seulement si demandé — ne pas surcharger
- Préférer modifier des fichiers existants plutôt que d'en créer de nouveaux
- Garder le code lisible (pas de minification manuelle)
- Le service worker (`sw.js`) est sensible — le modifier avec précaution

## Déploiement
Push sur GitHub → Vercel déploie automatiquement. Pas de CI/CD supplémentaire.
