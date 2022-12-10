python3 -m venv venv
cd backend
pip install -r requirements.txt
python3 manage.py makemigrations
python3 manage.py migrate
cd ..
cd frontend
npm install
npm install @material-ui/core --legacy-peer-deps
cd ..
