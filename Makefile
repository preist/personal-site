.PHONY: help dev start stop clean setup restart
.DEFAULT_GOAL := help

# Colors for output
CYAN := \033[0;36m
YELLOW := \033[0;33m
GREEN := \033[0;32m
RED := \033[0;31m
NC := \033[0m # No Color

help: ## Show this help message
	@echo "$(CYAN)Personal Website$(NC)"
	@echo ""
	@echo "$(YELLOW)Available commands:$(NC)"
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##/ { printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

setup: ## Initial setup - create .env and data directories
	@echo "$(CYAN)Setting up project...$(NC)"
	@if [ ! -f .env ]; then \
		cp .env.example .env && \
		echo "$(GREEN)✅ Created .env file from .env.example$(NC)"; \
		echo "$(YELLOW)⚠️  Please update .env with your actual values!$(NC)"; \
	else \
		echo "$(YELLOW)⚠️  .env file already exists$(NC)"; \
	fi
	@mkdir -p admin/data admin/public/uploads
	@echo "$(GREEN)✅ Setup complete! Run 'make dev' to start development.$(NC)"

dev: ## Start development environment with hot reload
	@echo "$(CYAN)Starting development environment...$(NC)"
	@NODE_ENV=development DOCKER_BUILDKIT=1 docker compose up --build -d
	@echo "$(GREEN)✅ Development environment started!$(NC)"
	@echo "$(YELLOW)Frontend:$(NC) http://localhost:3000"
	@echo "$(YELLOW)Strapi Admin:$(NC) http://localhost:1337/admin"

start: ## Start production environment
	@echo "$(CYAN)Starting production environment...$(NC)"
	@NODE_ENV=production DOCKER_BUILDKIT=1 docker compose up --build -d
	@echo "$(GREEN)✅ Production environment started!$(NC)"
	@echo "$(YELLOW)Website:$(NC) http://localhost:3000"
	@echo "$(YELLOW)Strapi Admin:$(NC) http://localhost:1337/admin"

stop: ## Stop all containers
	@echo "$(CYAN)Stopping all containers...$(NC)"
	@docker compose down
	@echo "$(GREEN)✅ All containers stopped!$(NC)"

restart: ## Restart all containers
	@echo "$(CYAN)Restarting containers...$(NC)"
	@docker compose restart
	@echo "$(GREEN)✅ Containers restarted!$(NC)"

clean: ## Remove containers, volumes, and node_modules (preserves database and media)
	@echo "$(RED)⚠️  This will remove containers, volumes, and node_modules!$(NC)"
	@echo "$(YELLOW)Database and media files will be preserved.$(NC)"
	@read -p "Are you sure? (y/N) " confirm && [ "$$confirm" = "y" ] || exit 1
	@echo "$(CYAN)Cleaning up...$(NC)"
	@docker compose down -v --remove-orphans
	@docker system prune -f
	@docker volume prune -f
	@rm -rf admin/node_modules site/node_modules
	@echo "$(GREEN)✅ Cleaned! Database and media files preserved.$(NC)"