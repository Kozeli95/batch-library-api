import express from 'express';
import test from './test';

/* librarian endpoints */
// post /books endpoint to add book NEEDS TO BE ADDED BY ISBN, CAN JUST INCREMENT ID COUNTER TO CREATE THE BOOK ITSELF
// delete /books/bookId endpoint to remove book NEEDS TO BE REMOVED BY INTERNAL ID
// get /books/overdue endpoint to generate list of overdue books

/* user end points */
// put /books/bookId endpoint to check out a book (because we are updating a book's status)
// put /books/bookId endpoint to return a checked out book
// get /books/userId endpoint to generate list of checked out books for said user

const router = express.Router();

router.use('/test', test);

export default router;