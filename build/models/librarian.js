"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Librarian = void 0;
class Librarian {
    constructor(id) {
        this._id = id;
    }
    get id() {
        return this._id;
    }
    set id(id) {
        this._id = id;
    }
}
exports.Librarian = Librarian;
