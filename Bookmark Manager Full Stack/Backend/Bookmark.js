const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
    userId: String,
    title: String,
    bookmarks: [{ id: Number, name: String, url: String }]
});

module.exports = mongoose.model('Bookmark', BookmarkSchema);
