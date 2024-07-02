from flask_restful import Resource, reqparse
from flask import jsonify, request
from application.models import *  # Importing models from application package
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from datetime import datetime

# Define the dictionary of user information
def user_info_dict(user_info):
    return {
        'id': user_info.id,
        'username': user_info.username,
        'email': user_info.email,
    }

# Define the dictionary of section information
def section_info_dict(section_info):
    return {
        'id': section_info.id,
        'name': section_info.name,
        'image': section_info.image,
        'description': section_info.description,
        'section_createdDate': section_info.section_createdDate,
    }

# Define the dictionary of book information
def book_info_dict(book_info):
    return {
        'id': book_info.id,
        'name': book_info.title,
        'author': book_info.author,
        'content': book_info.content,
        'section_id': book_info.section_id,
        'image': book_info.image,
        'book_publishedDate': book_info.book_publishedDate,
        'book_returnDate': book_info.book_returnDate,
    }

# Parser for user data
user_data_parser = reqparse.RequestParser()
user_data_parser.add_argument('username')
user_data_parser.add_argument('password')
user_data_parser.add_argument('email')

# Parser for section data
section_data_parser = reqparse.RequestParser()
section_data_parser.add_argument('name')
section_data_parser.add_argument('description')
section_data_parser.add_argument('image')
section_data_parser.add_argument('section_createdDate')

# Parser for book data
book_data_parser = reqparse.RequestParser()
book_data_parser.add_argument('title')
book_data_parser.add_argument('content')
book_data_parser.add_argument('author')
book_data_parser.add_argument('image')
book_data_parser.add_argument('book_publishedDate')
book_data_parser.add_argument('book_returnDate')

# Resource for User API
class UserResource(Resource):
    # GET method to retrieve all users
    def get(self):
        all_users = User.query.all()
        return jsonify([user_info_dict(user) for user in all_users])

    # POST method to add a new user
    def post(self):
        post_data = request.get_json()
        username = post_data.get('username')
        password = post_data.get('password')
        email = post_data.get('email')
        # Hashing password for security
        user = User(username=username, password=generate_password_hash(password), email=email)
        db.session.add(user)
        db.session.commit()
        return jsonify(user_info_dict(user))
    
    # DELETE method to delete user (requires JWT authentication)
    @jwt_required()
    def delete(self):
        id = get_jwt_identity()
        user = User.query.filter_by(id=id).first()
        if not user:
            return jsonify({'message': 'No user found!'})
        role = UserRole.query.filter_by(user_id=id).first()
        db.session.delete(role)
        db.session.commit()
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully!'})

class SectionResource(Resource):
    # GET method to retrieve all sections (requires JWT authentication)
    @jwt_required()
    def get(self):
        all_sections = Section.query.all()
        sections_data = [section_info_dict(section) for section in all_sections]
        return jsonify(sections_data)
    
    # POST method to add a new section (requires JWT authentication)
    @jwt_required()
    def post(self):
        post_data = section_data_parser.parse_args()
        name = post_data.get('name')
        description = post_data.get('description')
        image = post_data.get('image')
        section_createdDate = post_data.get('section_createdDate')
        section_createdDate = datetime.strptime(section_createdDate, '%Y-%m-%d')
        
        if name is None or description is None or image is None or section_createdDate is None:
            return jsonify({'message': 'All fields are required!'})
        
        existing_section = Section.query.filter_by(name=name).first()
        if existing_section:
            return jsonify({'message': 'Section already exists!'})
        
        new_section = Section(name=name, description=description, image=image, section_createdDate=section_createdDate)
        db.session.add(new_section)
        db.session.commit()
        
        return jsonify({'message': 'Section added successfully!'})
    
    # PUT method to update a section (requires JWT authentication)
    @jwt_required()
    def put(self, s_id):
        post_data = section_data_parser.parse_args()
        name = post_data.get('name')
        description = post_data.get('description')
        image = post_data.get('image')
        section_createdDate = post_data.get('section_createdDate')
        section_createdDate = datetime.strptime(section_createdDate, '%Y-%m-%d')
        
        section_to_update = Section.query.filter_by(id=s_id).first()
        if name is None or description is None or image is None or section_createdDate is None:
            return jsonify({'message': 'All fields are required!'})
        
        if not section_to_update:
            return jsonify({'message': 'No section found!'})
        
        section_to_update.name = name
        section_to_update.description = description
        section_to_update.image = image
        section_to_update.section_createdDate = section_createdDate
        
        db.session.commit()
        
        return jsonify({'message': 'Section updated successfully!'})
    
    # DELETE method to delete a section (requires JWT authentication)
    @jwt_required()
    def delete(self, s_id):
        id = get_jwt_identity()
        user = User.query.filter_by(id=id).first()
        if not user:
            return jsonify({'message': 'No user found!'})
        role = UserRole.query.filter_by(user_id=id).first()
        if role.role_id != 1:
            return jsonify({'message': 'You are not authorized to delete section!'})
        section = Section.query.filter_by(id=s_id).first()
        if not section:
            return jsonify({'message': 'No section found!'})
        db.session.delete(section)
        db.session.commit()
        return jsonify({'message': 'Section deleted successfully!'})

class Allbook(Resource):
    # GET method to retrieve all books in a section (requires JWT authentication)
    @jwt_required()
    def get(self):
        all_books = Book.query.all()
        return jsonify([book_info_dict(book) for book in all_books])

class BookResource(Resource):
    # GET method to retrieve all books in a section (requires JWT authentication)
    @jwt_required()
    def get(self, s_id):
        books_in_section = Book.query.filter_by(section_id=s_id).all()
        return jsonify([book_info_dict(book) for book in books_in_section])
         
    # POST method to add a new book to a section (requires JWT authentication)
    @jwt_required()
    def post(self, s_id):
        post_data = book_data_parser.parse_args()
        title, author, image, content, book_publishedDate, book_returnDate = (
            post_data.get(field) for field in ['title', 'author', 'image', 'content', 'book_publishedDate', 'book_returnDate']
        )
        book_publishedDate = datetime.strptime(book_publishedDate, '%Y-%m-%d')
        book_returnDate = datetime.strptime(book_returnDate, '%Y-%m-%d')
        
        if not all([title, author, image, content, book_publishedDate, book_returnDate]):
            return jsonify({'message': 'All fields are required!'})
        
        book = Book(
            title=title, content=content, author=author, image=image,
            book_publishedDate=book_publishedDate, book_returnDate=book_returnDate, section_id=s_id
        )
        db.session.add(book)
        db.session.commit()
        return jsonify({'message': 'Book added successfully!'})
    
    # PUT method to update a book (requires JWT authentication)
    @jwt_required()
    def put(self, b_id):
        post_data = request.get_json()
        title, author, image, content, book_publishedDate, book_returnDate = (
            post_data.get(field) for field in ['title', 'author', 'image', 'content', 'book_publishedDate', 'book_returnDate']
        )
        book_publishedDate = datetime.strptime(book_publishedDate, '%Y-%m-%d')
        book_returnDate = datetime.strptime(book_returnDate, '%Y-%m-%d')
        book = Book.query.filter_by(id=b_id).first()
        
        if not all([title, author, image, content, book_publishedDate, book_returnDate]):
            return jsonify({'message': 'All fields are required!'})
        if not book:
            return jsonify({'message': 'No book found!'})
        
        book.title, book.content, book.author, book.image, book.book_publishedDate, book.book_returnDate = (
            title, content, author, image, book_publishedDate, book_returnDate
        )
        db.session.commit()
        return jsonify({'message': 'Book updated successfully!'})
    
    
    # DELETE method to delete a book (requires JWT authentication)
    @jwt_required()
    def delete(self, b_id):
        id = get_jwt_identity()
        user = User.query.filter_by(id=id).first()
        if not user:
            return jsonify({'message': 'No user found!'})
        
        role = UserRole.query.filter_by(user_id=id).first()
        if role.role_id != 1:
            return jsonify({'message': 'You are not authorized to delete book!'})
        
        book = Book.query.filter_by(id=b_id).first()
        if not book:
            return jsonify({'message': 'No book found!'})
        
        db.session.delete(book)
        db.session.commit()
        return jsonify({'message': 'Book deleted successfully!'})
    




