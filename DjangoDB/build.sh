pip install -r requirements.txt
pip install whitenoise
pip install cloudinary django-cloudinary-storage
python manage.py collectstatic --noinput
python manage.py migrate
