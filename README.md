# ZoneVacances

ZoneVacances est une application Next.js + TypeScript prête pour Vercel qui affiche :

- les prochains compteurs de vacances scolaires pour les zones A, B et C
- une carte interactive de la France métropolitaine colorée par zone scolaire
- les prochaines vacances scolaires des communautés belges
- les 3 prochains jours fériés en France avec compte à rebours temps réel

## Lancer le projet

```bash
npm install
npm run dev
```

Application disponible ensuite sur `http://localhost:3000`.

## Déploiement Vercel

Le projet est autonome et ne nécessite aucune variable d'environnement.

```bash
npm run build
```

Puis importez simplement le dépôt dans Vercel.

## Source de données

- `OpenHolidays API` pour les vacances scolaires France/Belgique et les jours fériés France

## Stack

- Next.js 16
- React 19
- TypeScript
- Luxon pour la gestion fiable des dates et fuseaux horaires
