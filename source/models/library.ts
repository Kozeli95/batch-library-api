class Library {
    books: Book[]; // if two copies of the same book have the same internal id, change this to a dict and keep a counter going

    constructor() {
        this.books = [];
    }

    getBookById(id: Number) {
        for (var book of this.books) {
            if (book.id === id) { return book; }
        }

        throw new Error("Book with ID " + id + " does not exist in our library. Try checking out another!");
    }    
}