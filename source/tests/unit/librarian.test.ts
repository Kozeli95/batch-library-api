import { Librarian } from "../../models/librarian";

describe('testing librarian ID methods', () => {
    test('librarian id should match what we pass in the constructor', () => {
        let librarian = new Librarian(1);
        expect(librarian.id).toBe(1);
    })

    test('librarian id should match what we pass in the setter', () => {
        let librarian = new Librarian(1);
        librarian.id = 2;
        expect(librarian.id).toBe(2);
    })
})