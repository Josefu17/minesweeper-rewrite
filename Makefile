.PHONY: help pre-commit format lint-frontend test-backend test-frontend start stop start-db start-backend start-frontend

help:
	@echo "Available commands:"
	@echo "  make pre-commit    - Run all checks (backend tests, frontend format, frontend tests)"
	@echo "  make format        - Run frontend Prettier (lightweight)"
	@echo "  make lint-frontend - Run frontend ESLint"
	@echo "  make start         - Start all Docker containers (detached)"
	@echo "  make stop          - Stop all Docker containers"
	@echo "  make start-db      - Start just the DB container"
	@echo "  make start-backend - Run Spring Boot locally (with env vars)"
	@echo "  make start-frontend- Run Angular serve"

# Quality Checks

pre-commit: test-backend format lint-frontend test-frontend
	@echo "\n✅ All pre-commit checks passed!"

format:
	@echo "\n🎨 Running Prettier on Frontend..."
	cd frontend && npm run format

lint-frontend:
	@echo "\n🔍 Running ESLint on Frontend..."
	cd frontend && npm run lint

test-backend:
	@echo "\n🐘 Running Backend Tests..."
	cd backend && ./gradlew test

test-frontend:
	@echo "\n🅰️ Running Frontend Tests..."
	cd frontend && npm run test -- --watch=false --browsers=chromium

# Docker Control

start:
	docker compose up -d

stop:
	docker compose down

start-db:
	docker compose up -d db

# Local Development

start-backend:
	@echo "\n🐘 Starting Spring Boot..."
	cd backend && \
	. ./src/main/kotlin/minesweeper/infrastructure/localdev/.setenv && \
	./gradlew bootRun

start-frontend:
	@echo "\n🅰️ Starting Angular..."
	cd frontend && npm start
