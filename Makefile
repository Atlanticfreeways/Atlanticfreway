.PHONY: help install dev build test clean docker-up docker-down

help:
	@echo "Flight Scanner - Available Commands"
	@echo "===================================="
	@echo "make install       - Install dependencies for both backend and frontend"
	@echo "make dev           - Start development servers (requires local setup)"
	@echo "make build         - Build both backend and frontend"
	@echo "make test          - Run tests for both backend and frontend"
	@echo "make clean         - Clean build artifacts and node_modules"
	@echo "make docker-up     - Start services with Docker Compose"
	@echo "make docker-down   - Stop Docker Compose services"
	@echo "make docker-logs   - View Docker Compose logs"

install:
	cd backend && npm install
	cd frontend && npm install

dev:
	@echo "Starting development servers..."
	@echo "Backend: http://localhost:5000"
	@echo "Frontend: http://localhost:5173"
	@echo "Run in separate terminals:"
	@echo "  Terminal 1: cd backend && npm run dev"
	@echo "  Terminal 2: cd frontend && npm run dev"

build:
	cd backend && npm run build
	cd frontend && npm run build

test:
	cd backend && npm test
	cd frontend && npm run test:run

clean:
	rm -rf backend/dist backend/node_modules
	rm -rf frontend/dist frontend/node_modules
	rm -rf node_modules

docker-up:
	docker-compose up

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

docker-build:
	docker-compose build

.DEFAULT_GOAL := help
