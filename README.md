# DSD-attendance

These services will be containerize through Docker soon

## Start Django service
You will need to generate a secret key for Django to run its auth schema

-  Inside root project directory run
  
    `python manage.py makemigrations`
   
    `python manage.py migrate`
   
    `python manage.py createsuperuser`
   
    `python manage.py runserver`
   
    
## Start React service 

-  CD into ghi/frontend and run

    `npm i`
   
    `npm run start`



