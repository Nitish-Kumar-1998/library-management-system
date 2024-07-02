from flask import Flask
from flask_security import Security, SQLAlchemySessionUserDatastore
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_restful import Api
from application.models import db, User, Role
from application.config import LocalDevelopmentConfig
from application import workers
from flask_caching import Cache
from application.task import *

# Global variables to hold app, api, celery, and cache instances
app = None
api = None
celery = None
cache = None

def create_app():
    # Create a Flask application instance
    app = Flask(__name__, template_folder="templates")
    print("Staring Local Development")

    # Load the configuration from LocalDevelopmentConfig
    app.config.from_object(LocalDevelopmentConfig)

    # Initialize the database with the Flask app
    db.init_app(app)
    app.app_context().push()

    # Create an API instance and enable CORS
    api = Api(app)
    CORS(app)

    # Initialize JWT manager
    jwt = JWTManager(app)
    app.app_context().push()

    # Initialize Flask-Security with SQLAlchemy session and User/Role models
    datastore = SQLAlchemySessionUserDatastore(db.session, User, Role)
    app.security = Security(app, datastore)

    # Initialize Celery worker
    celery = workers.celery
    celery.conf.update(
        broker_url=app.config["CELERY_BROKER_URL"],
        result_backend=app.config["CELERY_RESULT_BACKEND"],
        timezone="Asia/Kolkata",
        broker_connection_retry_on_startup=True
    )
    celery.Task = workers.ContextTasks
    app.app_context().push()

    # Initialize cache
    cache = Cache(app)
    app.app_context().push()

    return app, api, celery, cache

# Create app, api, celery, and cache instances
app, api, celery, cache = create_app()

# Import controllers and API resources
from application.controllers import *
from application.api import *

# Add API resources
api.add_resource(UserResource, '/api/user')
api.add_resource(Allbook, '/api/book')
api.add_resource(SectionResource, '/api/section', '/api/section/<int:s_id>')
api.add_resource(BookResource, '/api/book/section/<int:s_id>', '/api/book/<int:b_id>')

if __name__ == '__main__':
    # Create database tables
    db.create_all()

    # Run the Flask app in debug mode on port 8000
    app.run(debug=True, port=8000)




    