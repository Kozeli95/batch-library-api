import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import { Library } from '../models/library';

var library = new Library();
var counter = 1;

export const testFunction = async (req: Request, res: Response, next: NextFunction) => {
    let result: AxiosResponse = await axios.get('https://jsonplaceholder.typicode.com/todos/1')
    return res.send(result.data)
};

// post /books/:isbn
export const addBook = async (req: Request, res: Response) => {
    try {
        const { isbn } = req.params;
        const { title, author } = req.body;
        library.addBook(counter, isbn, title, author);
        counter++;
        res.sendStatus(200);
    } catch (e) {
        res.status(400).send(e);
    }
};

// delete /books/:bookid
export const removeBook = async (req: Request, res: Response) => {
    try {
        const { bookId } = req.params;
        library.removeBook(parseInt(bookId));
        res.sendStatus(200);
    } catch (e) {
        res.status(400).send(e);
    }
};

// get /books/overdue
export const getOverdueBooks = async (req: Request, res: Response) => {
    const overdueBooks = library.getOverdueBooks();
    res.status(200).send({
        overdueBooks: overdueBooks
    });
};

// put /books/:bookid
export const checkoutBook = async (req: Request, res: Response) => {
    try {
        const { bookId } = req.params;
        const { userId } = req.body;
        library.checkoutBook(parseInt(bookId), parseInt(userId));
        res.sendStatus(200);
    } catch (e) {
        res.status(400).send(e);
    }
};

// put /books/:bookid
export const returnBook = async (req: Request, res: Response) => {
    try {
        const { bookId } = req.params;
        const { userId } = req.body;
        library.returnBook(parseInt(bookId), parseInt(userId));
        res.sendStatus(200);
    } catch (e) {
        res.status(400).send(e);
    }
};

// get /books/:userid
export const getCheckedOutBooks = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const checkedOutBooks = library.getCheckedOutBooks(parseInt(userId));
    res.status(200).send({
        checkedOutBooks: checkedOutBooks
    });
};