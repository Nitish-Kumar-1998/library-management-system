from flask_security import UserMixin, RoleMixin
from flask_sqlalchemy import SQLAlchemy
import datetime

db = SQLAlchemy()


#model for roles
class Role(db.Model, RoleMixin):                                                  
    __tablename__ = 'roles'
    id = db.Column(db.Integer(), primary_key=True, autoincrement=True)           
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))


#model for user roles
class UserRole(db.Model):
    __tablename__ = 'user_roles'
    id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('users.id', ondelete='CASCADE'))
    role_id = db.Column(db.Integer(), db.ForeignKey('roles.id', ondelete='CASCADE'))


#model for user
class User(db.Model, UserMixin):                 
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)                  
    username = db.Column(db.String(255), unique=True)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    last_visited = db.Column(db.DateTime(), default=datetime.datetime.now(), nullable=True)
    fs_uniquifier = db.Column(db.String(255), unique=True)
    roles = db.relationship('Role', secondary='user_roles', backref=db.backref('users', lazy='dynamic'))
    
#model for sections
class Section(db.Model):
    __tablename__ = 'sections'
    id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    image = db.Column(db.String, nullable=True)
    section_createdDate = db.Column(db.DateTime(), default=datetime.datetime.now(), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    books = db.relationship('Book', backref='section', lazy='dynamic', cascade='all, delete-orphan')

#model for books
class Book(db.Model):
    __tablename__ = 'books'
    id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), unique=True, nullable=False)
    content= db.Column(db.String, nullable=False)
    author = db.Column(db.String(255), nullable=False)
    image = db.Column(db.String, nullable=True)
    book_publishedDate = db.Column(db.DateTime(), default=datetime.datetime.now(), nullable=False)
    book_returnDate = db.Column(db.DateTime(), default=datetime.datetime.now(), nullable=True)
    section_id = db.Column(db.Integer(), db.ForeignKey('sections.id', ondelete='CASCADE'))


#model for book requests 
class BookRequest(db.Model):
    __tablename__ = 'book_requests'
    id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('users.id', ondelete='CASCADE'))
    book_id = db.Column(db.Integer(), db.ForeignKey('books.id', ondelete='CASCADE'))
    book_requestDate = db.Column(db.DateTime(), default=datetime.datetime.now(), nullable=False)
    request_returnDate = db.Column(db.DateTime(), default=datetime.datetime.now(), nullable=False)
    request_status = db.Column(db.String(255), nullable=False, default='pending')
    user = db.relationship('User', backref=db.backref('book_requests', lazy='dynamic'))
    book = db.relationship('Book', backref=db.backref('book_requests', lazy='dynamic'))
  


#model for ratings
class Rating(db.Model):
    __tablename__ = 'ratings'
    id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    rating = db.Column(db.Integer(), nullable=False)
    book_comment = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer(), db.ForeignKey('users.id', ondelete='CASCADE'))
    book_id = db.Column(db.Integer(), db.ForeignKey('books.id', ondelete='CASCADE'))
    rate_date = db.Column(db.DateTime(), default=datetime.datetime.now(), nullable=False)
    user = db.relationship('User', backref=db.backref('ratings', lazy='dynamic'))
    book = db.relationship('Book', backref=db.backref('ratings', lazy='dynamic'))
