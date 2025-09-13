# Personal Website

Personal website for igorputina.com built with **Strapi** and **Next.js** (all in **TypeScript**).
Designed to run in **Docker containers** with simple **Make** commands.

## Tech Stack

- **Frontend**: Next.js 15.5.3 + TypeScript + Turbopack
- **Backend / CMS**: Strapi 5.23.4 + TypeScript
- **Database**: SQLite (development-friendly, production-ready)
- **Deployment**: Dockerized with nginx optimization
- **Process Management**: Make + Docker Compose

## Quick Start

```bash
# Initial setup (run once)
make setup

# Development mode (with hot reload)
make dev

# Production mode (optimized builds)
make prod

# Stop all services
make stop

# Clean everything (containers, volumes, images)
make clean
```

**Important**: Run `make clean` when switching between development and production modes to avoid conflicts.

## Available Commands

Run `make help` to see all available commands:

### Development & Production
- **`make setup`** - Initial project setup (creates .env and required directories)
- **`make dev`** - Start development environment with hot reload (dependencies installed in container)
- **`make prod`** - Start production environment with optimized builds (built in container)
- **`make stop`** - Stop all containers (both dev and prod)

### Building & Dependencies
- **`make build`** - Build all Docker images without starting containers
- **`make build-multiarch`** - Build multi-architecture Docker images (requires docker buildx)

### Maintenance & Cleanup
- **`make clean`** - Remove containers, volumes, images, and node_modules (preserves database and media)
- **`make clean-all`** - Remove everything including database and media files
- **`make restart-dev`** - Restart development environment
- **`make restart-prod`** - Restart production environment

### Monitoring & Debugging
- **`make logs`** - Show logs from all running containers
- **`make logs-dev`** - Show logs from development containers only
- **`make logs-prod`** - Show logs from production containers only
- **`make status`** - Show status of all containers

## Services

### Strapi Backend (CMS)
- **Port**: 1337 (configurable via `STRAPI_PORT` in `.env`)
- **Database**: SQLite (persisted in `./data/` directory)
- **Admin Panel**: http://localhost:1337/admin
- **API**: http://localhost:1337/api

### Next.js Frontend
- **Development Port**: 3000 (configurable via `SITE_PORT` in `.env`)
- **Production**: Served through nginx with optimizations
- **URL**: http://localhost:3000

### Production Optimizations
- **nginx**: Static file caching, gzip compression, security headers
- **Next.js**: Standalone output for minimal container size
- **Multi-stage builds**: Optimized Docker images for production

## Configuration

### Environment Variables

All configuration is managed from the **root `.env`** file:

```bash
# Create your .env from the example
cp .env.example .env
```

Key variables to configure:
- **`STRAPI_PORT`** - Strapi backend port (default: 1337)
- **`SITE_PORT`** - Frontend port (default: 3000)
- **`NEXT_PUBLIC_STRAPI_URL`** - Strapi API URL for frontend
- **Strapi Security Keys** - Generate secure keys for production

### Data Persistence
- **SQLite database**: Automatically stored in `./admin/data/` directory
- **File uploads**: Stored in `./admin/public/uploads/` directory (auto-created)
- **Volume mounts**: Development mode mounts source code for hot reload
- **Data safety**: `make clean` preserves database and media files

## Development vs Production

### Development Mode (`make dev`)
- **Container-based deps**: Dependencies installed inside Docker container during build
- **Hot reload**: Source code changes trigger automatic rebuilds
- **Volume mounts**: Code changes reflect immediately in containers
- **Debug mode**: Full development tools and verbose logging
- **Direct access**: No nginx proxy, direct Next.js dev server

### Production Mode (`make prod`)
- **Container-based build**: Dependencies installed and apps built inside Docker containers
- **Optimized builds**: Minified, tree-shaken, compressed assets
- **nginx proxy**: Static file caching, gzip, security headers
- **Minimal containers**: Multi-stage builds for smaller image sizes
- **Performance**: Optimized for speed and resource usage

## Project Structure

```
/
├── admin/              # Strapi backend (TypeScript)
│   ├── Dockerfile      # Multi-stage Strapi container
│   └── package.json    # Strapi dependencies
├── site/               # Next.js frontend (TypeScript)
│   ├── Dockerfile      # Multi-stage Next.js container
│   ├── next.config.ts  # Next.js configuration
│   └── package.json    # Next.js dependencies
├── admin/data/         # SQLite database storage
├── admin/public/uploads/ # Media file uploads
├── docker-compose.yml  # Container orchestration
├── nginx.conf         # Production nginx configuration
├── Makefile           # Development commands
├── .env.example       # Environment template
└── README.md          # This file
```

## Security Notes

### For Production Deployment:
1. **Generate secure keys**: Use `openssl rand -base64 32` for all secrets
2. **Update environment**: Set production URLs and secure values
3. **Database**: Consider PostgreSQL for high-traffic production
4. **SSL/TLS**: Configure https with proper certificates
5. **Firewall**: Restrict access to necessary ports only

### Development Security:
- Default keys are provided for development convenience
- Never commit real secrets to version control
- The `.env` file is git-ignored for security

## Troubleshooting

### Common Issues:
- **Port conflicts**: Change `STRAPI_PORT` or `SITE_PORT` in `.env`
- **Permission issues**: Ensure Docker has file system access
- **Database locks**: Run `make clean` to reset everything
- **Build failures**: Check Docker disk space and memory

### Getting Help:
```bash
# Check container status
make status

# View logs for debugging
make logs

# Clean slate restart (preserves data)
make clean && make dev

# Complete reset (removes everything)
make clean-all && make setup && make dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with both `make dev` and `make prod`
5. Submit a pull request

---

Built with ❤️ using Docker, Make, Strapi, and Next.js