# batch-library-api

An API simulating operations you would find at a library

To run the API:
- cd into the project root directory
- run `npm install`
- run `npm run dev`

You should see a message that looks like: `The server is running on port 3000` (base url is going to be http://localhost:3000)

We are now ready to start making requests to the api.

# POST /library/books/{isbn}
- adds a new book to the library by its ISBN
- required request headers: `Id -> 1` (will return 403 forbidden if this is not provided)
- takes a request body in the form of `{ "title": ${title} (string), "author": ${author} (string) }`
- returns 200 OK on successful addition with bookId
- returns 400 otherwise

# DELETE /library/books/{bookId}
- removes a book from the library by its internal id
- required request headers: `Id -> 1` (will return 403 forbidden if this is not provided)
- returns 200 OK on succesful deletion
- returns 400 if you try to delete a book that is already checked out or does not exist in the library

# GET /library/books/overdue
- returns a list of all overdue books
- required request headers: `Id -> 1` (will return 403 forbidden if this is not provided)
- returns 200 OK with a list of all overdue books

# PUT /library/books/checkout/{bookId}
- checks out a book to the user provided in the headers
- required request headers: `Id -> IN [2, 3, 4]` (will return 403 forbidden if this is not provided)
- returns 200 OK on successful checkout with the checked out bookId
- returns 400 if you attempt to check out a non-existent book, check out a book that has already been checked out, or check out a book to a user that already has 3 books checked out

# PUT /library/books/return/{bookId}
- returns a book to the library from the user provided in the headers
- required request headers: `Id -> IN [2, 3, 4]` (will return 403 forbidden if this is not provided)
- returns 200 ok on successful return with the returned bookId
- returns 400 if you attempt to return a non-existent book, return a book that is not currently checked out, or return a book that is currently checked out to another user

# GET /library/books/checkedOut
- returns a list of checked out books for the user provided in the headers
- required request headers: `Id -> IN [2, 3, 4]` (will return 403 forbidden if this is not provided)
- returns 200 ok with a list of all books checked out by the user

# TESTING
To run tests on this project, simply run `jest` in the project root directory. If that does not work, try running `npm install jest -g` to install it globally first. 

A NOTE ON TESTING: there seems to be a bug regarding closing express servers between tests in jest and supertest (see https://github.com/ladjs/supertest/issues/520 for more info) and as a result, the API functional tests unfortunately share state which needed to be manually tracked between tests. The tests still work, but this is NOT recommended or a best practice in the real world.
