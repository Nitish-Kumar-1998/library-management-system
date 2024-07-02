from celery import Celery
from flask import current_app as app

celery=Celery("Application Tasks")             #creating celery object


class ContextTasks(celery.Task):                        #class to create context tasks
    def __call__(self, *args,**kwargs):                 #function to call the task
        with app.app_context():                         #creating an application context
            return self.run(*args,**kwargs)           