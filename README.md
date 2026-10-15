# ELRICS Patient Management Portal

A lightweight patient-management frontend (HTML, CSS, vanilla JavaScript) integrated with a Django REST Framework API.

## Features
- First-run bootstrap registration for the initial administrator.
- Token-based login and logout; password hashes are managed by Django.
- Authenticated patient listing, detail retrieval, creation, updates, deletion, and search.
- Patient input validation and explicit API errors.
- SQLite by default; optional PostgreSQL support can be enabled through configuration.
- API unit tests and a GitHub Actions test workflow.

> **Healthcare data warning:** This is a learning/assessment project, not a certified clinical system. Do not enter real patient data. Production use requires a security/privacy review, HTTPS, secrets management, audit trails, backups, retention controls, least-privilege roles, monitoring, and applicable legal/compliance safeguards.

## Requirements
- Python 3.10+
- A modern browser
- Optional: VS Code Live Server to serve the static frontend

## Quick start (Windows PowerShell)
```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
python manage.py makemigrations patients
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

## Quick start (macOS / Linux)
```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
cp .env.example .env
python manage.py makemigrations patients
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

The API health endpoint is `http://127.0.0.1:8000/api/health/`.

In a second terminal, serve the frontend from the repository root:
```bash
python -m http.server 5500
```
Open `http://127.0.0.1:5500/login.html`. For VS Code Live Server, add its exact origin to `DJANGO_CORS_ALLOWED_ORIGINS` in `.env`.

The frontend uses `http://127.0.0.1:8000/api` by default. To change it, set the base URL before `js/app.js` loads:
```html
<script>window.ELRICS_API_BASE_URL = "https://your-api.example.com/api";</script>
<script type="module" src="js/app.js"></script>
```

Never commit `.env`; use a strong random `DJANGO_SECRET_KEY`, set `DJANGO_DEBUG=False`, restrict `DJANGO_ALLOWED_HOSTS`, and use HTTPS for deployments.

## First-run administrator
1. Run migrations and start Django.
2. Open `register.html`.
3. Create the initial administrator with a strong password (at least 10 characters and Django's password checks).
4. Public registration closes after the first account. Additional accounts can be created through Django admin after `python manage.py createsuperuser` has established appropriate access, or via a future administrator-management endpoint.
5. Log in at `login.html`.

Tokens are stored in browser local storage for this assessment UI. This is convenient for a static frontend but exposes tokens to successful same-origin script injection; use a hardened session/BFF approach for a production healthcare system.

## API overview
All paths below are relative to `/api/`.

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `health/` | Public | Health check |
| GET | `auth/bootstrap/` | Public | Report whether first-admin registration is open |
| POST | `auth/register/` | Public, first user only | Create the initial admin |
| POST | `auth/login/` | Public | Receive an auth token |
| POST | `auth/logout/` | Token | Revoke current token |
| GET | `auth/me/` | Token | Current account profile |
| GET, POST | `patients/` | Token | List/search or create patients |
| GET, PUT, PATCH, DELETE | `patients/<uuid>/` | Token | Retrieve/update/delete patient |

Send `Authorization: Token <token>` for authenticated requests. Patient list responses use DRF pagination; the frontend reads the first page. Configure the page size with `API_PAGE_SIZE`.

Patient JSON uses the frontend-friendly keys `fullName`, `bloodGroup`, and `emergencyContact`; the API also returns `createdAt` and `updatedAt`.

## Tests
```bash
python manage.py test
```

## Database notes
SQLite is the zero-config default and persists data in `db.sqlite3`. PostgreSQL can be enabled by installing `dj-database-url` and a compatible PostgreSQL driver, then setting `DATABASE_URL`. Keep credentials in environment variables and require TLS for production database connections.

## Assumptions / limitations
- All authenticated staff accounts can manage all patient records; granular roles and per-record permissions are not included.
- Demo records are not generated automatically.
- This static-browser frontend is for assessment and should only be paired with a properly secured API.
