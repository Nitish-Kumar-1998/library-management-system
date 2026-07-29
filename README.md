# 📚 Library Management System

A modern **full-stack Library Management System** built with **Flask**, **Vue.js**, **SQLAlchemy**, **JWT Authentication**, **Celery**, **Redis**, and **SQLite**.

This project demonstrates the development of a secure RESTful web application with role-based access control, background task processing, and a responsive frontend. It is designed as a portfolio project showcasing backend engineering, API development, authentication, and asynchronous programming.

---

## ✨ Features

- 🔐 JWT-based Authentication
- 👥 Role-Based Access Control (Admin/User)
- 📚 Book Management
- 🗂️ Section Management
- 👤 User Management
- 🔄 RESTful API Architecture
- ⚡ Background Task Processing with Celery
- ⏰ Scheduled Jobs using Celery Beat
- 📧 Email Notifications (MailHog)
- 🎨 Vue.js Frontend
- 🗄️ SQLite Database

---

## 🛠️ Tech Stack

### Backend
- Python
- Flask
- Flask-RESTful
- SQLAlchemy
- Flask-JWT-Extended
- Flask-Security

### Frontend
- Vue.js
- JavaScript (ES Modules)
- HTML5
- CSS3

### Database
- SQLite

### Background Processing
- Celery
- Redis
- Celery Beat

### Development Tools
- Docker
- Docker Compose
- MailHog

---

## 📁 Project Structure

```
library-management-system/
│
├── application/          # Flask application
├── static/               # Vue.js frontend
├── templates/            # HTML templates
├── db_directory/         # SQLite database
├── instance/             # Instance configuration
├── main.py               # Application entry point
├── requirements.txt
└── README.md
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/library-management-system.git

cd library-management-system
```

---

## 2. Create a Virtual Environment

### Windows

```bash
python -m venv env

env\Scripts\activate
```

### macOS/Linux

```bash
python -m venv env

source env/bin/activate
```

---

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 4. Start Redis

```bash
redis-server
```

---

## 5. Start Celery Worker

```bash
celery -A main.celery worker -l info
```

---

## 6. Start Celery Beat

```bash
celery -A main.celery beat --max-interval 1 -l info
```

---

## 7. Run the Application

```bash
python main.py
```

The application will be available at:

```
http://localhost:8000
```

---

# 🔑 Core Modules

### Authentication
- User Login
- JWT Authentication
- Role-Based Authorization

### Library Management
- Add, Update, Delete Books
- Manage Sections
- Manage Users
- Book Issue & Return

### REST API
- CRUD Operations
- Secure Endpoints
- JSON Responses

### Background Services
- Scheduled Notifications
- Email Alerts
- Asynchronous Tasks

---

# 🏗️ System Architecture

```
                +----------------------+
                |     Vue.js Client    |
                +----------+-----------+
                           |
                        REST API
                           |
                +----------v-----------+
                |        Flask         |
                | JWT Authentication   |
                | Role Authorization   |
                +----------+-----------+
                           |
         +-----------------+-----------------+
         |                                   |
+--------v--------+                 +--------v--------+
|    SQLAlchemy   |                 |     Celery      |
|     SQLite      |                 | Background Jobs |
+-----------------+                 +--------+--------+
                                             |
                                      +------v------+
                                      |    Redis    |
                                      +-------------+
```

---

# 📌 Future Enhancements

- PostgreSQL/MySQL Support
- Docker Compose Deployment
- Swagger/OpenAPI Documentation
- Unit & Integration Testing
- GitHub Actions CI/CD
- Elasticsearch Integration
- AI-based Book Recommendation
- Semantic Search
- Password Reset
- Email Verification
- Responsive Dashboard

---

# 💼 Skills Demonstrated

- Python Backend Development
- REST API Design
- Authentication & Authorization
- SQLAlchemy ORM
- Database Design
- Background Task Processing
- Task Scheduling
- Frontend Development
- Full-Stack Engineering
- Software Architecture

---

# 🎯 Project Highlights

This project demonstrates:

- Building scalable REST APIs using Flask.
- Implementing secure JWT authentication and role-based access control.
- Designing relational database models using SQLAlchemy.
- Integrating asynchronous task queues with Celery and Redis.
- Developing a responsive frontend using Vue.js.
- Structuring a production-style full-stack Python application.

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add feature"
```

4. Push to GitHub

```bash
git push origin feature-name
```

5. Open a Pull Request.

---

# 📄 License

This project is licensed under the MIT License. See the **LICENSE** file for details.

---

## ⭐ If you found this project useful, consider giving it a star!
