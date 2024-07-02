
# Import the required libraries and modules

from flask import current_app as app, render_template, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity,create_access_token
from application.models import *
from werkzeug.security import generate_password_hash, check_password_hash
from jinja2 import Template
import random
from application.email import send_email_user
import datetime
from main import cache
from sqlalchemy import or_, and_








#=======================================================================cuser_to_dict==================================================================================================

# Define the dictionary of user information
def cuser_to_dict(user):
    return {
        'id': user.id,
        'username': user.username,
        'email': user.email,
    }

# Define the dictionary of user information
def puser_to_dict(user):
    return {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'image': user.image,
    }

@app.route('/')
def landing_page():
    return render_template('index.html')




#=============================================================bookreq_to_dict==================================================================================================



def bookreq_to_dict(book, bookrequest):
    if book is None:
        return {}  # Return an empty dictionary if the book is not found
    
    section_name = Section.query.get(book.section_id).name
    return {
        'id': book.id,
        'name': book.title,
        'author': book.author,
        'image': book.image,
        'content': book.content,
        'section_id': book.section_id,
        'section': section_name,
        'book_publishedDate': book.book_publishedDate,
        'request_returnDate': book.book_returnDate,
        "request_status": bookrequest.request_status,
        "book_requestDate": bookrequest.book_requestDate,
        "request_returnDate": bookrequest.request_returnDate,
        "rid": bookrequest.id,
    }



#=============================================================user_login==================================================================================================



@app.route('/user_login', methods=['POST'])
def user_login():
    post_data = request.get_json()
    username = post_data.get('username')
    password = post_data.get('password')

    user = User.query.filter_by(username=username).first()

    if not user:
        app.logger.info(f"Oops! It seems there is no user associated with: {username}")

        return jsonify({'message': 'User record not found!'})

    if check_password_hash(user.password, password):
        app.logger.info("Success! Your password has been validated.")

        # Revoke overdue book requests
        revoke_overdue_book_requests(user)

        access_token = create_access_token(identity=user.id)
        # role = user.roles[0].name
        role = user.roles[0].name

        return jsonify({"token": access_token, "role": role})
    else:
        app.logger.warning("Sorry, password validation failed")
        return jsonify({"Sorry, the password is wrong."})







#=======================================================================revoke_overdue_book_requests==================================================================================================



def revoke_overdue_book_requests(user):
    book_requests = BookRequest.query.filter_by(user_id=user.id).all()
    for book_request in book_requests:
        if is_overdue(book_request) and not is_book_request_processed(book_request):
            revoke_book_request(book_request)
            send_revocation_email(user, book_request)



def is_overdue(book_request):
    return book_request.request_returnDate < datetime.datetime.now() and \
           book_request.request_status != 'returned' and \
           book_request.request_status not in ['revoked', 'approved', 'rejected', 'requested']



def is_book_request_processed(book_request):
    return book_request.request_status in ['revoked', 'approved', 'rejected', 'requested', 'returned']



def revoke_book_request(book_request):
    book_request.request_status = 'revoked'
    db.session.commit()



def send_revocation_email(user, book_request):
    book_title = Book.query.filter_by(id=book_request.book_id).first().title
    send_email_user(
        to=user.email,
        sub="Book Request Revoked",
        message=f"Your book request for {book_title} has been revoked due to late return"
    )


#=======================================================================user_logout_funtion==================================================================================================



def user_logout():
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()
    
    if not user:
        return jsonify({'message': 'Sorry, no user is logged in.'})

    user.last_visited = datetime.datetime.now()
    db.session.commit()

    return jsonify({'message': 'User session successfully terminated.'})




#=======================================================================userlogout==================================================================================================


@app.route('/userlogout', methods=['POST'])
@jwt_required()
def user_logout_route():
    return user_logout()





#=======================================================================currentuser==================================================================================================



# Define the route for currentuser
@app.route('/currentuser/')
@jwt_required()
def currentuser():
    user=User.query.filter_by(id=get_jwt_identity()).first()
    if not user:
        return jsonify({'message': 'Sorry, no user is logged in.'})
    return jsonify(cuser_to_dict(user))




#=======================================================================createuser==================================================================================================




# Define the route for user creation and listing
@app.route('/createuser/')
def createuser():
    user=User.query.all()
    return jsonify([cuser_to_dict(user) for user in user])




#=====================================================================registeruser==================================================================================================



@app.route('/registeruser/', methods=['POST'])
def register_user():
    post_data = request.get_json()
    username = post_data.get('username')
    email = post_data.get('email')
    password = post_data.get('password')

    if not username:
        return jsonify({'message': 'Please provide a username.'})
    if not email:
        return jsonify({'message': 'Please provide an email address.'})
    if not password:
        return jsonify({'message': 'Please provide a password.'})
  
    if user_exists(username, email):
        return jsonify({'message': 'Username or email already exists'})

    create_user(username, email, password)

    return jsonify({'message': 'User account created successfully!'})

def user_exists(username, email):
    return User.query.filter(or_(User.username == username, User.email == email)).first() is not None

def create_user(username, email, password):
    user = User(username=username, email=email, password=generate_password_hash(password))
    db.session.add(user)
    db.session.commit()

    user_datastore = app.security.datastore
    user = user_datastore.find_user(username=username)
    role = user_datastore.find_role('user')
    user_datastore.add_role_to_user(user, role)
    db.session.commit()


#==========================================================================resetpassword==============================================



# Define the route for user reset password
@app.route('/resetpassword', methods=['POST', 'PUT'])
def handle_reset_password():
    if request.method == 'POST':
        return reset_password_request()
    elif request.method == 'PUT':
        return reset_password()

def reset_password_request():
    post_data = request.get_json()
    email = post_data.get('email')
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'Sorry, no user is logged in.'})
    
    # Generate OTP
    gen_otp= random.randint(100000,999999) 
    # Read reset.html file and use it as email template
    with open('templates/reset_email.html') as file_:
        template = Template(file_.read())
        message = template.render(otp=gen_otp)

    # Implement email sending logic
    send_email_user(
        to=email,
        sub="Password Reset",
        message=message
    )

    return jsonify({'message': 'Password reset OTP has been sent!', 'otp': gen_otp, 'email': email})

def reset_password():
    post_data = request.get_json()
    email = post_data.get('email')
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'Sorry, no user is logged in.'})
    password = generate_password_hash(post_data.get('password'))
    user.password = password
    db.session.commit()
    
    return jsonify({'message': 'Congratulations! Password reset successful!'})


#========================================================================book_to_dict===========================================================================================

def book_to_dict(book, user_id):
    book_request = BookRequest.query.filter_by(book_id=book.id, user_id=user_id).order_by(BookRequest.book_requestDate.desc()).first()
    request_status = ""
    if book_request and book_request.request_status != 'returned':
        request_status = book_request.request_status
    else:
        request_status = "none"

    section_name = ""
    section = Section.query.filter_by(id=book.section_id).first()
    if section:
        section_name = section.name

    return {
        'id': book.id,
        'name': book.title,
        'author': book.author,
        'image': book.image,
        'content': book.content,
        'section_id': book.section_id,
        "section": section_name,
        'book_publishedDate': book.book_publishedDate,
        'book_returnDate': book.book_returnDate,
        "requestStatus": request_status
    }






#==========================================================get_user_books====================================================================



def get_user_books():
    user_id = get_jwt_identity()
    books = Book.query.all()
    user_books = []
    for book in books:
        user_books.append(book_to_dict(book, user_id))
    return jsonify(user_books)



#==========================================================userbooks====================================================================

@app.route('/userbooks', methods=['GET'])
@cache.cached(timeout=10)
@jwt_required()
def handle_user_books():
    return get_user_books()




#==========================================================bookrequest_user====================================================================


@app.route('/bookrequest/<b_id>', methods=['POST'])
@jwt_required()
def bookrequest(b_id):
    user_id = get_jwt_identity()
    book_id = b_id
    user = User.query.get(user_id)
    book = Book.query.get(book_id)

    if not user:
        return jsonify({'message': 'Sorry, no user is logged in.'}), 400
    if not book:
        return jsonify({'message': 'Unfortunately, there are no books found.'}), 404

    # Count the number of pending and approved book requests for the user
    book_requests_count = BookRequest.query.filter(
        and_(
            BookRequest.user_id == user_id,
            ~BookRequest.request_status.in_(['returned', 'rejected', 'revoked'])
        )
    ).count()

    # Limit the number of book requests to 5
    if book_requests_count >= 5:
        return jsonify({'message': 'Sorry, you can not request more books. Maximum limit reached!'}), 400

    # Retrieve request return date from JSON data and validate its format
    post_data = request.get_json()
    request_returnDate_str = post_data.get('request_returnDate')

    try:
        request_returnDate = datetime.datetime.strptime(request_returnDate_str, '%Y-%m-%dT%H:%M')
    except ValueError:
        return jsonify({'message': 'Incorrect date format. Please follow YYYY-MM-DDTHH:MM'}), 400

    # Check if the return date is in the future
    if request_returnDate < datetime.datetime.now():
        return jsonify({'message': 'Please choose a return date in the future!'}), 400

    # Check if the user has already requested the same book and if the request is not already returned or revoked
    existing_request = BookRequest.query.filter_by(user_id=user_id, book_id=book_id).first()
    if existing_request and existing_request.request_status == 'approved' or existing_request.request_status == 'pending':
        return jsonify({'message': 'Sorry, this book has already been requested'}), 400

    # Create a new book request and add it to the database
    new_request = BookRequest(
        user_id=user_id,
        book_id=book_id,
        request_status='pending',
        book_requestDate=datetime.datetime.now(),
        request_returnDate=request_returnDate
    )
    db.session.add(new_request)
    db.session.commit()

    return jsonify({'message': 'Congratulations! Book request successful!'}), 200




#==========================================================my_books====================================================================




@app.route('/my_books', methods=['GET'])
@cache.cached(timeout=1)
@jwt_required()
def my_books():
    user_id = get_jwt_identity()
    bookrequests = BookRequest.query.filter_by(user_id=user_id).all()
    return jsonify([bookreq_to_dict(Book.query.filter_by(id=bookrequest.book_id).first(),bookrequest) 
                    for bookrequest in bookrequests])



#==========================================================returnbook====================================================================




@app.route('/returnbook/<rid>', methods=['POST'])
@jwt_required()
def return_book(rid):
    user_id = get_jwt_identity()
    book_request = BookRequest.query.filter_by(id=rid, user_id=user_id).first()
    if not book_request:
        return jsonify({'message': 'No book request found'})
    book_request.request_status = 'returned'
    db.session.commit()
    return jsonify({'message': 'Book return process completed successfully!'})



#==========================================================book_requests====================================================================

def book_request_to_dict(book, book_request):                             # Define a function to convert a book request object to a dictionary                  
    if book is None:
        return {}  # Return an empty dictionary if the book is not found
    
    section_name = Section.query.filter_by(id=book.section_id).first().name
    username = User.query.filter_by(id=book_request.user_id).first().username

    return {
        'id': book.id,
        'name': book.title,
        'author': book.author,
        'content': book.content,
        "rid": book_request.id,
        "section": section_name,
        "request_status": book_request.request_status,
        "book_requestDate": book_request.book_requestDate,
        "request_returnDate": book_request.request_returnDate,
        "username": username
    }





@app.route('/bookrequests', methods=['GET','POST'])                  # Defines a route '/bookrequests' that accepts GET and POST requests
@jwt_required()
def handle_book_requests():
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()
    if not user.roles[0].name == 'librarian':
        return jsonify({'message': 'Admin not logged in'})

    if request.method == 'GET':
        book_requests = BookRequest.query.all()
        return jsonify([book_request_to_dict(Book.query.filter_by(id=book_req.book_id).first(), book_req) 
                        for book_req in book_requests])
    
    elif request.method == 'POST':
        post_data = request.get_json()
        bookrequest_id = post_data.get('bookrequest_id')
        request_status = post_data.get('request_status')
        
        book_request = BookRequest.query.filter_by(id=bookrequest_id).first()
        if not book_request:
            return jsonify({'message': 'Sorry, no book request was found.'})
        
        # If the book is being issued, update its status to 'issued'
        if request_status == 'issued':
            book_request.request_status = 'issued'
        else:
            book_request.request_returnDate = datetime.datetime.now()
            book_request.request_status = request_status
        
        db.session.commit()
        return jsonify({'message': 'Success! Book request has been updated.'})









#==========================================================user_statistics====================================================================



@app.route('/user_statistics', methods=['GET'])                      # Defines a route '/user_statistics' that accepts GET requests
@jwt_required()
def user_statistics():
    user_id = get_jwt_identity()
    user_record = User.query.filter_by(id=user_id).first()
    if not user_record:
        return jsonify({'message': 'User not logged in.'}), 401
    
    book_requests = BookRequest.query.filter_by(user_id=user_id, request_status='returned').all()
    statistics = {}
    for request_entry in book_requests:
        book_entry = Book.query.filter_by(id=request_entry.book_id).first()
        if book_entry is None:
            continue  
        
        section_entry = Section.query.filter_by(id=book_entry.section_id).first()
        if section_entry is None:
            continue  
        
        section_name = section_entry.name
        statistics[section_name] = statistics.get(section_name, 0) + 1
    
    return jsonify(statistics)










#===================================================librarian_stats==============================================================




@app.route('/librarian_stats', methods=['GET'])
@jwt_required()
def librarian_stats():
    current_user_id = get_jwt_identity()
    current_user = User.query.filter_by(id=current_user_id).first()
    
    if not current_user:
        return jsonify({'message': 'User not logged in.'}), 401
    
    book_requests = BookRequest.query.filter(BookRequest.request_status.in_(['returned', 'approved'])).all()
    statistics = {}

    for request in book_requests:
        requested_book = Book.query.filter_by(id=request.book_id).first()

        if requested_book:
            book_section = Section.query.filter_by(id=requested_book.section_id).first()

            if book_section:
                section_name = book_section.name
                statistics[section_name] = statistics.get(section_name, 0) + 1

    return jsonify(statistics)


#===================================================ratebook==============================================================


@app.route('/ratebook/<book_id>', methods=['POST'])  # Defines a route '/ratebook/<book_id>' that accepts POST requests
@jwt_required()  # Requires JWT authentication to access this route
def rate_book(book_id):
    user_id = get_jwt_identity()  # Retrieves the user ID from the JWT token
    post_data = request.get_json()  # Retrieves JSON data from the request body
    rating_value = post_data.get('rating')  # Retrieves the rating value from the JSON data
    book_comment = post_data.get('book_comment')  # Retrieves the book comment from the JSON data
    
    book = Book.query.filter_by(id=book_id).first()  # Retrieves the book object from the database based on the book ID
    if not book:
        return jsonify({'message': 'Sorry, no books were found.'})  # Returns an error message if the book is not found
    
    submitted_rating = Rating.query.filter_by(book_id=book_id, user_id=user_id).first()  # Checks if the user has already rated the book
    if submitted_rating:
        return jsonify({'message': 'Sorry, you have already rated this book.'})  # Returns an error message if the user has already rated the book
    
    latest_rating = Rating(rating=rating_value, book_comment=book_comment, user_id=user_id, book_id=book_id, rate_date=datetime.datetime.now())  # Creates a new Rating object with the provided data
    db.session.add(latest_rating)  # Adds the new rating to the database session
    db.session.commit()  # Commits the changes to the database
    
    return jsonify({'message': 'Book rating submitted successfully!'})  # Returns a success message after successfully adding the rating to the database





#===================================================book_ratings==============================================================


@app.route('/book_ratings/<bok_id>', methods=['GET'])  # Defines a route '/book_ratings/<bok_id>' that accepts GET requests
def book_ratings(bok_id):
    # Retrieves all ratings for a given book ID from the database
    rates_given = Rating.query.filter_by(book_id=bok_id).all()
    
    # Formats the retrieved ratings into a list of dictionaries
    Formatted_feedbacks = [{
        'id': rating.id,                     # Stores the ID of the rating
        'user_id': rating.user_id,           # Stores the ID of the user who rated the book
        'book_comment': rating.book_comment, # Stores any comment associated with the rating
        'rating': rating.rating * "👍",      
        'rate_date': rating.rate_date        # Stores the date when the rating was made
    } for rating in rates_given]                 # Iterates over each rating to create a formatted dictionary
    
    # Returns the formatted ratings as JSON response
    return jsonify(Formatted_feedbacks)



