.PHONY: help dev prod stop clean logs build
.DEFAULT_GOAL := help

# Colors for output
CYAN := \033[0;36m
YELLOW := \033[0;33m
GREEN := \033[0;32m
RED := \033[0;31m
NC := \033[0m # No Color

help: ## Show this help message
	@echo "$(CYAN)Personal Website - Docker Management$(NC)"
	@echo ""
	@echo "$(YELLOW)Available commands:$(NC)"
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##/ { printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

dev: ## Start development environment (Strapi + Next.js with hot reload)
	@echo "$(CYAN)Starting development environment...$(NC)"
	@DOCKER_BUILDKIT=1 docker-compose --profile dev up --build -d
	@echo "$(GREEN)✅ Development environment started!$(NC)"
	@echo "$(YELLOW)Frontend:$(NC) http://localhost:3000"
	@echo "$(YELLOW)Strapi Admin:$(NC) http://localhost:1337/admin"
	@echo "$(YELLOW)Strapi API:$(NC) http://localhost:1337/api"

prod: ## Start production environment (optimized builds)
	@echo "$(CYAN)Starting production environment...$(NC)"
	@DOCKER_BUILDKIT=1 docker-compose --profile prod up --build -d
	@echo "$(GREEN)✅ Production environment started!$(NC)"
	@echo "$(YELLOW)Website:$(NC) http://localhost:3000"
	@echo "$(YELLOW)Strapi Admin:$(NC) http://localhost:1337/admin"

stop: ## Stop all containers (both dev and prod)
	@echo "$(CYAN)Stopping all containers...$(NC)"
	@docker-compose --profile dev --profile prod down
	@echo "$(GREEN)✅ All containers stopped!$(NC)"

clean: ## Remove containers, volumes, images, and node_modules (preserves database and media)
	@echo "$(RED)⚠️  This will remove containers, volumes, images, and node_modules!$(NC)"
	@echo "$(YELLOW)Database and media files will be preserved.$(NC)"
	@read -p "Are you sure? (y/N) " confirm && [ "$$confirm" = "y" ] || exit 1
	@echo "$(CYAN)Cleaning up containers and images...$(NC)"
	@docker-compose --profile dev --profile prod down -v --remove-orphans
	@docker system prune -f
	@docker volume prune -f
	@echo "$(CYAN)Removing node_modules directories...$(NC)"
	@rm -rf admin/node_modules
	@rm -rf site/node_modules
	@echo "$(GREEN)✅ Cleaned! Database and media files preserved.$(NC)"

clean-all: ## Remove everything including database and media files
	@echo "$(RED)⚠️  This will remove EVERYTHING including database and media files!$(NC)"
	@echo "$(RED)This action cannot be undone!$(NC)"
	@read -p "Are you sure? (y/N) " confirm && [ "$$confirm" = "y" ] || exit 1
	@echo "$(CYAN)Cleaning up everything...$(NC)"
	@docker-compose --profile dev --profile prod down -v --remove-orphans
	@docker system prune -f
	@docker volume prune -f
	@echo "$(CYAN)Removing node_modules and data directories...$(NC)"
	@rm -rf admin/node_modules
	@rm -rf site/node_modules
	@rm -rf admin/data admin/public/uploads
	@echo "$(GREEN)✅ Everything cleaned including database and media!$(NC)"

logs: ## Show logs from all running containers
	@docker-compose logs -f

logs-dev: ## Show logs from development containers only
	@docker-compose --profile dev logs -f

logs-prod: ## Show logs from production containers only
	@docker-compose --profile prod logs -f

build: ## Build all images without starting containers
	@echo "$(CYAN)Building all Docker images...$(NC)"
	@DOCKER_BUILDKIT=1 docker-compose build
	@echo "$(GREEN)✅ All images built!$(NC)"

build-multiarch: ## Build multi-architecture images (requires docker buildx)
	@echo "$(CYAN)Building multi-architecture Docker images...$(NC)"
	@docker buildx create --use --name multiarch-builder 2>/dev/null || echo "Builder already exists"
	@DOCKER_BUILDKIT=1 docker-compose build --parallel
	@echo "$(GREEN)✅ Multi-architecture images built!$(NC)"


status: ## Show status of all containers
	@echo "$(CYAN)Container Status:$(NC)"
	@docker-compose ps

restart-dev: ## Restart development environment
	@echo "$(CYAN)Restarting development environment...$(NC)"
	@docker-compose --profile dev restart
	@echo "$(GREEN)✅ Development environment restarted!$(NC)"

restart-prod: ## Restart production environment
	@echo "$(CYAN)Restarting production environment...$(NC)"
	@docker-compose --profile prod restart
	@echo "$(GREEN)✅ Production environment restarted!$(NC)"

types: ## Generate TypeScript types from Strapi schemas for Next.js
	@echo "$(CYAN)Generating Strapi TypeScript types...$(NC)"
	@node generate-types.js
	@echo "$(CYAN)Formatting generated types...$(NC)"
	@cd site && npx prettier --write src/strapi.generated.ts
	@echo "$(GREEN)✅ Types generated and formatted at site/src/strapi.generated.ts$(NC)"

setup: ## Initial setup - create .env from example and data directory
	@echo "$(CYAN)Setting up project...$(NC)"
	@if [ ! -f .env ]; then \
		cp .env.example .env && \
		echo "$(GREEN)✅ Created .env file from .env.example$(NC)"; \
		echo "$(YELLOW)⚠️  Please update .env with your actual values!$(NC)"; \
	else \
		echo "$(YELLOW)⚠️  .env file already exists$(NC)"; \
	fi
	@mkdir -p admin/data admin/public/uploads
	@echo "$(GREEN)✅ Created admin/data directory for SQLite database$(NC)"
	@echo "$(GREEN)✅ Created admin/public/uploads directory for uploaded files$(NC)"
	@echo "$(GREEN)✅ Setup complete! Run 'make dev' to start development.$(NC)"