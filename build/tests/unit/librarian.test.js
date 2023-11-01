"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const librarian_1 = require("../../models/librarian");
describe('testing librarian ID creation', () => {
    test('librarian id should match what we pass in the constructor', () => {
        let librarian = new librarian_1.Librarian(1);
        expect(librarian.id).toBe(1);
    });
});
