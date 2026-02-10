pip install -r requirements.txt
pip install whitenoise
python manage.py collectstatic --noinput
python manage.py migrate
