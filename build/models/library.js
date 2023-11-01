"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Library = void 0;
const book_1 = require("./book");
const librarian_1 = require("./librarian");
const user_1 = require("./user");
class Library {
    constructor() {
        this._books = new Map();
        this._librarians = new Map([
            [1, new librarian_1.Librarian(1)]
        ]);
        this._users = new Map([
            [2, new user_1.User(2)],
            [3, new user_1.User(3)],
            [4, new user_1.User(4)]
        ]);
    }
    get books() {
        return this._books;
    }
    set books(books) {
        this._books = books;
    }
    get librarians() {
        return this._librarians;
    }
    set librarians(librarians) {
        this._librarians = librarians;
    }
    get users() {
        return this._users;
    }
    set users(users) {
        this._users = users;
    }
    //librarian addBook post endpoint logic
    addBook(id, ISBN, title, author) {
        //check if book already exists
        if (this.books.has(id)) {
            throw new Error(`Book with ID ${id} already exists in our library.`);
        }
        let book = new book_1.Book(id, ISBN, title, author);
        this.books.set(id, book);
    }
    //librarian removeBook delete endpoint logic
    removeBook(id) {
        //check if book doesn't exist
        if (!this.books.has(id)) {
            throw new Error(`Cannot delete book with ID ${id}, as it does not exist in our library.`);
        }
        //check if book is currently checked out
        if (this.books.get(id).checkedOut) {
            throw new Error(`Cannot delete book with ID ${id}, as it is currently checked out by a user`);
        }
        this.books.delete(id);
    }
    //librarian getOverdueBooks get endpoint logic
    getOverdueBooks() {
        let overdueBooks = [];
        for (let book of this.books.values()) {
            if (book.isOverdue()) {
                overdueBooks.push(book);
            }
        }
        return overdueBooks;
    }
    //user checkoutBook put endpoint logic
    checkoutBook(bookId, userId) {
        //check if book doesn't exist
        if (!this.books.has(bookId)) {
            throw new Error(`Cannot checkout book with ID ${bookId}, as it does not exist in our library.`);
        }
        //check if user doesn't exist
        if (!this.users.has(userId)) {
            throw new Error(`User with ID ${userId} does not exist in our library.`);
        }
        let book = this.books.get(bookId);
        //check if book has already been checked out
        if (book.checkedOut) {
            throw new Error(`Book with ID ${bookId} has already been checked out.`);
        }
        let user = this.users.get(userId);
        //check if user has 3 books checked out already
        if (user.books.size >= 3) {
            throw new Error(`User with ID ${userId} cannot have more than 3 books checked out at once.`);
        }
        //check if user has an overdue book
        for (let book of user.books.values()) {
            if (book.isOverdue()) {
                throw new Error(`User with ID ${userId} has an overdue book with ID ${book.id}.`);
            }
        }
        //update book properties
        book.checkedOut = true;
        book.checkoutDate = new Date();
        book.dueDate = new Date(); //initialize due date so it's not null anymore
        book.dueDate.setDate(book.checkoutDate.getDate() + 14); //set due date to two weeks after checkout date
        //update library book map with new book properties
        this.books.set(bookId, book);
        //add book to user's book map
        user.books.set(bookId, book);
        //update library user map with new user properties
        this.users.set(userId, user);
    }
    //user returnBook put endpoint logic
    returnBook(bookId, userId) {
        //check if book doesn't exist
        if (!this.books.has(bookId)) {
            throw new Error(`Cannot checkout book with ID ${bookId}, as it does not exist in our library.`);
        }
        //check if user doesn't exist
        if (!this.users.has(userId)) {
            throw new Error(`User with ID ${userId} does not exist in our library.`);
        }
        let user = this.users.get(userId);
        let book = this.books.get(bookId);
        //check if book is not currently checked out
        if (!book.checkedOut) {
            throw new Error(`Book with ID ${bookId} is not checked out at the moment.`);
        }
        //check if book is not already checked out by user
        if (!user.books.has(bookId)) {
            throw new Error(`Book with ID ${bookId} is currently checked out, but not by user ${userId}.`);
        }
        //update book properties
        book.checkedOut = false;
        book.checkoutDate = null;
        book.dueDate = null;
        //update library book map with new book properties
        this.books.set(bookId, book);
        //remove book from user's map
        user.books.delete(bookId);
        //update library user map with new user properties
        this.users.set(userId, user);
    }
    //user getCheckedOutBooks get endpoint logic
    getCheckedOutBooks(userId) {
        if (!this.users.has(userId)) {
            throw new Error(`User with ID ${userId} does not exist in our library.`);
        }
        let books = [];
        let user = this.users.get(userId);
        for (let book of user.books.values()) {
            books.push(book);
        }
        return books;
    }
}
exports.Library = Library;
