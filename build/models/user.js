"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(id) {
        this._id = id;
        this._books = new Map();
    }
    get id() {
        return this._id;
    }
    set id(id) {
        this._id = id;
    }
    get books() {
        return this._books;
    }
    set books(books) {
        this._books = books;
    }
}
exports.User = User;
