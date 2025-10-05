#! /bin/bash
set -e
echo "starting backend setup"
cd django_backend
python -m venv virtual_env
source virtual_env/Scripts/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py load_quizzes sample_quizzes.json
deactivate
echo "backend setup completed"
echo "starting frontend setup"
cd ..
cd react_frontend
npm install
echo "frontend setup completed"