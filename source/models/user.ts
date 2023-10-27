class User {
    private _id: number;
    private _books: Book[];

    constructor(id: number) {
        this._id = id;
        this._books = [];
    }

    public get id(): number {
        return this._id;
    }

    public set id(id: number) {
        this._id = id;
    }

    public get books(): Book[] {
        return this._books;
    }

    public set books(books: Book[]) {
        this._books = books;
    }
}