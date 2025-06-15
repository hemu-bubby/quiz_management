# 🎓 Quiz Management System
A full-stack web application built with Django (backend) and React (frontend) where faculty can create and manage quizzes and students can attempt them, with support for automatic grading, manual evaluation, and CSV export of results.

# 🚀 Features
👨‍🏫 Faculty
Create, edit, delete quizzes

Set quiz time limit and allow single/multiple attempts

Add both objective and manual questions (with marks)

View submissions for each quiz

Download results as CSV

# 🎓 Students
Login and view available quizzes

Attempt quizzes (with timer support)

Auto-evaluated objective questions

View past quiz attempts and correct answers

# 🛠️ Tech Stack
Layer	Tech Used
Frontend:React, Axios, React Router
Backend:	Django, Django REST Framework, Simple JWT
Database:	PostgreSQL / SQLite (Dev)
Auth:	JWT (access + refresh)
Styling:	Inline CSS / React styling

📦 Setup Instructions
🐍 Backend (Django)
bash
Copy
Edit
# Clone the repo
git clone https://github.com/yourusername/quiz-app.git
cd quiz-app

# Create a virtual environment
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Configure database in settings.py (use PostgreSQL recommended)
# Then run migrations
python manage.py migrate

# Create a superuser (for admin access)
python manage.py createsuperuser

# Start server
python manage.py runserver
📌 Visit http://127.0.0.1:8000/admin/ to access Django Admin.

⚛️ Frontend (React)
bash
Copy
Edit
# Navigate to frontend folder
cd quiz-frontend

# Install dependencies
npm install

# Start development server
npm start
📌 Visit http://localhost:3000 or 3001 (if configured).
