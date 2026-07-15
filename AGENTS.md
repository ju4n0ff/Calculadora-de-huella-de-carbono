# AGENTS.md — Calculadora de Huella de Carbono

Full-stack monorepo: `backend/` (Spring Boot 4.0.6 + Java 21, Maven) + `frontend/` (React 19 + Vite 6, npm). Deployed: backend on Render (Docker), frontend on Vercel.

## Commands

| Action | Command |
|--------|---------|
| Backend build | `.\backend\mvnw.cmd clean package` |
| Backend test (all) | `.\backend\mvnw.cmd test` |
| Backend test (single) | `.\backend\mvnw.cmd test -Dtest=ClienteServiceTest` |
| Backend dev | `.\backend\mvnw.cmd spring-boot:run` (port 8080, needs env vars set) |
| Frontend install | `cd frontend && npm install` |
| Frontend dev | `cd frontend && npm run dev` (port 5173, proxies `/api` → 8080) |
| Frontend build | `cd frontend && npm run build` |

No lint, format, or typecheck. 6 JUnit test files (5 service tests + 1 context load). Frontend has no tests.

## Architecture

- **Two UIs**: React SPA (`frontend/`) is primary. Legacy HTML in `backend/src/main/resources/static/` (`index.html`, `login.html`, `admin.html`, `cliente.html`, `calculadora.html`) routed via `MvcConfig`, `AuthController`, `HomeController`, `PerfilController`. Old pages are vanilla JS + Chart.js CDN, independent of the React app.
- **No react-router**: `App.jsx` conditionally renders `<Login />`, `<AdminDashboard />`, or `<ClientDashboard />`. Dashboards use state-based `activePanel` tab switching.
- **API prefix**: All REST endpoints at `/api/`. Controllers use `@RequestMapping("/api/...")`.
- **Auth**: Custom auth in `localStorage` as `usuarioSesion` (`AuthContext.jsx`). No JWT/cookies. Client login via `GET /api/clientes/{idCliente}` (numeric code, NOT DNI). Admin login via `POST /api/administradores/login` with bcrypt `passwordEncoder.matches()`. `SecurityConfig` disables all Spring Security filters (`.permitAll()`), only exposes `BCryptPasswordEncoder` bean.
- **Data model note**: `Administrador` is the only entity without Lombok (manual getters/setters). `Cliente.idTarifa` is `Integer`, not a `@ManyToOne` relationship.
- **Error handling**: `GlobalExceptionHandler` → `ApiError` JSON. `ResourceNotFoundException` → 404, `IllegalArgumentException` → 400, `RuntimeException` → 500.
- **Password hashing**: `DataInitializer` (a `CommandLineRunner`) auto-hashes plaintext admin passwords from the `administrador` table on every startup via `BCryptPasswordEncoder`. Checks for existing `$2a$`/`$2b$` prefix to avoid double-hashing.
- **CORS**: `CorsConfig.java` allows `localhost:5173` and `localhost:8080`, `/api/**` only. Production (Vercel → Render) relies on Vercel rewrites, not CORS.
- **API layer**: `frontend/src/api/http.js` exports `apiGet`, `apiPost`, `apiPut`, `apiDelete` using raw `fetch()`. Services in `frontend/src/api/services/`, re-exported from `frontend/src/api/index.js`.
- **Database**: PostgreSQL (Render PostgreSQL or Supabase). JPA `ddl-auto=update`. Credentials injected via env vars (`DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`). Thymeleaf excluded.
- **Seed data**: `data-postgres.sql` runs automatically on startup via `spring.sql.init.mode=always` + `defer-datasource-initialization=true`. Uses `ON CONFLICT DO NOTHING` to be safe on restarts. DataInitializer hashes admin passwords after the seed runs.
- **Lombok**: All entities use `@Data` or `@Getter/@Setter`, except `Administrador`.

## Deployment

- **Backend** (Render, Docker): `backend/Dockerfile` builds with Maven + Temurin 21. Web Service uses root `backend/`, runtime Docker. Env vars: `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`. Port set by Render via `$PORT`.
- **Frontend** (Vercel): root `frontend/`, build auto-configures from `frontend/vercel.json`. API calls proxied via Vercel rewrites: `/api/*` → Render backend URL. No env vars needed.
- **Render PostgreSQL**: Create via Render Dashboard → New + → PostgreSQL. Internal hostname resolves within Render network. Free tier expires after 90 days.
- **Render idle sleep**: Free web services sleep after 15 min idle. First request after idle takes ~30s. Use UptimeRobot or similar to keep alive before demos.
- **vercel.json** path: `frontend/vercel.json`. Must contain the Render backend URL in the `rewrites` destination field.

## Gotchas

- Admin login POST body must be `{"usuario": "...", "clave": "..."}`. Client login is GET `/api/clientes/{idCliente}` — the `id` is the numeric primary key (e.g. 41206), NOT the DNI string.
- `spring.jpa.open-in-view` is enabled by default (warning in logs). Not a problem for this app.
- Render free PostgreSQL expires after 90 days. Set up backups or migrate before expiry.
- Backend `.gitignore` has `aplication.properties` (typo) — `application.properties` is NOT ignored as intended.
- If `Port already in use: 54075` on restart, add `spring.jmx.enabled=false` or kill lingering Java processes.
- `ReporteService` (Apache POI Excel export) class exists but has no REST endpoint exposing it.
