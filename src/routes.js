const {
    bookshelfIndex,
    storeBook,
    showBook,
    updateBook,
    destroyBook
} = require('./handler')

const routes = [
    {
        method: 'GET',
        path: '/books',
        handler: bookshelfIndex,
    },
    {
        method: 'POST',
        path: '/books',
        handler: storeBook,
    },
    {
        method: 'GET',
        path: '/books/{id}',
        handler: showBook,
    },
    {
        method: 'PUT',
        path: '/books/{id}',
        handler: updateBook,
    },
    {
        method: 'DELETE',
        path: '/books/{id}',
        handler: destroyBook,
    },
]

module.exports = routes