const express = require('express');
const path = require('path');
const staticRouter = require('./routes/static');
const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');
const cookieParser = require('cookie-parser');
const { connectToMongoDb } = require('./connection');
const { isUserLoggedIn } = require('./middlewares/auth');

const app = express();
const PORT = 8000;

connectToMongoDb("mongodb://localhost:27017/blog-db")
.then(() => console.log("connected to mongodb"));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve('./public')));

app.use("/", staticRouter);
app.use("/user", userRouter);
app.use("/blog", isUserLoggedIn, blogRouter);

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));