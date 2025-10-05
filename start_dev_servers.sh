#! /bin/bash
set -e
echo "starting backend server"
cd "./django_backend"
python manage.py runserver &
backend=$!
cd ..
echo "backend server started"
sleep 3
echo "starting frontend server"
cd "./react_frontend"
npm run dev &
frontend=$!
cd ..
echo "frontend server started"
sleep 4
echo
read -p "press enter to stop the servers : "
echo "stopping servers"
kill $backend $frontend
echo "servers stopped"

