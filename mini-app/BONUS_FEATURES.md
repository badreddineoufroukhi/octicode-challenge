# Fonctionnalités Bonus - Étape 5

Ce document décrit les fonctionnalités bonus implémentées pour l'Octicode Challenge 3.

## 1. Logger avec Request ID

### Implémentation
- **Fichier**: `src/middleware/logger.ts`
- **Fonctionnalités**:
  - Génération automatique d'un UUID unique pour chaque requête
  - Logging des requêtes entrantes (méthode, path, query, body)
  - Logging des réponses (status code, durée d'exécution)
  - Ajout du Request ID dans les headers de réponse (`X-Request-ID`)

### Exemple de logs
```
[8f7a3b2c-1d4e-4f5a-9b8c-7d6e5f4a3b2c] 2025-11-05T10:30:45.123Z GET /api/patients
[8f7a3b2c-1d4e-4f5a-9b8c-7d6e5f4a3b2c] Query: {}
[8f7a3b2c-1d4e-4f5a-9b8c-7d6e5f4a3b2c] Body: {}
[8f7a3b2c-1d4e-4f5a-9b8c-7d6e5f4a3b2c] 200 OK - 45ms
```

## 2. Endpoint /health

### Implémentation
- **Route**: `GET /health`
- **Description**: Endpoint de santé pour vérifier le statut de l'API
- **Pas de rate limiting**: Ce endpoint ne nécessite pas d'API key

### Réponse
```json
{
  "status": "ok",
  "timestamp": "2025-11-05T10:30:45.123Z",
  "uptime": 3600.45,
  "environment": "development"
}
```

## 3. Rate Limiter par API Key

### Implémentation
- **Fichier**: `src/middleware/rateLimiter.ts`
- **Configuration**:
  - Limite: 100 requêtes par minute
  - Fenêtre: 60 secondes
  - Par API key (header `X-API-Key`)

### Utilisation
Ajoutez le header `X-API-Key` à toutes vos requêtes:
```bash
curl -H "X-API-Key: votre-cle-api" http://localhost:3000/api/patients
```

### Headers de réponse
- `X-RateLimit-Limit`: Nombre maximum de requêtes
- `X-RateLimit-Remaining`: Nombre de requêtes restantes
- `X-RateLimit-Reset`: Date de réinitialisation du compteur

### Erreur 429 (Rate Limit Exceeded)
```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Limit is 100 requests per minute",
  "resetTime": "2025-11-05T10:31:00.000Z"
}
```

### Erreur 401 (API Key manquante)
```json
{
  "error": "API key required",
  "message": "Please provide an API key in the X-API-Key header"
}
```

## 4. Documentation Swagger

### Implémentation
- **Fichier de configuration**: `src/config/swagger.ts`
- **URL**: http://localhost:3000/api-docs
- **Annotations**: Tous les endpoints sont documentés avec des annotations JSDoc

### Fonctionnalités Swagger
- Documentation interactive de tous les endpoints
- Schémas de données pour Patient, Note et Summary
- Exemples de requêtes et réponses
- Test direct des endpoints depuis l'interface
- Support de l'authentification par API key

### Endpoints documentés
- **System**: `/`, `/health`
- **Patients**: CRUD complet avec `/api/patients`
- **Notes**: CRUD complet avec `/api/notes`
- **Summaries**: CRUD complet avec `/api/summaries`

### Comment utiliser Swagger
1. Démarrez le serveur: `npm run dev`
2. Ouvrez votre navigateur: http://localhost:3000/api-docs
3. Cliquez sur "Authorize" et entrez votre API key
4. Testez les endpoints directement depuis l'interface

## Démarrage du serveur

```bash
# Installation des dépendances
npm install

# Mode développement
npm run dev

# Build production
npm run build
npm start
```

## Endpoints disponibles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Page d'accueil avec liste des endpoints |
| GET | `/health` | Endpoint de santé (pas d'API key requise) |
| GET | `/api-docs` | Documentation Swagger interactive |
| GET | `/api/patients` | Liste tous les patients |
| POST | `/api/patients` | Crée un nouveau patient |
| GET | `/api/patients/:id` | Récupère un patient par ID |
| PUT | `/api/patients/:id` | Met à jour un patient |
| DELETE | `/api/patients/:id` | Supprime un patient |
| GET | `/api/notes` | Liste toutes les notes |
| POST | `/api/notes` | Crée une nouvelle note |
| GET | `/api/notes/:id` | Récupère une note par ID |
| PUT | `/api/notes/:id` | Met à jour une note |
| DELETE | `/api/notes/:id` | Supprime une note |
| GET | `/api/summaries` | Liste tous les résumés |
| POST | `/api/summaries` | Crée un nouveau résumé |
| GET | `/api/summaries/:id` | Récupère un résumé par ID |
| PUT | `/api/summaries/:id` | Met à jour un résumé |
| DELETE | `/api/summaries/:id` | Supprime un résumé |

## Exemple d'utilisation avec curl

```bash
# Vérifier le statut de l'API
curl http://localhost:3000/health

# Créer un patient
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: demo-api-key" \
  -d '{
    "name": "John Doe",
    "dob": "1990-01-15",
    "gender": "M",
    "contact": "john.doe@email.com"
  }' \
  http://localhost:3000/api/patients

# Récupérer tous les patients
curl -H "X-API-Key: demo-api-key" http://localhost:3000/api/patients
```

## Dépendances ajoutées

- `uuid`: Pour la génération de Request IDs uniques
- `swagger-ui-express`: Pour l'interface Swagger
- `swagger-jsdoc`: Pour générer la documentation Swagger depuis les annotations JSDoc
- `@types/swagger-ui-express`: Types TypeScript pour Swagger UI
- `@types/swagger-jsdoc`: Types TypeScript pour Swagger JSDoc

## Architecture

```
src/
├── middleware/
│   ├── logger.ts           # Middleware de logging avec Request ID
│   └── rateLimiter.ts      # Middleware de rate limiting
├── config/
│   └── swagger.ts          # Configuration Swagger
├── routes/
│   ├── patients.ts         # Routes patients (avec annotations Swagger)
│   ├── notes.ts           # Routes notes (avec annotations Swagger)
│   └── summaries.ts       # Routes summaries (avec annotations Swagger)
├── models/
│   ├── database.ts        # Configuration SQLite
│   ├── schemas.ts         # Schémas de validation Zod
│   ├── patientService.ts  # Service patients
│   ├── noteService.ts     # Service notes
│   └── summaryService.ts  # Service summaries
├── app.ts                 # Configuration Express
└── index.ts               # Point d'entrée
```

## Sécurité

- Validation des données avec Zod
- Rate limiting par API key
- Headers de sécurité (Request ID)
- Logging complet des requêtes pour l'audit

## Notes techniques

- Le rate limiter stocke les informations en mémoire (utiliser Redis en production)
- Les API keys ne sont pas stockées en base de données (à implémenter en production)
- Le logger utilise console.log (utiliser un logger professionnel comme Winston en production)
- Nettoyage automatique des entrées expirées du rate limiter
