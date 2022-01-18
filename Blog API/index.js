const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuid = require("uuid");
const { v4: uuidv4 } = require('uuid');
var path = require('path');
var public = path.join(__dirname, 'public');

const fs = require("fs");

const app = express();

app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cors());


app.get('/', function(req, res) {
    res.sendFile(path.join(public, 'index.html'));
});
app.use('/', express.static(public));


// Read All
app.get("/articles", (req, res) => {
    const articlesList = readJSONFile();

    let indexStart = req.query.indexStart;
    let indexEnd = req.query.indexEnd;

    if (indexStart === undefined || indexEnd === undefined) {
        let articlesListObject = {
            articles: articlesList,
            numberOfArticles: articlesList.length
        }
        res.json(articlesListObject);
    } else {
        let newArticlesList = articlesList.filter((article, index) => indexStart <= index && indexEnd >= index);
        let articlesListObject = {
            articlesList: newArticlesList,
            numberOfArticles: articlesList.length
        }
        res.json(articlesListObject);
    }

});


app.get("/articles/:id", (req, res) => {
    const articlesList = readJSONFile();
    const id = req.params.id;

    let article;

    for (let i = 0; i < articlesList.length; i++) {
        if (articlesList[i].id == id) {
            const nextId = i === articlesList.length - 1 ? null : articlesList[i + 1].id;
            const prevId = i === 0 ? null : articlesList[i - 1].id;

            article = {...articlesList[i], prevId, nextId };
        }
    }

    if (article === undefined) {
        article = { message: 'article not found', status: 404 };
    }
    res.json(article);
});

// Post
app.post("/articles", (req, res) => {
    const articlesList = readJSONFile();

    let title = req.body.title;
    let tag = req.body.tag;
    let author = req.body.author;
    let date = req.body.date;
    let imgUrl = req.body.imgUrl;
    let saying = req.body.saying;
    let content = req.body.content

    articlesList.push({
        "id": uuidv4(),
        "title": title,
        "tag": tag,
        "author": author,
        "date": date,
        "imgUrl": 'img/' + imgUrl,
        "saying": saying,
        "content": content
    })

    writeJSONFile(articlesList);
    res.json(articlesList);
});


// Put
app.put("/articles/:id", (req, res) => {
    const articlesList = readJSONFile();
    const updatedArticleId = req.params.id;
    let index = "";
    articlesList.forEach((element, indexElement) => {
        if (element.id == updatedArticleId) {
            index = indexElement;
        }
    });
    const updatedArticle = req.body;
    articlesList[index] = {...updatedArticle, id: articlesList[index].id };
    writeJSONFile(articlesList);
    res.json(articlesList[index])
});

// Delete
app.delete("/articles/:id", (req, res) => {
    const articlesList = readJSONFile();
    const articleId = req.params.id;
    let articleIndex = '';

    if (!articleId) {
        res.status(404).json({ message: 'article not found' });
        return;
    }
    articlesList.forEach((item, index) => {
        if (item.id == articleId) {
            articleIndex = index;
        }
    })

    if (articleIndex === '') {
        res.status(404).json({ message: 'article not found!' });
        return;
    }
    const newArticleList = articlesList.filter(item => item.id != articleId);
    writeJSONFile(newArticleList);
    res.json({ message: 'article has been deleted' })
})

// Reading function from db.json file
function readJSONFile() {
    return JSON.parse(fs.readFileSync("db.json"))["articles"];
}

// Writing function from db.json file
function writeJSONFile(content) {
    fs.writeFileSync(
        "db.json",
        JSON.stringify({ articles: content }),
        "utf8",
        err => {
            if (err) {
                console.log(err);
            }
        }
    );
}

// Starting the server
app.listen("3007", () =>
    console.log("Server started at: http://localhost:3007")
);