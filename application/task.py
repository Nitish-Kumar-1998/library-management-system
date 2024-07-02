from application.workers import celery
from datetime import datetime,timedelta
from celery.schedules import crontab
from jinja2 import Template
from application.email import send_email_user
from application.models import User, Rating, Book,BookRequest




@celery.on_after_finalize.connect                                       # decorator to connect to the celery instance
def set_up_daily_task(sender, **kwargs):
   sender.add_periodic_task(crontab(hour=19, minute=43),send_dailymail.s(),name="send_daily_task")        # adding a periodic task to send daily emails to users

 
@celery.on_after_finalize.connect                 
def set_up_monthly_task(sender, **kwargs):
   sender.add_periodic_task(crontab(day_of_month='16', hour=19, minute=43),send_monthlymail.s(),name="send_monthly_task")              # adding a periodic task to send monthly emails to users


   
@celery.task                                  
def send_dailymail():
    user=User.query.all()
    for i in user:
        if datetime.now() - i.last_visited >= timedelta(hours=0):
            with open('templates/dailyalert.html') as file_:
                template = Template(file_.read())
                message = template.render(name=i.username, lastvisited=i.last_visited)

            send_email_user(
                to=i.email,
                sub="Visit Mail",
                message=message
            )
    return "Emails have been sent to all users"



@celery.task
def send_monthlymail():
    users = User.query.all()

    for user in users:
        # Fetch ratings
        book_ratings = Rating.query.filter_by(user_id=user.id).all()
        book_ratings_info = [
            {
                "name": Book.query.get(rating.book_id).title if Book.query.get(rating.book_id) else "godan",             #fetching the book name
                "rate": rating.rating,
                "comment": rating.book_comment
               
            }
            for rating in book_ratings
        ]

        # Fetch book requests
        book_requests = BookRequest.query.filter_by(user_id=user.id).all()
        book_requests_info = [
            {
                "name": Book.query.get(request.book_id).title if Book.query.get(request.book_id) else "godan",
                "request_returnDate": request.request_returnDate,
                "request_status": request.request_status
            }
            for request in book_requests
        ]

        # Combine book ratings and book requests information
      

        with open('templates/monthlyalert.html') as file_:
            template = Template(file_.read())
            message = template.render(name=user.username, books_r_info=book_ratings_info, books_req_info=book_requests_info)
        
        send_email_user(
            to=user.email,
            sub="Monthly Mail",
            message=message
        )


    return "Monthly Emails have been sent to all Creators"