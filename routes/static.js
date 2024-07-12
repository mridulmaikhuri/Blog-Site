const express = require('express');
const { isUserLoggedIn } = require('../middlewares/auth');
const blog = require("../models/blog");
const user = require('../models/user');

const router = express.Router();

router.get("/", isUserLoggedIn, async (req, res) => {
    const allBlogs = await blog.find({});
    return res.render("home", {
        user: req.user,
        allBlogs
    });
});
router.get("/login", async (req, res) => {
    return res.render("login");
});
router.get("/signup", async (req, res) => {
    return res.render("signup");
})
router.get("/add-blog", isUserLoggedIn, async (req, res) => {
    return res.render("addBlog", {
        user: req.user,
    });
})
router.get("/my-post", isUserLoggedIn, async (req, res) => {
    const myBlogs = await blog.find({createdBy: req.user._id});
    return res.render("myPost", {
        user: req.user,
        myBlogs
    });
})

module.exports = router;