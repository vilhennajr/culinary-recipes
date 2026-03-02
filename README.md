# Culinary Recipes

Full-stack application for managing culinary recipes, built with NestJS (backend) and Vue 3 (frontend), fully containerized with Docker.

---

## Como rodar o projeto

**Pré-requisito:** Docker e Docker Compose instalados.

```bash
docker-compose up -d --build
```

Após a inicialização:

| Serviço        | URL                            |
| -------------- | ------------------------------ |
| Frontend       | http://localhost               |
| API REST       | http://localhost:3000          |
| Swagger / Docs | http://localhost:3000/api/docs |

> O Docker Compose sobe os três serviços em ordem: **MySQL → API → Frontend**. A API aguarda o banco estar saudável antes de iniciar, e o frontend aguarda a API antes de servir os assets.

---

## Arquitetura

```
culinary-recipes/
├── backend/        # API REST — NestJS + Prisma + MySQL
├── frontend/web/   # SPA — Vue 3 + TypeScript + Vite
└── docker-compose.yml
```

### Stack

| Camada   | Tecnologia                                 |
| -------- | ------------------------------------------ |
| Banco    | MySQL 8.0 (Docker volume persistente)      |
| Backend  | NestJS 10, Prisma 5, JWT, bcrypt           |
| Frontend | Vue 3.4, TypeScript, Vite 5, TailwindCSS 3 |
| Servidor | nginx 1.27 (proxy `/api` → backend)        |

---

## Funcionalidades entregues

- Autenticação JWT (registro e login)
- CRUD completo de **Usuários**, **Categorias** e **Receitas**
- Paginação, busca e ordenação em todos os recursos
- Soft delete em todas as entidades
- Interface web responsiva com feedback visual (toasts, validações)
- Testes unitários e E2E no backend
- Pipeline de qualidade de código: ESLint + Prettier

---

## Serviços Docker

```
mysql   → porta 3306  (healthcheck: mysqladmin ping)
api     → porta 3000  (healthcheck: GET /health)
frontend → porta 80   (nginx — SPA + proxy /api)
```

Veja os detalhes de cada parte:

- [Backend](./backend/README.md)
- [Frontend](./frontend/web/README.md)

---

## Screenshots

### Login e registro

![Login](./frontend/web/docs/images/login.png)

![Criar conta](./frontend/web/docs/images/login-create-user.png)

### Receitas

![Listagem de receitas](./frontend/web/docs/images/recipes-list.png)

![Criar receita](./frontend/web/docs/images/recipes-create.png)

![Editar receita](./frontend/web/docs/images/recipes-edit.png)

![Visualizar receita](./frontend/web/docs/images/recipes-view.png)

![Imprimir receita](./frontend/web/docs/images/recipes-print.png)

![Excluir receita](./frontend/web/docs/images/recipes-delete.png)

### Categorias

![Listagem de categorias](./frontend/web/docs/images/categories-list.png)

![Criar categoria](./frontend/web/docs/images/categories-create.png)

![Editar categoria](./frontend/web/docs/images/categories-edit.png)

![Excluir categoria](./frontend/web/docs/images/categories-delete.png)

### Usuários

![Listagem de usuários](./frontend/web/docs/images/users-list.png)

![Criar usuário](./frontend/web/docs/images/users-create.png)

![Excluir usuário](./frontend/web/docs/images/users-delete.png)

### API — Swagger UI

![Swagger UI](./backend/docs/images/api-swagger-1.png)

![Swagger UI — detalhes](./backend/docs/images/api-swagger-2.png)

### Cobertura de testes

![Cobertura — Backend](./backend/docs/images/backend-test-coverage.png)

![Cobertura — Frontend](./backend/docs/images/frontend-test-coverage.png)
