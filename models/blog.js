const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    body: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
});

const blog = mongoose.model("blog", blogSchema);
module.exports = blog;