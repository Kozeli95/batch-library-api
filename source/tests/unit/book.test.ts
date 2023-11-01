import { Book } from "../../models/book";

describe('testing book constructor', () => {
    test('book properties should match default values and values passed in the constructor', () => {
        let book = new Book(1, "testISBN", "testTitle", "testAuthor");
        expect(book.id).toBe(1);
        expect(book.ISBN).toBe("testISBN");
        expect(book.title).toBe("testTitle");
        expect(book.author).toBe("testAuthor");
        expect(book.checkedOut).toBe(false);
        expect(book.checkoutDate).toBeNull();
        expect(book.dueDate).toBeNull();
    })
})

describe('testing book setters', () => {
    test('book values should equal what we set them to', () => {
        let book = new Book(1, "testISBN", "testTitle", "testAuthor");
        book.id = 2;
        book.ISBN = "anotherTestISBN";
        book.title = "anotherTestTitle";
        book.author = "anotherTestAuthor";
        book.checkedOut = true;
        book.checkoutDate = new Date();
        book.dueDate = new Date();
        expect(book.id).toBe(2);
        expect(book.ISBN).toBe("anotherTestISBN");
        expect(book.title).toBe("anotherTestTitle");
        expect(book.author).toBe("anotherTestAuthor");
        expect(book.checkedOut).toBe(true);
        expect(book.checkoutDate).toBeInstanceOf(Date);
        expect(book.dueDate).toBeInstanceOf(Date);
    })
})

describe('testing book overdue method', () => {
    test('setting a book\'s due date after its checkout date should make it not overdue', () => {
        let book = new Book(1, "testISBN", "testTitle", "testAuthor");
        book.checkedOut = true;
        book.checkoutDate = new Date();
        book.dueDate = new Date();
        book.dueDate.setDate(book.checkoutDate.getDate() + 14);
        let overdue = book.isOverdue();
        expect(overdue).toBe(false);
    })

    test('setting a book\'s due date before the current date should make it overdue', () => {
        let book = new Book(1, "testISBN", "testTitle", "testAuthor");
        book.checkedOut = true;
        book.checkoutDate = new Date();
        book.dueDate = new Date();
        book.dueDate.setDate(book.checkoutDate.getDate() - 1);
        let overdue = book.isOverdue();
        expect(overdue).toBe(true);
    })

    test('never setting a book\'s checkedOut property to true should make it not overdue', () => {
        let book = new Book(1, "testISBN", "testTitle", "testAuthor");
        book.checkoutDate = new Date();
        book.dueDate = new Date();
        book.dueDate.setDate(book.checkoutDate.getDate() - 1);
        let overdue = book.isOverdue();
        expect(overdue).toBe(false);
    })
})