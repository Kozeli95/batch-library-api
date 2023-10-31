import express from 'express';
import * as controller from '../controllers/test.controller';

const router = express.Router();

router.get('/testRoute', controller.testFunction);

router.post('/books/:isbn', controller.addBook);

router.delete('/books/:bookId', controller.removeBook);

router.get('/books/overdue', controller.getOverdueBooks);

router.put('/books/:bookId', controller.checkoutBook);

router.put('/books/:bookId', controller.returnBook);

router.get('/books/:userId', controller.getCheckedOutBooks);

export default router;