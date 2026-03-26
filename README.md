# InfluenceHub

InfluenceHub is a creator operating hub for fan communities.

The product combines:

- creator-owned fan rooms
- modular room features such as events, goods, membership, and live chat
- multi-platform content publishing
- automatic fan-room notices after publishing

## Core Concept

Each creator signs up first, opens a room, and turns on only the features they need.

Examples:

- community only
- community + events
- community + goods
- community + YouTube upload + CHZZK upload

## MVP Scope

The first milestone is intentionally narrow:

- social login entry for creators
- creator room creation
- room feature toggle UI
- community home and auto-notice preview
- Spring Boot backend skeleton
- MySQL-ready domain model baseline

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Java 11 + Spring Boot 2.7 + Spring Data JPA
- Database: MySQL

## Frontend

```bash
npm install
npm run dev
```

## Backend

```bash
cd backend
gradle bootRun
```

Environment example:

```bash
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/influencehub
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=secret
```

## Initial Domain Modules

- auth
- user
- room
- feature
- community
- content
- publish

## Next Build Steps

1. OAuth2 social login
2. room creation API
3. room feature management API
4. post/comment API
5. publish job API
