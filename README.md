# Library Management System (LMS)

Short description
-----------------
A compact Library Management System demonstrating a full-stack web application: a Flask-based REST API (Python) with JWT + role-based auth, a Vue.js frontend (JavaScript + HTML/CSS), background processing with Celery + Redis for scheduled alerts and async work, and SQLite for local development. Designed as a portfolio project to showcase API design, background jobs, and a simple client UI.

Technologies
------------
- Backend: Python, Flask, Flask-RESTful, SQLAlchemy, Flask-Security, Flask-JWT-Extended
- Frontend: Vue.js (vanilla JS + HTML templates in static/)
- Background: Celery, Redis
- Database: SQLite (db_directory/database.sqlite3)
- Dev tools: MailHog (email testing), Docker (optional), Celery Beat (scheduling)

Key features
------------
- REST endpoints for users, books, and sections with JWT and role support
- Background tasks and periodic alerts (Celery + Redis) with email templates
- Minimal Vue.js frontend served from static/ for demo purposes
- Example local SQLite database included for quick setup

Quick start (development)
-------------------------
1. Create and activate virtualenv

```bash
python -m venv env
# macOS / Linux
source env/bin/activate
# Windows
env\\Scripts\\activate
```

2. Install dependencies

```bash
pip install -r requirements.txt
```

3. Start Redis (needed for Celery)

```bash
redis-server
```

4. Start Celery worker and beat in separate terminals

```bash
celery -A main.celery worker -l info
celery -A main.celery beat --max-interval 1 -l info
```

5. Run the Flask app

```bash
python main.py
# App runs at http://localhost:8000
```

Notes
-----
- Replace secret keys in application/config.py with environment variables before publishing or use a `.env` file.
- The Vue frontend is lightweight and lives under `static/`; if you have a separate Vue CLI project, build it and place the compiled assets in `static/`.

How to present this project on your resume
-----------------------------------------
Use these ready-to-paste bullets (edit to reflect your exact contributions):

- Built a full-stack Library Management System with a Flask REST API, JWT-based authentication, and a Vue.js frontend; implemented background processing using Celery + Redis and scheduled email alerts.
- Containerized and automated local development (recommended next step) with Docker and docker-compose; added CI and unit tests to improve reliability and reproducibility.
- Added semantic-search / recommendation feature (recommended enhancement) using embeddings and a simple vector index to demonstrate AI/ML integration.

Contact / Demo
--------------
Include a short demo GIF or link to a hosted instance here when available.

License
-------
See the LICENSE file in this repository.
