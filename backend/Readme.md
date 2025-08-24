# Setting Up

0. download python3.11

1. create a virtual environment
python3.11 -m venv311 venv311
1.1. start venv
source .venv311/bin/activate


2. install all the requirements
pip install -r requirements.txt

3. start the server
python manage.py runserver

4. open the admin page 
http://127.0.0.1:8000/admin

## For schema change
1. python manage.py makemigrations app
2. python manage.py migrate
