const request = require('supertest');
const router = require('../../server');
const path = '/library/books';
const librarianId = 1;
const userIds = [2, 3, 4];
const isbn = 'testISBN';
const title = 'testTitle';
const author = 'testAuthor';

// there is a bug with the express server not opening and closing properly after tests even when I use beforeEach() 
// and afterEach() (thus resulting in multiple tests sharing state), so we have to manually keep track of the library
// server after every test :(

describe(`POST ${path}/:isbn`, () => {
    test('It should respond with an id of a created book', async () => {
        // adding a book
        const payload = {
            "title": title,
            "author": author
        }
        const response = await request(router)
            .post(`${path}/${isbn}`)
            .send(payload)
            .set('Id', librarianId);
        expect(response.body).toEqual({
            bookId: 1
        });
        expect(response.statusCode).toBe(200);
    });

    test('It should respond with 403 forbidden because of lack of Id header', async() => {
        const payload = {
            "title": title,
            "author": author
        }
        const response = await request(router)
            .post(`${path}/${isbn}`)
            .send(payload);
        expect(response.body).toEqual({
            errorMessage: 'No valid librarian ID provided.'
        });
        expect(response.statusCode).toBe(403);
    });

    test('It should respond with 403 forbidden because of incorrect Id header', async() => {
        const payload = {
            "title": title,
            "author": author
        }
        const response = await request(router)
            .post(`${path}/${isbn}`)
            .send(payload)
            .set('Id', userIds[0]);
        expect(response.body).toEqual({
            errorMessage: `No librarian with ID ${userIds[0]}.`
        });
        expect(response.statusCode).toBe(403);
    });

    test('It should respond with 400 bad request because of missing title', async() => {
        //malformed payload
        const payload = {
            "author": author
        }
        const response = await request(router)
            .post(`${path}/${isbn}`)
            .send(payload)
            .set('Id', librarianId);
        expect(response.body).toEqual({
            errorMessage: 'Request body is missing book title.'
        });
        expect(response.statusCode).toBe(400);
    });

    test('It should respond with 400 bad request because of missing author', async() => {
        //malformed payload
        const payload = {
            "title": title
        }
        const response = await request(router)
            .post(`${path}/${isbn}`)
            .send(payload)
            .set('Id', librarianId);
        expect(response.body).toEqual({
            errorMessage: 'Request body is missing book author.'
        });
        expect(response.statusCode).toBe(400);
    });

})

describe(`DELETE ${path}/:bookId`, () => {
    test('It should respond with 200 ok, then 400 because of nonexistent book', async() => {
        // adding book
        const payload = {
            "title": title,
            "author": author
        }
        await request(router)
            .post(`${path}/${isbn}`)
            .send(payload)
            .set('Id', librarianId);

        let response = await request(router)
            .delete(`${path}/2`)
            .set('Id', librarianId);
        expect(response.statusCode).toBe(200);

        // trying to delete same book twice
        response = await request(router)
            .delete(`${path}/2`)
            .set('Id', librarianId);
        expect(response.body).toEqual({
            errorMessage: 'Cannot delete book with ID 2, as it does not exist in our library.'
        })
        expect(response.statusCode).toBe(400);
    });
})

describe(`GET ${path}/overdue`, () => {
    test('It should respond with 200 ok and an empty list of overdue books', async () => {
        const response = await request(router)
            .get(`${path}/overdue`)
            .set('Id', librarianId);
        expect(response.body).toEqual({
            overdueBooks: []
        });
        expect(response.statusCode).toBe(200);
    });
})

describe(`PUT ${path}/checkout/:bookId`, () => {
    test('It should respond with 403 forbidden because of incorrect Id header', async () => {
        const response = await request(router)
            .put(`${path}/checkout/3`)
            .set('Id', librarianId);
        expect(response.body).toEqual({
            errorMessage: `No user with ID ${librarianId}.`
        });
        expect(response.statusCode).toBe(403);
    })

    test('It should respond with 200 ok and a response with the checked out book id, then a series of 400s', async () => {
        const payload = {
            "title": title,
            "author": author
        }

        // adding 4 books
        for (let counter = 0; counter < 4; counter++) {
            await request(router)
                .post(`${path}/${isbn}`)
                .send(payload)
                .set('Id', librarianId);
        }

        //current book ID 6, counter is 7

        // checking out book 3
        let response = await request(router)
            .put(`${path}/checkout/3`)
            .set('Id', userIds[0]);
        expect(response.body).toEqual({
            checkedOutBook: 3
        });
        expect(response.statusCode).toBe(200);

        // attempting to check out the same book
        response = await request(router)
            .put(`${path}/checkout/3`)
            .set('Id', userIds[0]);
        expect(response.body).toEqual({
            errorMessage: 'Book with ID 3 has already been checked out.'
        });
        expect(response.statusCode).toBe(400);

        await request(router)
            .put(`${path}/checkout/4`)
            .set('Id', userIds[0]);

        await request(router)
            .put(`${path}/checkout/5`)
            .set('Id', userIds[0]);

        // checking to see that checking out a fourth book results in an error
        response = await request(router)
            .put(`${path}/checkout/6`)
            .set('Id', userIds[0]);
        expect(response.body).toEqual({
            errorMessage: `User with ID ${userIds[0]} cannot have more than 3 books checked out at once.`
        })
        expect(response.statusCode).toBe(400);

        // checking to see that checking out a nonexistent book results in an error
        response = await request(router)
            .put(`${path}/checkout/9`)
            .set('Id', userIds[1]);
        expect(response.body).toEqual({
            errorMessage: 'Cannot checkout book with ID 9, as it does not exist in our library.'
        })
        expect(response.statusCode).toBe(400);
    })
})

describe(`PUT ${path}/return/:bookId`, () => {
    test('It should respond with 200 ok and a response with the returned book id, then a series of 400s', async() => {
        const payload = {
            "title": title,
            "author": author
        }

        // adding book
        await request(router)
            .post(`${path}/${isbn}`)
            .send(payload)
            .set('Id', librarianId);
        

        //current book ID 7, counter is 8

        // checking out book 7
        await request(router)
            .put(`${path}/checkout/7`)
            .set('Id', userIds[1]);

        let response = await request(router)
            .put(`${path}/return/7`)
            .set('Id', userIds[1]);
        expect(response.body).toEqual({
            returnedBook: 7
        });
        expect(response.statusCode).toBe(200);

        // attempting to return book 7 again
        response = await request(router)
            .put(`${path}/return/7`)
            .set('Id', userIds[1]);
        expect(response.body).toEqual({
            errorMessage: 'Book with ID 7 is not checked out at the moment.'
        });
        expect(response.statusCode).toBe(400);

        await request(router)
            .put(`${path}/checkout/7`)
            .set('Id', userIds[1]);
        
        // attempting to return book 7 with a user other than who checked it out
        response = await request(router)
            .put(`${path}/return/7`)
            .set('Id', userIds[2]);
        expect(response.body).toEqual({
            errorMessage: `Book with ID 7 is currently checked out, but not by user ${userIds[2]}.`
        });
        expect(response.statusCode).toBe(400);

        // checking to see that returning a nonexistent book results in an error
        response = await request(router)
            .put(`${path}/return/9`)
            .set('Id', userIds[1]);
        expect(response.body).toEqual({
            errorMessage: 'Cannot return book with ID 9, as it does not exist in our library.'
        })
        expect(response.statusCode).toBe(400);
    })
})

describe(`GET ${path}/checkedOut`, () => {
    test('It should reponse with 200 ok and a response with all of the user\'s checked out books', async () => {
        const payload = {
            "title": title,
            "author": author
        }

        // add book
        await request(router)
            .post(`${path}/${isbn}`)
            .send(payload)
            .set('Id', librarianId);
        
        // current book ID 8, counter is 9
        
        // check out book
        await request(router)
            .put(`${path}/checkout/8`)
            .set('Id', userIds[2]);

        const response = await request(router)
            .get(`${path}/checkedOut`)
            .set('Id', userIds[2]);
        expect(response.body).toEqual({
            checkedOutBooks: [
                {
                    title: title,
                    author: author,
                    ISBN: isbn
                }
            ]
        })
        expect(response.statusCode).toBe(200);
    })
})