const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS");

    next();
})

app.post('/api/posts', (req, res, next) => {
    const post = new Post({title : req.body.title, content : req.body.content});
    console.log(post);
    post.save();

    res.status(201).json({
        message: "Post API Success!"
    });
})

app.use('/api/posts', (req, res, next) => {
    Post.find()
    .then((docs) => {
        res.status(200).json({
            message: "GET API success!",
            posts: docs
        });
    })
    .catch(() => {

    });
});

module.exports = app;