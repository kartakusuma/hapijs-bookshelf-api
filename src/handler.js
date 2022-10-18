const {nanoid} = require('nanoid')
const books = require('./bookshelf')

const bookshelfIndex = (req, h) => {
    const { name, reading, finished } = req.query
    let bookData = books

    if (name !== undefined) {
        bookData = bookData.filter((b) => b.name.toLowerCase().includes(name.toLowerCase()))
    }

    if (finished !== undefined) {
        bookData = bookData.filter((b) => b.finished === !!Number(finished))
    }

    if (reading !== undefined) {
        bookData = bookData.filter((b) => b.reading === !!Number(reading))
    }

    return h.response({
        status: 'success',
        data: {
            books: bookData.map((b) => ({
                id: b.id,
                name: b.name,
                publisher: b.publisher,
            })),
        },
    }).code(200)
}

const storeBook = (req, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = req.payload

    if (name === undefined) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        }).code(400)
    }
    
    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400)
    }

    const id = nanoid(16)
    const finished = (readPage === pageCount)
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt

    const newBookData = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    }

    books.push(newBookData)

    const isBookDataAdded = books.filter((b) => b.id === id).length > 0

    if (isBookDataAdded) {
        return h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        }).code(201)
    }

    return h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    }).code(500)
}

const showBook = (req, h) => {
    const { id } = req.params
    const book = books.filter((b) => b.id === id)[0]
  
    if (book !== undefined) {
        return h.response({
            status: 'success',
            data: {
                book,
            },
        }).code(200)
    }
  
    return h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    }).code(404)
}

const updateBook = (req, h) => {
    const { id } = req.params
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = req.payload
  
    if (name === undefined) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        }).code(400)
    }
  
    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400)
    }
  
    const bookIndex = books.findIndex((b) => b.id === id)
  
    if (bookIndex !== -1) {
        const finished = (readPage === pageCount)
        const updatedAt = new Date().toISOString()
    
        books[bookIndex] = {
            ...books[bookIndex],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            updatedAt,
        }
    
        return h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        }).code(200)
    }
  
    return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404)
}
  
const destroyBook = (req, h) => {
    const { id } = req.params
    const bookIndex = books.findIndex((b) => b.id === id)
  
    if (bookIndex !== -1) {
        books.splice(bookIndex, 1)
  
        return h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        }).code(200)
    }
  
    return h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404) 
}

module.exports = {
    bookshelfIndex,
    storeBook,
    showBook,
    updateBook,
    destroyBook
}