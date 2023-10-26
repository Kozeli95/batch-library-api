class Book {
    id: Number;
    ISBN: String;
    title: String;
    checkedOut: Boolean;

    constructor(id: Number, ISBN: String, title: String) {
        this.id = id;
        this.ISBN = ISBN;
        this.title = title;
        this.checkedOut = false;
    }
}