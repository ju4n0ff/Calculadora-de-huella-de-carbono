# AGENTS.md — Calculadora de Huella de Carbono

Full-stack monorepo: `backend/` (Spring Boot 4.0.6 + Java 21, Maven) + `frontend/` (React 19 + Vite 6, npm).

## Commands

| Action | Command |
|--------|---------|
| Backend build | `.\backend\mvnw.cmd clean package` |
| Backend test (all) | `.\backend\mvnw.cmd test` |
| Backend test (single) | `.\backend\mvnw.cmd test -Dtest=ClienteServiceTest` |
| Backend dev | `.\backend\mvnw.cmd spring-boot:run` (port 8080) |
| Frontend install | `cd frontend && npm install` |
| Frontend dev | `cd frontend && npm run dev` (port 5173, proxies `/api` → 8080) |
| Frontend build | `cd frontend && npm run build` |

No lint, format, or typecheck on either side. 6 JUnit test files (5 service tests + 1 context load). Frontend has no test framework.

## Architecture

- **Two UIs**: React SPA (`frontend/`) is primary. Legacy HTML in `backend/src/main/resources/static/` (`index.html`, `login.html`, `admin.html`, `cliente.html`, `calculadora.html`) routed via `MvcConfig`, `AuthController`, `HomeController`, `PerfilController`. Old pages do NOT use the React app.
- **No react-router**: `App.jsx` conditionally renders `<Login />`, `<AdminDashboard />`, or `<ClientDashboard />`. Dashboards use state-based `activePanel` tab switching.
- **API prefix**: All REST endpoints at `/api/`. Controllers use `@RequestMapping("/api/...")`.
- **Auth**: Custom auth in `localStorage` as `usuarioSesion` (`AuthContext.jsx`). No JWT/cookies. Client login via `GET /api/clientes/{id}`. Admin login via `POST /api/administradores/login` with bcrypt `passwordEncoder.matches()`. No Spring Security filter chain (all `.permitAll()`, only `BCryptPasswordEncoder` exposed).
- **Data model quirks**: `Cliente.tarifa` is `@ManyToOne Tarifa` (not `idTarifa` Integer). `Consumo.detalles` is `TEXT` JSON `[{id, nombre, watts}]`. `Administrador` is the only entity without Lombok (manual getters/setters).
- **Error handling**: `GlobalExceptionHandler` → `ApiError` JSON. `ResourceNotFoundException` → 404, `IllegalArgumentException` → 400, `RuntimeException` → 500.
- **CORS**: `CorsConfig.java` allows `localhost:5173` and `localhost:8080`, `/api/**` only.
- **Password hashing**: `DataInitializer` auto-hashes plaintext admin passwords from `seed.sql` on startup via `BCryptPasswordEncoder`.
- **State**: React Context only (no Redux/Zustand). `Login`, `AdminDashboard`, `ClientDashboard` are `React.lazy()` loaded.
- **API layer**: Plain `fetch()` via `frontend/src/api/http.js` (`apiGet`, `apiPost`, `apiPut`, `apiDelete`). Services in `frontend/src/api/services/`, re-exported from `frontend/src/api/index.js`.
- **Database**: MySQL 8, JPA `ddl-auto=update`, Thymeleaf excluded. Credentials: root/root, db: luz_sur_simulador.
- **Gotchas**: `ReporteService` (Apache POI Excel export) exists but has no REST endpoint. Backend `.gitignore` has `aplication.properties` (typo) — `application.properties` is NOT ignored as intended. If `Port already in use: 54075` on restart, add `spring.jmx.enabled=false` or kill lingering Java processes.
- **Lombok** throughout backend entities (`@Data` or `@Getter/@Setter`), except `Administrador`.
