python3 -m venv venv
source venv/bin/activate
cd backend
pip install -r requirements.txt
python3 manage.py makemigrations
python3 manage.py migrate