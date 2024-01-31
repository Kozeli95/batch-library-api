import { Library } from "../../models/library";
import { User } from "../../models/user";
import { Librarian } from "../../models/librarian";
import { Book } from "../../models/book";

describe('testing library constructor', () => {
    test('library should have an empty books map and prepopulated users and librarians maps', () => {
        let library = new Library();
        expect(library.books.size).toBe(0);
        expect(library.librarians.size).toBe(1);
        expect(library.librarians.get(1)).toBeInstanceOf(Librarian);
        expect(library.users.size).toBe(3);
        expect(library.users.get(2)).toBeInstanceOf(User);
        expect(library.users.get(3)).toBeInstanceOf(User);
        expect(library.users.get(4)).toBeInstanceOf(User);
    })
})

describe('testing library getters and setters', () => {
    test('library\'s books should match what we pass through the setter', () => {
        let library = new Library();
        let book = new Book(1, "testISBN", "testTitle", "testAuthor");
        let bookMap = new Map<number, Book>();
        bookMap.set(1, book);
        library.books = bookMap;
        expect(library.books.size).toBe(1);
        expect(library.books.get(1)).toBeInstanceOf(Book);
        expect(library.books.get(1)).toEqual(book);
    })

    test('library\'s users should match what we pass through the setter', () => {
        let library = new Library();
        let user = new User(6);
        let userMap = new Map<number, User>();
        userMap.set(6, user);
        library.users = userMap;
        expect(library.users.size).toBe(1);
        expect(library.users.get(1)).toBeUndefined();
        expect(library.users.get(6)).toBeInstanceOf(User);
        expect(library.users.get(6)).toEqual(user);
    })

    test('library\'s librarians should match what we pass through the setter', () => {
        let library = new Library();
        let librarian = new Librarian(5);
        let librarian2 = new Librarian(6);
        let librarianMap = new Map<number, Librarian>();
        librarianMap.set(5, librarian);
        librarianMap.set(6, librarian2);
        library.librarians = librarianMap;
        expect(library.librarians.size).toBe(2);
        expect(library.librarians.get(1)).toBeUndefined();
        expect(library.librarians.get(5)).toBeInstanceOf(Librarian);
        expect(library.librarians.get(6)).toBeInstanceOf(Librarian);
        expect(library.librarians.get(5)).toEqual(librarian);
        expect(library.librarians.get(6)).toEqual(librarian2);
    })
})

describe('testing library addBook() method', () => {
    test('adding a book that does not already exist should successfully add it to the library', () => {
        let library = new Library();
        library.addBook(1, "testISBN", "testTitle", "testAuthor");
        expect(library.books.size).toBe(1);
        expect(library.books.get(1)).toBeInstanceOf(Book);
        expect(library.books.get(1)!.id).toBe(1);
        expect(library.books.get(1)!.ISBN).toBe("testISBN");
        expect(library.books.get(1)!.title).toBe("testTitle");
        expect(library.books.get(1)!.author).toBe("testAuthor");
        expect(library.books.get(1)!.checkedOut).toBe(false);
        expect(library.books.get(1)!.checkoutDate).toBeNull();
        expect(library.books.get(1)!.dueDate).toBeNull();
    })

    test('adding a book with the same id twice should throw an error', () => {
        let library =  new Library();
        library.addBook(1, "testISBN", "testTitle", "testAuthor");
        expect(() => { library.addBook(1, "testISBN", "testTitle", "testAuthor"); }).toThrow(Error);
    })
})

describe('testing library removeBook() method,', () => {
    test('removing an existing book by id should successfully remove it from the library', () => {
        let library = new Library();
        library.addBook(1, "testISBN", "testTitle", "testAuthor");
        library.removeBook(1);
        expect(library.books.size).toBe(0);
        expect(library.books.get(1)).toBeUndefined();
    })

    test('removing a book that does not exist should throw an error', () => {
        let library = new Library();
        expect(() => { library.removeBook(1); }).toThrow(Error);
    })

    test('removing an existing book that is checked out should throw an error', () => {
        let library = new Library();
        library.addBook(1, "testISBN", "testTitle", "testAuthor");
        let book = library.books.get(1);
        book!.checkedOut = true;
        library.books.set(1, book!);
        expect(() => { library.removeBook(1); }).toThrow(Error);
    })
})

describe('testing library getOverdueBooks() method', () => {
    test('calling getOverdueBooks() should only return the books that are overdue', () => {
        let library = new Library();
        library.addBook(1, "testISBN", "testTitle", "testAuthor");
        library.addBook(2, "testISBN2", "testTitle2", "testAuthor2");
        library.addBook(3, "testISBN3", "testTitle3", "testAuthor3");

        let book = library.books.get(1);
        let book2 = library.books.get(2);
        let book3 = library.books.get(3);

        book!.checkedOut = true;
        book!.checkoutDate = new Date();
        book!.dueDate = new Date();
        book!.dueDate.setDate(book!.checkoutDate.getDate() - 1)
        library.books.set(1, book!);

        book2!.checkedOut = true;
        book2!.checkoutDate = new Date();
        book2!.dueDate = new Date();
        book2!.dueDate.setDate(book2!.checkoutDate.getDate() - 1)
        library.books.set(2, book2!);

        book3!.checkedOut = true;
        book3!.checkoutDate = new Date();
        book3!.dueDate = new Date();
        book3!.dueDate.setDate(book3!.checkoutDate.getDate() + 1) //setting this one to never be overdue
        library.books.set(3, book3!);

        let overdueBooks = library.getOverdueBooks();
        expect(overdueBooks.length).toBe(2);
        expect(overdueBooks[0]).toEqual(book);
        expect(overdueBooks[1]).toEqual(book2);
    })
})

describe('testing library checkoutBook() method', () => {
    test('checking out a book (happy path) should update the library and the user accordingly', () => {
        let library = new Library();
        library.addBook(1, "testISBN", "testTitle", "testAuthor");
        library.checkoutBook(1, 2);

        let book = library.books.get(1);
        let user = library.users.get(2);
        let dueDate = new Date();
        dueDate.setDate(book!.checkoutDate!.getDate() + 14)
        expect(book!.checkedOut).toBe(true);
        expect(book!.checkoutDate).toBeInstanceOf(Date);
        expect(book!.dueDate).toBeInstanceOf(Date);
        expect(book!.dueDate!.getDate()).toBe(dueDate.getDate());

        expect(user!.books.size).toBe(1);
        expect(user!.books.get(1)).toEqual(book);

        expect(library.users.get(2)!.books).toEqual(user!.books);
    })

    test('checking out a nonexistent book should throw an error', () => {
        let library = new Library();
        expect(() => { library.checkoutBook(1, 2); }).toThrow(Error);
    })

    test('checking out a book with a nonexistent user should throw an error', () => {
        let library = new Library();
        library.addBook(1, "testISBN", "testTitle", "testAuthor");
        expect(() => { library.checkoutBook(1, 1); }).toThrow(Error);
    })

    test('checking out an already-checked-out book should throw an error', () => {
        let library = new Library();
        library.addBook(1, "testISBN", "testTitle", "testAuthor");
        library.checkoutBook(1, 2);
        expect(() => { library.checkoutBook(1, 2); }).toThrow(Error);
    })

    test('a user with 3 books trying to check out another book should throw an error', () => {
        let library = new Library();
        library.addBook(1, "testISBN", "testTitle", "testAuthor");
        library.addBook(2, "testISBN2", "testTitle2", "testAuthor2");
        library.addBook(3, "testISBN3", "testTitle3", "testAuthor3");
        library.addBook(4, "testISBN4", "testTitle4", "testAuthor4");

        library.checkoutBook(1, 2);
        library.checkoutBook(2, 2);
        library.checkoutBook(3, 2);
        expect(() => { library.checkoutBook(4, 2); }).toThrow(Error);
    })

    test('a user with an overdue book trying to check out another book should throw an error', () => {
        let library = new Library();
        library.addBook(1, "testISBN", "testTitle", "testAuthor");
        library.addBook(2, "testISBN2", "testTitle2", "testAuthor2");

        library.checkoutBook(1, 2);
        let user = library.users.get(2);
        let book = user!.books.get(1);
        let dueDate = new Date();
        dueDate.setDate(book!.checkoutDate!.getDate() - 1);
        book!.dueDate! = dueDate;
        user!.books.set(1, book!);
        expect(() => { library.checkoutBook(2, 2); }).toThrow(Error);
    })
})

describe('testing library returnBook() method', () => {
    test('returning a book (happy path) should update the library and the user accordingly', () => {
        let library = new Library();
        library.addBook(1, "testISBN", "testTitle", "testAuthor");
        library.checkoutBook(1, 2);

        let book = library.books.get(1);
        let user = library.users.get(2);
        let dueDate = new Date();
        dueDate.setDate(book!.checkoutDate!.getDate() + 14)
        expect(book!.checkedOut).toBe(true);
        expect(book!.checkoutDate).toBeInstanceOf(Date);
        expect(book!.dueDate).toBeInstanceOf(Date);
        expect(book!.dueDate!.getDate()).toBe(dueDate.getDate());

        expect(user!.books.size).toBe(1);
        expect(user!.books.get(1)).toEqual(book);

        expect(library.users.get(2)!.books).toEqual(user!.books);

        library.returnBook(1, 2);

        book = library.books.get(1);
        user = library.users.get(2);
        expect(book!.checkedOut).toBe(false);
        expect(book!.checkoutDate).toBeNull();
        expect(book!.dueDate).toBeNull();

        expect(user!.books.size).toBe(0);

        expect(library.users.get(2)!.books).toEqual(user!.books);
    })

    test('returning a nonexistent book should throw an error', () => {
        let library = new Library();
        expect(() => { library.returnBook(1, 2); }).toThrow(Error);
    })

    test('returning a book from a nonexistent user should throw an error', () => {
        let library = new Library();
        library.addBook(1, "testISBN", "testTitle", "testAuthor");

        expect(() => { library.returnBook(1, 6); }).toThrow(Error);
    })

    test('returning a book that is not currently checked out should throw an error', () => {
        let library = new Library();
        library.addBook(1, "testISBN", "testTitle", "testAuthor");

        expect(() => { library.returnBook(1, 2); }).toThrow(Error);
    })

    test('a user trying to return a book they never checked out should throw an error', () => {
        let library = new Library();
        library.addBook(1, "testISBN", "testTitle", "testAuthor");
        library.addBook(2, "testISBN2", "testTitle2", "testAuthor2");

        library.checkoutBook(1, 2);
        library.checkoutBook(2, 3);

        expect(() => { library.returnBook(1, 3); }).toThrow(Error);
        expect(() => { library.returnBook(2, 2); }).toThrow(Error);
    })
})

describe('testing library getCheckedOutBooks() method', () => {
    test('a user with no checked out books should return an empty list', () => {
        let library = new Library();

        expect(library.getCheckedOutBooks(2).length).toBe(0);
    })

    test('a user with books checked out should return a list of said books', () => {
        let library = new Library();
        library.addBook(1, "testISBN", "testTitle", "testAuthor");
        library.addBook(2, "testISBN2", "testTitle2", "testAuthor2");
        library.addBook(3, "testISBN3", "testTitle3", "testAuthor3");;

        library.checkoutBook(1, 2);
        library.checkoutBook(2, 2);
        library.checkoutBook(3, 3);

        let book = library.books.get(1);
        let book2 = library.books.get(2);
        let book3 = library.books.get(3);

        expect(library.getCheckedOutBooks(2).length).toBe(2);
        expect(library.getCheckedOutBooks(2)[0]).toEqual(book);
        expect(library.getCheckedOutBooks(2)[1]).toEqual(book2);

        expect(library.getCheckedOutBooks(3).length).toBe(1);
        expect(library.getCheckedOutBooks(3)[0]).toEqual(book3);
    })

    test('getting the checked out books of a nonexistent user should throw an error', () => {
        let library = new Library();
        
        expect(() => { library.getCheckedOutBooks(1); }).toThrow(Error);
    })
})