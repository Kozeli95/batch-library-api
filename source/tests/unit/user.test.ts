import { User } from "../../models/user";
import { Book } from "../../models/book";

describe('testing user ID methods', () => {
    test('user id should match what we pass in the constructor', () => {
        let user = new User(2);
        expect(user.id).toBe(2);
    })

    test('user id should match what we pass in the setter', () => {
        let user = new User(2);
        user.id = 3;
        expect(user.id).toBe(3);
    })
})

describe('testing user book methods', () => {
    test('contents in user\'s books should be empty upon construction', () => {
        let user = new User(2);
        expect(user.books.size).toBe(0);
    })

    test('contents in user\'s books should match what we pass in the setter', () => {
        let user = new User(2);
        let book = new Book(1, "testISBN", "testTitle", "testAuthor");
        let bookMap = new Map<number, Book>();
        bookMap.set(1, book);
        user.books = bookMap;
        expect(user.books.size).toBe(1);
        expect(user.books.get(1)).toBeTruthy();
        expect(user.books.get(1)!.id).toBe(1);
        expect(user.books.get(1)!.ISBN).toBe("testISBN");
    })
})