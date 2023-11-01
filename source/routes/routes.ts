import express from 'express';
import * as controller from '../controllers/library.controller';

const router = express.Router();

router.get('/testRoute', controller.testFunction);

router.post('/books/:isbn', controller.addBook);

router.delete('/books/:bookId', controller.removeBook);

router.get('/books/overdue', controller.getOverdueBooks);

router.put('/books/checkout/:bookId', controller.checkoutBook);

router.put('/books/return/:bookId', controller.returnBook);

router.get('/books/checkedOut', controller.getCheckedOutBooks);

export default router;