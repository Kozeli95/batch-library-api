"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
class Book {
    constructor(id, ISBN, title, author) {
        this._id = id;
        this._ISBN = ISBN;
        this._title = title;
        this._author = author;
        this._checkedOut = false;
        this._checkoutDate = null;
        this._dueDate = null;
    }
    get id() {
        return this._id;
    }
    set id(id) {
        this._id = id;
    }
    get ISBN() {
        return this._ISBN;
    }
    set ISBN(ISBN) {
        this._ISBN = ISBN;
    }
    get title() {
        return this._title;
    }
    set title(title) {
        this._title = title;
    }
    get author() {
        return this._author;
    }
    set author(author) {
        this._author = author;
    }
    get checkedOut() {
        return this._checkedOut;
    }
    set checkedOut(checkedOut) {
        this._checkedOut = checkedOut;
    }
    get checkoutDate() {
        return this._checkoutDate;
    }
    set checkoutDate(checkoutDate) {
        this._checkoutDate = checkoutDate;
    }
    get dueDate() {
        return this._dueDate;
    }
    set dueDate(dueDate) {
        this._dueDate = dueDate;
    }
    isOverdue() {
        if (this.checkedOut) {
            let date = new Date();
            return date.getTime() > this.dueDate.getTime();
        }
        return false;
    }
}
exports.Book = Book;
