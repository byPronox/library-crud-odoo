# CRUD + Login (Odoo 17 + React)

A minimal, professional-looking CRUD portal built with React (Vite + TypeScript) that authenticates against Odoo 17 users and exposes a small MVC-style API via a custom Odoo module.

Assignment goals covered:
- Login with Odoo user credentials (server-side session).
- Protected routes: the CRUD portal is not accessible without authentication.
- CRUD operations (Create/Read/Update/Delete) over a simple `library.book` model.

## Tech Stack
- Backend: Odoo 17 (Python 3.12), custom addon `library_mvc`
- Frontend: React 19, Vite 7, TypeScript

## Repository Structure
```
BACKEND/
  CUSTOM-ADDONS/
    library_mvc/        # Odoo 17 custom module (models, controllers, views, access)
frontend-react/         # Vite + React app (login + protected CRUD)
```

## Prerequisites
- Odoo 17 installed and runnable on Windows
- Python 3.12 (used by Odoo 17)
- Node.js 20+ and npm

## Backend (Odoo 17)
1) Add the custom addons path to your Odoo configuration or run Odoo with it:
- Add to `odoo.conf`:
  ```ini
  addons_path = C:\\Users\\USER-PC\\Desktop\\odoo-17\\odoo\\addons, C:\\Users\\USER-PC\\Desktop\\CRUD-LOGIN\\BACKEND\\CUSTOM-ADDONS
  ```
  Or start Odoo with `--addons-path` including the path above.

2) Start Odoo on port 8017 (expected by frontend proxy). Example:
- Ensure Odoo runs at: http://127.0.0.1:8017

3) Install the module in Odoo UI:
- Go to Apps → Update Apps List (activate Developer Mode if needed)
- Search and install: `API Auth` (folder `library_mvc`)

The addon includes:
- Model `library.book` with fields: `name` (required), `author`, `published_year`, `is_available` (default true)
- Access rights for internal users (read/write/create/delete)
- Controllers exposing RESTful endpoints under `/api/books`

## Frontend (Vite + React)
From the `frontend-react` folder:

```powershell
# Install dependencies
npm install

# Start dev server (Vite)
npm run dev

# Build for production
npm run build
```

Open the URL printed by Vite (e.g., http://localhost:5173). You should first see the Login page.

## Configuration
- The Vite proxy forwards API and Odoo session calls to `http://127.0.0.1:8017`.
- If your Odoo runs elsewhere, update `frontend-react/vite.config.ts`:
  ```ts
  proxy: {
    '/web': { target: 'http://127.0.0.1:8017', changeOrigin: true },
    '/api': { target: 'http://127.0.0.1:8017', changeOrigin: true },
  }
  ```

## Authentication Flow
- The login page calls Odoo JSON-RPC endpoint `/web/session/authenticate` with database, login, and password.
- The app checks the session via `/web/session/get_session_info`.
- ProtectedRoute redirects unauthenticated users to `/login?next=/books`.

## API Endpoints (Odoo custom controller)
All routes require an authenticated Odoo session (auth='user') and return JSON.

- GET `/api/books`
  - Returns an array of books
  - 200 example:
    ```json
    [
      {"id": 1, "name": "COUNTER", "author": "Stefan", "published_year": 2000, "is_available": true}
    ]
    ```

- POST `/api/books`
  - Body (JSON):
    ```json
    { "name": "The Little Prince", "author": "Antoine", "published_year": 1943, "is_available": true }
    ```
  - Validates `name` is non-empty. Returns `{"id": <new_id>}` on success.

- PUT `/api/books/<id>`
  - Body (JSON): any subset of fields to update
  - Returns the updated record JSON on success.

- DELETE `/api/books/<id>`
  - Returns `{ "ok": true, "deleted": 1 }` on success.

Notes:
- Controllers use `type='http'` with JSON bodies parsed from `request.httprequest`.
- Responses include `Cache-Control: no-store` to prevent stale content while testing.

## Demo Guide (for assignment video)
Show these steps (~3 minutes):
1) Access protection
   - Try `/books` without a session → redirected to `/login`.
2) Login
   - Use your Odoo DB (e.g., `odoomvc`) and valid credentials.
3) CRUD
   - Create a new book (name required), list updates.
   - Edit a book (change author/year), card updates immediately.
   - Delete a book, it disappears.
4) Refresh
   - Reload page to confirm persistence.

## Troubleshooting
- Vite proxy ECONNREFUSED
  - Ensure Odoo runs at 127.0.0.1:8017; switch `localhost` to `127.0.0.1` in proxy if needed.
- 400 on GET `/api/books`
  - Ensure the controller for GET uses `type='http'` and returns JSON (already done).
- AttributeError `request.jsonrequest` with `type='http'`
  - Use `request.httprequest.get_json(silent=True)` (already implemented here).
- Changes not applied in Odoo
  - Restart Odoo after editing the module.
- NPM commands fail from root folder
  - Run them inside `frontend-react`.

## License
Educational use for the assignment.