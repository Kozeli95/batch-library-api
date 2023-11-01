"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCheckedOutBooks = exports.returnBook = exports.checkoutBook = exports.getOverdueBooks = exports.removeBook = exports.addBook = void 0;
const library_1 = require("../models/library");
var library = new library_1.Library();
var counter = 1; // running counter to associate book IDs with
// validate id for each endpoint and send the appropriate message
const validateId = (res, idString, userType) => {
    if (idString === undefined) {
        res.status(403).send({
            errorMessage: `No valid ${userType} ID provided.`
        });
        return false;
    }
    else {
        const id = parseInt(idString);
        if (!library.librarians.has(id) && userType === 'librarian') {
            res.status(403).send({
                errorMessage: `No ${userType} with ID ${id}.`
            });
            return false;
        }
        else if (!library.users.has(id) && userType === 'user') {
            res.status(403).send({
                errorMessage: `No ${userType} with ID ${id}.`
            });
            return false;
        }
        return true;
    }
};
const errorMessage = (res, error) => {
    let message;
    if (error instanceof Error)
        message = error.message;
    else
        message = String(error);
    res.status(400).send({
        errorMessage: message
    });
};
// post /books/:isbn
const addBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!validateId(res, req.get('Id'), 'librarian')) {
        return;
    }
    const { isbn } = req.params;
    const { title, author } = req.body;
    try {
        library.addBook(counter, isbn, title, author);
        res.status(200).send({
            bookId: counter
        });
        counter++;
    }
    catch (e) {
        errorMessage(res, e);
    }
});
exports.addBook = addBook;
// delete /books/:bookid
const removeBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!validateId(res, req.get('Id'), 'librarian')) {
        return;
    }
    const { bookId } = req.params;
    const bookIdNumber = parseInt(bookId);
    try {
        library.removeBook(bookIdNumber);
        res.sendStatus(200);
    }
    catch (e) {
        errorMessage(res, e);
    }
});
exports.removeBook = removeBook;
// get /books/overdue
const getOverdueBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!validateId(res, req.get('Id'), 'librarian')) {
        return;
    }
    const overdueBooks = library.getOverdueBooks();
    res.status(200).send({
        overdueBooks: overdueBooks
    });
});
exports.getOverdueBooks = getOverdueBooks;
// put /books/checkout/:bookid
const checkoutBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idString = req.get('Id');
    if (!validateId(res, req.get('Id'), 'user')) {
        return;
    }
    const { bookId } = req.params;
    const bookIdNumber = parseInt(bookId);
    const userIdNumber = parseInt(idString);
    try {
        library.checkoutBook(bookIdNumber, userIdNumber);
        res.status(200).send({
            checkedOutBook: bookIdNumber
        });
    }
    catch (e) {
        errorMessage(res, e);
    }
});
exports.checkoutBook = checkoutBook;
// put /books/return/:bookid
const returnBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idString = req.get('Id');
    if (!validateId(res, req.get('Id'), 'user')) {
        return;
    }
    const { bookId } = req.params;
    const bookIdNumber = parseInt(bookId);
    const userIdNumber = parseInt(idString);
    try {
        library.returnBook(bookIdNumber, userIdNumber);
        res.status(200).send({
            returnedBook: bookIdNumber
        });
    }
    catch (e) {
        errorMessage(res, e);
    }
});
exports.returnBook = returnBook;
// get /books/checkedOutBooks
const getCheckedOutBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idString = req.get('Id');
    if (!validateId(res, req.get('Id'), 'user')) {
        return;
    }
    const userIdNumber = parseInt(idString);
    const checkedOutBooks = library.getCheckedOutBooks(userIdNumber);
    res.status(200).send({
        checkedOutBooks: checkedOutBooks
    });
});
exports.getCheckedOutBooks = getCheckedOutBooks;
