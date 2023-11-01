import { Book } from './book';

export class User {
    private _id: number;
    private _books: Map<number, Book>;

    constructor(id: number) {
        this._id = id;
        this._books = new Map<number, Book>();
    }

    public get id(): number {
        return this._id;
    }

    public set id(id: number) {
        this._id = id;
    }

    public get books(): Map<number, Book> {
        return this._books;
    }

    public set books(books: Map<number, Book>) {
        this._books = books;
    }
}