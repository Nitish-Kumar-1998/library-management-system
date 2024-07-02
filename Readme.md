# Readme file

# Create a virtual environment:

python -m venv env



# Now activate env

On Windows:

env\Scripts\activate


On macOS and Linux:

source env/bin/activate

# First, install all the dependencies from requirements.txt by using the command:

```bash
pip install -r requirements.txt

```


# step2


# Run the application using the command:

python3 main.py


# step3
# Start the redis-server This command is for Ubuntu WSL.


redis-server


# step4
# Start the Celery worker:

celery -A main.celery worker -l info



# step5
Start the Celery beat:

celery -A main.celery beat --max-interval 1 -l info


# step6

Start MailHog:

~/go/bin/MailHog

