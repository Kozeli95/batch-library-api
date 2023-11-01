import { Request, Response, NextFunction, response } from 'express';
import axios, { AxiosResponse } from 'axios';
import { Library } from '../models/library';

var library = new Library();
var counter = 1; // running counter to associate book IDs with

export const testFunction = async (req: Request, res: Response, next: NextFunction) => {
    let result: AxiosResponse = await axios.get('https://jsonplaceholder.typicode.com/todos/1')
    return res.send(result.data)
};

// validate id for each endpoint and send the appropriate message
const validateId = (res: Response, idString: string | undefined, userType: string) => {
    if (idString === undefined) {
        res.status(403).send({
            errorMessage: `No valid ${userType} ID provided.`
        });
        return false;
    } else {
        const id = parseInt(idString)
        if (!library.librarians.has(id) && userType === 'librarian') {
            res.status(403).send({
                errorMessage: `No ${userType} with ID ${id}.`
            });
            return false;
        } else if (!library.users.has(id) && userType === 'user') {
            res.status(403).send({
                errorMessage: `No ${userType} with ID ${id}.`
            });
            return false;
        }
        return true;
    }
}

const errorMessage = (res: Response, error: unknown) => {
    let message;
    if (error instanceof Error) message = error.message;
    else message = String(error);
    res.status(409).send({
        errorMessage: message
    });
}

// post /books/:isbn
export const addBook = async (req: Request, res: Response) => {
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
    } catch (e) {
        errorMessage(res, e);
    }
};

// delete /books/:bookid
export const removeBook = async (req: Request, res: Response) => {
    if (!validateId(res, req.get('Id'), 'librarian')) {
        return;
    }

    const { bookId } = req.params;
    const bookIdNumber = parseInt(bookId);

    try {
        library.removeBook(bookIdNumber);
        res.sendStatus(200);
    } catch (e) {
        errorMessage(res, e);
    }
};

// get /books/overdue
export const getOverdueBooks = async (req: Request, res: Response) => {
    if (!validateId(res, req.get('Id'), 'librarian')) {
        return;
    }

    const overdueBooks = library.getOverdueBooks();
    res.status(200).send({
        overdueBooks: overdueBooks
    });
};

// put /books/checkout/:bookid
export const checkoutBook = async (req: Request, res: Response) => {
    const idString = req.get('Id');
    if (!validateId(res, req.get('Id'), 'user')) {
        return;
    }

    const { bookId } = req.params;
    const bookIdNumber = parseInt(bookId);
    const userIdNumber = parseInt(idString!);

    try {
        library.checkoutBook(bookIdNumber, userIdNumber);
        res.sendStatus(200);
    } catch (e) {
        errorMessage(res, e);
    }
};

// put /books/return/:bookid
export const returnBook = async (req: Request, res: Response) => {
    const idString = req.get('Id');
    if (!validateId(res, req.get('Id'), 'user')) {
        return;
    }

    const { bookId } = req.params;
    const bookIdNumber = parseInt(bookId);
    const userIdNumber = parseInt(idString!);
    
    try {
        library.returnBook(bookIdNumber, userIdNumber);
        res.sendStatus(200);
    } catch (e) {
        errorMessage(res, e);
    }
};

// get /books/checkedOutBooks
export const getCheckedOutBooks = async (req: Request, res: Response) => {
    const idString = req.get('Id');
    if (!validateId(res, req.get('Id'), 'user')) {
        return;
    }

    const userIdNumber = parseInt(idString!);
    const checkedOutBooks = library.getCheckedOutBooks(userIdNumber);
    res.status(200).send({
        checkedOutBooks: checkedOutBooks
    });
};