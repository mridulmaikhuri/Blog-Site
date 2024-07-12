const express = require('express');
const blog = require('../models/blog');
const comment = require("../models/comment");
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + '-' + file.originalname)
    }
})
  
const upload = multer({ storage: storage })

const router = express.Router();

router.post('/upload', upload.single('photo'), async (req, res) => {
    const {title,body} = req.body;
    if (!title || !body) return res.status(400).json({msg: "title or body missing"});

    //console.log("Trying to upload file");
    try {
        const entry = await blog.create({
            title,
            image: `/uploads/${req.file.filename}`,
            body,
            createdBy: req.user._id
        });
        //console.log("Uploaded Successfully");
        return res.redirect(`/blog/${entry._id}`);
    } catch (error) {
        return res.status(400).json({msg: "some error occured while creating the blog"})
    }
});

router.get('/:blogId', async (req, res) => {
    const blogId = req.params.blogId;
    const entry = await blog.findOne({_id: blogId}).populate("createdBy");
    const comments = await comment.find({blogId}).populate("userId");
    return res.render("showBlog", {
        user: req.user,
        blog: entry,
        comments
    })
})

router.post("/comment/:blogId", async (req, res) => {
    try {
        await comment.create({
            content: req.body.comment,
            userId: req.user._id,
            blogId: req.params.blogId
        });
    } catch (err) {
        alert("some error occured!! Please try again");
    }
    return res.redirect(`/blog/${req.params.blogId}`);
})

module.exports = router;