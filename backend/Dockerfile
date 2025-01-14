FROM python:3.12
RUN python -m pip install --upgrade pip

WORKDIR /backend

COPY requirements.txt requirements.txt

RUN python -m pip install -r requirements.txt

COPY . .

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]