const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blog",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
});

const comment = mongoose.model("comment", commentSchema);
module.exports = comment;