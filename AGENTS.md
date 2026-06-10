# AGENTS.md — Calculadora de Huella de Carbono

Full-stack monorepo with two independent sub-projects in a single repo.

## Structure

- `backend/` — Spring Boot 4.0.6 + Java 21, Maven (wrapper: `backend\mvnw.cmd`)
- `frontend/` — React 19 + Vite 6, npm

## Developer commands

| Action | Command |
|--------|---------|
| Backend build | `.\backend\mvnw.cmd clean package` |
| Backend test | `.\backend\mvnw.cmd test` |
| Backend dev server | `.\backend\mvnw.cmd spring-boot:run` (port 8080) |
| Frontend install | `cd frontend && npm install` |
| Frontend dev | `cd frontend && npm run dev` (port 5173, proxies `/api` → 8080) |
| Frontend build | `cd frontend && npm run build` |

No linting, formatting, or typechecking is configured on either side.

## Testing

- **Backend**: JUnit 5 via `.\backend\mvnw.cmd test`. Only one test exists (`CalculadoraApplicationTests` — context loads).
- **Frontend**: No test framework installed.

## Architecture notes

- **Two separate UIs coexist**: backend serves both a React SPA (`frontend/`) AND server-rendered static HTML (`backend/src/main/resources/static/`). The React app is the newer UI.
- **API prefix**: All REST routes are under `/api/`. Backend controllers map to `@RestController @RequestMapping("/api/...")`.
- **Auth**: Purely local in `localStorage` as `usuarioSesion`. No JWT, no cookies. Client login by ID via `GET /api/clientes/{id}`. Admin uses `findByUsuarioAndClave()` — passwords in plaintext.
- **CORS**: Every controller has `@CrossOrigin(origins = "*")`.
- **Database**: MySQL 8, JPA `ddl-auto=update`. Thymeleaf is explicitly excluded — raw HTML from `static/`.
- **State management**: React Context (`AuthContext`) only. No Redux/Zustand.
- **API layer**: Plain `fetch()` (no Axios). All services in `frontend/src/api/services/`, re-exported from `frontend/src/api/index.js`.
- **Lazy loading**: `Login`, `AdminDashboard`, `ClientDashboard` use `React.lazy()` + `Suspense`.
- **Lombok** used throughout backend entities (mix of `@Data` and explicit `@Getter/@Setter`).

## Key dependencies

| Layer | Notable |
|-------|---------|
| Backend | Spring Boot 4.0.6, Spring Data JPA, MySQL Connector, Lombok, Jakarta Validation |
| Frontend | React 19, react-chartjs-2 + chart.js 4, Vite 6 |
