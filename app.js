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
    Article.find({}, function(err, results) {
        if(err) {
            res.send(err);
        } else {
            res.render('home', {foundArticles: results})
        }
    })
});

// Requests targetting all the articles...

app.route("/articles")

.get(function(req, res) {
    res.render('articles', {sucessMessage: successfulMessage});
})
    
.post(function(req, res) {
    const newArticle = new Article ({
        title: req.body.userTitle,
        content: req.body.userContent
    });
    newArticle.save(function(err) {
        if(err) {
            res.send(err);
        } else {
            successfulMessage = "Successfully inserted into the database!";
            res.render('articles', {sucessMessage: successfulMessage});
        }
    });
})
    
.delete(function(req, res) {
    Article.deleteMany({}, function(err) {
        if(err) {
            res.send(err);
        } else {
            res.send("Successfully deleted all the articles!");
        }
    });
});

// Requests targetting a single article...

app.route("/articles/:articleTitle")

.get(function(req, res) {
    const userTitle = req.params.articleTitle;
    Article.findOne({title: userTitle}, function(err, foundArticle) {
        if(err) {
            res.send(err);
        } else {
            if(foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No article matching that title was found! :-)")
            }
        }
    });
})

.put(function(req, res) {
    const userTitle = req.params.articleTitle;
    Article.replaceOne({title: userTitle}, {title: req.body.newTitle, content: req.body.newContent}, {overwrite: true}, function(err, results) {
        if(err) {
            res.send(err);
        } else {
            res.send(results);
        }
    });
})

.patch(function(req, res) {
    const userTitle = req.params.articleTitle;
    Article.updateOne({title: userTitle}, {$set: req.body}, function(err, results) {
        if(err) {
            res.send(err);
        } else {
            res.send(results);
        }
    });
})

.delete(function(req, res) {
    Article.deleteOne({title: req.params.articleTitle}, {upsert: true}, function(err, results) {
        if(err) {
            res.send(err);
        } else {
            res.send(results);
        }
    });
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is started at port 3000.");
});