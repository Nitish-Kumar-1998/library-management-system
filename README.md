# Library Management System (LMS)

Project description
-------------------
A lightweight Library Management System built with Flask that provides a REST API for user and book/section management, background scheduling for alerts, and email support. This repository demonstrates full-stack web development and background processing with room to add AI features (recommendation, semantic search, assistant) to showcase full-stack + AI engineering skills.

Key features
------------
- REST API for users, books, and sections
- Authentication: Flask-Security (user + role management) plus JWT
- Background jobs and scheduling using Celery (with Redis broker/backend)
- HTML email templates and static frontend assets for simple UIs and alerts
- Local SQLite database for quick setup and development

Why this project is valuable on a resume
--------------------------------------
This project already demonstrates backend API design, authentication, persistence, background processing, and templated emails. To make it stand out for a Full-Stack AI Engineer role, add: a demonstrable ML/AI feature (recommendations or semantic search), a polished frontend (React/Next.js with TypeScript), containerized deployment, CI/CD, unit/integration tests, and a short demo/video showing the features in action. Quantify any metrics you can (e.g., "reduced search latency by X%" or "provided top-5 recommendations to Y users").

Tech stack
----------
- Languages: Python (Flask backend), JavaScript (frontend), HTML, CSS
- Framework: Flask
- Notable libraries: Flask-Security, Flask-JWT-Extended, Flask-RESTful, SQLAlchemy, Celery, Redis

Repository layout
-----------------
```
.gitignore
Readme.md                    # this README (updated)
LICENSE
main.py                      # Flask app factory + API registration + run server
requirements.txt             # Python dependencies
db_directory/
  database.sqlite3           # local SQLite DB (included in repo)
application/
  api.py                     # API resource wrappers (Flask-RESTful resources)
  config.py                  # configuration classes (LocalDevelopmentConfig used by main.py)
  controllers.py             # request handlers and business logic
  email.py                   # email helper / templates integration
  models.py                  # SQLAlchemy models (User, Role, Book, Section, etc.)
  task.py                    # Celery tasks and scheduling logic
  workers.py                 # Celery worker setup / context tasks
static/
  js/
    app.js
    routers.js
    index.css
templates/
  index.html
  dailyalert.html
  monthlyalert.html
  reset_email.html
mad2 Lms report.pdf          # project report / documentation
```

How it fits together
--------------------
- main.py creates the Flask app (create_app) and registers API resources from application.api and handlers from application.controllers.
- Celery is initialized using the worker instance and runs scheduled/background tasks defined in application/task.py using Redis as broker and result backend.
- Templates under templates/ are used for email alerts and notifications. A minimal static frontend lives in static/ and templates/index.html.

Quick start (developer)
-----------------------
1. Create and activate a virtual environment:

```bash
python -m venv env
# Windows
env\Scripts\activate
# macOS / Linux
source env/bin/activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Start Redis (example):

```bash
redis-server
```

4. (Optional) Start MailHog to capture emails in dev:

```bash
MailHog
```

5. Start Celery worker and beat (in separate terminals):

```bash
celery -A main.celery worker -l info
celery -A main.celery beat --max-interval 1 -l info
```

6. Run the app:

```bash
python3 main.py
# or
python main.py
```

Development roadmap to make this repo resume-ready for a Full-Stack AI Engineer role
------------------------------------------------------------------------------------
Phase 1 — polish & developer experience (1–3 days)
- Replace committed secrets with environment variables (.env + python-dotenv).
- Add a CONTRIBUTING.md, CODE_OF_CONDUCT, and LICENSE if needed.
- Add setup scripts (makefile or scripts/bootstrap.sh) and README badges (build, tests, coverage).
- Pin dependencies in requirements.txt and add a development requirements file.
- Add a Dockerfile and a docker-compose.yml that runs: Flask app, Redis, Celery worker/beat, MailHog, and (optionally) PostgreSQL.

Phase 2 — tests, CI and quality (2–4 days)
- Add unit tests for controllers and tasks (pytest). Add simple integration tests that spin up the app and hit a few endpoints.
- Add GitHub Actions workflow to run linting (flake8/ruff), tests, and build the Docker image on PR.
- Add code formatting (black) and type checking (mypy) to the CI pipeline.

Phase 3 — production-grade backend & infra (3–7 days)
- Replace SQLite with PostgreSQL (via docker-compose) and use Alembic for migrations.
- Move config to environment variables and add a sample .env.example.
- Add logging, error handling, and request tracing (structured logs).
- Add OpenAPI/Swagger documentation (flasgger or flask-restx) with example payloads.

Phase 4 — frontend & UX (3–7 days)
- Build a small TypeScript React or Next.js frontend that consumes the API and demonstrates features: auth, book listing, search, recommendations.
- Add screenshots, a demo GIF, and a short video (1–2 mins) in the README.

Phase 5 — add AI features (7–14 days)
Pick one or two AI features to implement well and showcase end-to-end work (training, inference, evaluation, deployment):

- Content-based recommendation (quick):
  - Use book metadata (title, author, description) to create TF-IDF vectors and compute similarity with scikit-learn. Expose /api/book/recommend/<book_id>.
  - Demonstrate offline evaluation (precision@k) on a held-out sample or synthetic interactions.

- Embeddings + semantic search (recommended):
  - Use sentence-transformers (Hugging Face) or OpenAI embeddings to index book descriptions/titles in FAISS or simple in-memory vectors.
  - Add /api/search?q=... to return semantically similar books.
  - Cache embeddings and index updates in Celery background tasks.

- Personalized recommendations (advanced):
  - Use collaborative filtering (LightFM) or a simple matrix factorization model trained on interaction logs (borrow synthetic or real anonymized data).
  - Train periodically with Celery and expose an endpoint for top-N recommendations.

- GPT-powered assistant (demo-level):
  - Add an assistant endpoint that uses a chat model (OpenAI or local LLM) to answer questions about the catalog ("Which books on X do you recommend?").
  - Provide a user-facing chat UI in the frontend.

For any ML model:
- Include the training notebook or script, README explaining data and metrics, and a small pre-trained artifact (or instructions to train quickly).
- Keep keys and API tokens out of the repo. Use environment variables.

Phase 6 — deploy & demo (1–3 days)
- Create a deployable artifact: Docker image and docker-compose for demo, or push to a cloud provider (Heroku, Render, Railway, or cloud VM).
- Add a public demo link in the README and a short demo video.

Resume & portfolio guidance (how to showcase this repo)
------------------------------------------------------
- Add a short "Role & Contributions" section in README describing what *you* implemented.
- Write 3–5 concise bullet points for your resume using metrics and tech: e.g.,
  - "Built end-to-end Library Management System using Flask (REST API), Celery, and Redis; implemented semantic search with sentence-transformers and FAISS to serve similar-book results in <100ms."
  - "Containerized app with Docker and automated CI/CD using GitHub Actions, enabling reproducible local and cloud deployments."
  - "Implemented automated periodic tasks (alerts, model retraining) with Celery and demonstrated background processing at scale."
- Put the repo link in your resume and GitHub profile; add a one-line summary and tech stack.
- Create a 1–2 minute demo video and thumbnail GIF; host the video on YouTube and link it in the README and resume.

Concrete next steps I can take right now
---------------------------------------
1. Commit the improved README to the repository (I can do that now). 
2. Open a small PR adding a .env.example and .gitignore updates for secrets.
3. Scaffold a Dockerfile and docker-compose.yml for local reproducible development.

Which of these would you like me to do first? If you want, I will: commit this README update now (so the repo has a polished landing page) and then scaffold a Docker Compose setup for development (Flask + Redis + Celery + MailHog).
