const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.use(express.static("public"));

// mongodb connection...
const url = "mongodb://localhost:27017/wikiDB";
mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true});

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

// variables for use...
let successfulMessage = "";

app.get("/", function(req, res) {
    res.render('home', {sucessMessage: successfulMessage});
})

app.post("/", function(req, res) {
    const newArticle = new Article ({
        title: req.body.userTitle,
        content: req.body.userContent
    });
    newArticle.save(function(err) {
        if(err) {
            throw err;
        } else {
            successfulMessage = "Successfully inserted into the database!";
            res.render('home', {sucessMessage: successfulMessage});
            successfulMessage = "";
        }
    });
});

app.get("/articles", function(req, res) {
    Article.find({}, function(err, results) {
        if(err) {
            console.log(err.message);
        } else {
            res.render('articles', {foundArticles: results})
        }
    })
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is started at port 3000.");
});