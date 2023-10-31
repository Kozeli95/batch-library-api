import { Book } from './book';
import { Librarian } from './librarian';
import { User } from './user';

export class Library {
    private _books: Map<number, Book>;
    private _librarians: Map<number, Librarian>;
    private _users: Map<number, User>;

    constructor() {
        this._books = new Map<number, Book>();
        this._librarians = new Map<number, Librarian>([
            [1, new Librarian(1)]
        ]);
        this._users = new Map<number, User>([
            [2, new User(2)],
            [3, new User(3)],
            [4, new User(4)]
        ]);
    }

    public get books(): Map<number, Book> {
        return this._books;
    }

    public set books(books: Map<number, Book>) {
        this._books = books;
    }

    public get librarians(): Map<number, Librarian> {
        return this._librarians;
    }

    public set librarians(librarians: Map<number, Librarian>) {
        this._librarians = librarians;
    }

    public get users(): Map<number, User> {
        return this._users;
    }

    public set users(users: Map<number, User>) {
        this._users = users;
    }

    //librarian addBook post endpoint logic
    public addBook(id: number, ISBN: string, title: string, author: string): void {
        //check if book already exists
        if (this.books.has(id)) {
            throw new Error(`Book with ID ${id} already exists in our library.`);
        }
        let book = new Book(id, ISBN, title, author);
        this.books.set(id, book)
    }

    //librarian removeBook delete endpoint logic
    public removeBook(id: number): void {
        //check if book doesn't exist
        if (!this.books.has(id)) {
            throw new Error(`Cannot delete book with ID ${id}, as it does not exist in our library.`);
        }

        //check if book is currently checked out
        if (this._books.get(id)!.checkedOut) {
            throw new Error(`Cannot delete book with ID ${id}, as it is currently checked out by a user`);
        }
        this.books.delete(id);
    }

    //librarian getOverdueBooks get endpoint logic
    public getOverdueBooks(): Book[] {
        let overdueBooks = [];
        for (let book of this.books.values()) {
            if (book.isOverdue()) {
                overdueBooks.push(book);
            }
        }
        return overdueBooks;
    }

    //user checkoutBook put endpoint logic
    public checkoutBook(bookId: number, userId: number): void {
        //check if book doesn't exist
        if (!this.books.has(bookId)) {
            throw new Error(`Cannot checkout book with ID ${bookId}, as it does not exist in our library.`);
        }

        //check if user doesn't exist
        if(!this.users.has(userId)) {
            throw new Error(`User with ID ${userId} does not exist in our library.`);
        }

        let user = this.users.get(userId)!;
        //check if user has 3 books checked out already
        if (user.books.length >= 3) {
            throw new Error(`User with ID ${userId} cannot have more than 3 books checked out at once.`);
        }

        //check if user has an overdue book
        for (let book of user.books) {
            if (book.isOverdue()) {
                throw new Error(`User with ID ${userId} has an overdue book with ID ${book.id}.`);
            }
        }

        let book = this.books.get(bookId)!;
        //check if book has already been checked out
        if (book.checkedOut) {
            throw new Error(`Book with ID ${bookId} has already been checked out.`);
        }

        //update book properties
        book.checkedOut = true;
        book.checkoutDate = new Date();
        book.dueDate = new Date(); //initialize due date so it's not null anymore
        book.dueDate.setDate(book.checkoutDate.getDate() + 14); //set due date to two weeks after checkout date
        book.checkedOutUser = user;

        //update library book map with new book properties
        this.books.set(bookId, book);

        //add book to user's list
        user.books.push(book);

        //update library user map with new user properties
        this.users.set(userId, user);
    }

    //user returnBook put endpoint logic
    public returnBook(bookId: number, userId: number): void {
        //check if book doesn't exist
        if (!this.books.has(bookId)) {
            throw new Error(`Cannot checkout book with ID ${bookId}, as it does not exist in our library.`);
        }

        //check if user doesn't exist
        if(!this.users.has(userId)) {
            throw new Error(`User with ID ${userId} does not exist in our library.`);
        }

        let user = this.users.get(userId)!;
        let book = this.books.get(bookId)!;
        //check if book is not currently checked out
        if (!book.checkedOut) {
            throw new Error (`Book with ID ${bookId} is not checked out at the moment.`);
        }

        //check if book is not already checked out by user
        if (book.checkedOutUser!.id !== user.id) {
            throw new Error(`Book with ID ${bookId} is currently checked out, but not by user ${userId}.`);
        }

        //update book properties
        book.checkedOut = false;
        book.checkoutDate = null;
        book.dueDate = null;
        book.checkedOutUser = null;

        //update library book map with new book properties
        this.books.set(bookId, book);

        //remove book from user's list
        user.books.forEach((bk, index) => {
            if (bk.id === bookId) {
                user.books.splice(index, 1);
            }
        });

        //update library user map with new user properties
        this.users.set(userId, user);
    }

    //user getCheckedOutBooks get endpoint logic
    public getCheckedOutBooks(userId: number): Book[] {
        if (!this.users.has(userId)) {
            throw new Error(`User with ID ${userId} does not exist in our library.`);
        }

        let user = this.users.get(userId)!;
        return user.books;
    }
}