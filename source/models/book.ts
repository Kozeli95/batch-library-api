class Book {
    private _id: number;
    private _ISBN: string;
    private _title: string;
    private _author: string;
    private _checkedOut: boolean;
    private _checkedOutUser: User | null;
    private _checkoutDate: Date | null;
    private _dueDate: Date | null;

    constructor(id: number, ISBN: string, title: string, author: string) {
        this._id = id;
        this._ISBN = ISBN;
        this._title = title;
        this._author = author;
        this._checkedOut = false;
        this._checkedOutUser = null;
        this._checkoutDate = null;
        this._dueDate = null;
    }

    public get id(): number {
        return this._id;
    }

    public set id(id: number) {
        this._id = id;
    }

    public get ISBN(): string {
        return this._ISBN;
    }

    public set ISBN(ISBN: string) {
        this._ISBN = ISBN;
    }

    public get title(): string {
        return this._title;
    }

    public set title(title: string) {
        this._title = title;
    }

    public get author(): string {
        return this._author;
    }

    public set author(author: string) {
        this._author = author;
    }

    public get checkedOut(): boolean {
        return this._checkedOut;
    }

    public set checkedOut(checkedOut: boolean) {
        this._checkedOut = checkedOut;
    }

    public get checkedOutUser(): User | null {
        return this._checkedOutUser;
    }

    public set checkedOutUser(checkedOutUser: User | null) {
        this._checkedOutUser = checkedOutUser;
    }

    public get checkoutDate(): Date | null{
        return this._checkoutDate;
    }

    public set checkoutDate(checkoutDate: Date | null) {
        this._checkoutDate = checkoutDate;
    }

    public get dueDate(): Date | null {
        return this._dueDate;
    }

    public set dueDate(dueDate: Date | null) {
        this._dueDate = dueDate;
    }

    public isOverdue(): boolean {
        if (this.checkoutDate !== null && this.dueDate !== null) {
            let date = new Date();
            return date.getTime() > this.dueDate.getTime();
        }
        return false;
    }
}