# Personal Website

Personal website for igorputina.com built with **Strapi** and **React.js** (all in **TypeScript**).  
Designed to run in **Docker containers**.

## Tech Stack

- **Frontend**: React.js + TypeScript  
- **Backend / CMS**: Strapi (TypeScript)  
- **Deployment**: Dockerized

## Quick Start

```bash
# Production mode (runs in background)
npm start

# Development mode (with hot reload)
npm run dev

# Stop all services
npm stop

# Clean everything (containers, volumes, images)
npm run clean
```

**Important**: Run `npm run clean` when switching between development and production modes to avoid conflicts.

## Available Commands

- **`npm start`** - Start production containers in background
- **`npm run dev`** - Start development containers with hot reload
- **`npm stop`** - Stop all containers (both dev and production)
- **`npm run clean`** - Remove all containers, volumes, and images

## Services

### Strapi (Backend)
- **Port**: 1337 (configurable via `STRAPI_PORT` in `.env`)
- **Database**: SQLite (persisted in `./data` directory)
- **Admin Panel**: http://localhost:1337/admin
- **API**: http://localhost:1337/api

### React Site (Frontend)
- **Port**: 3000 (configurable via `SITE_PORT` in `.env`)
- **URL**: http://localhost:3000

### Data Persistence
- **SQLite database**: Stored in `./data/` directory
- **File uploads**: Stored in `./uploads/` directory

### Environment Variables

All environment variables are managed from the **root `.env`** file:

```bash
# Create your .env from the example
cp .env.example .env
```

This replaces the need for separate `.env` files in `/strapi` directory.

### For Production
- Generate new security keys
- Update `REACT_APP_STRAPI_URL` to your production domain

## Development Notes

- Development mode mounts source code for hot reload
- SQLite database is suitable for development and small production deployments
- The React app proxies API calls to Strapi through nginx in production
