const fs = require('fs'),
    path = require('path'),
    express = require('express'),
    cors = require("cors"),
    app = express(),
    { check } = require('express-validator'),
    bodyParser = require("body-parser");;

const upload = require('./routes/uploads'),
    video = require('./routes/videos'),
    base64 = require('./routes/base64'),
    audio = require('./routes/audios'),
    mangas = require('./routes/mangas');

const errorFile = require('./common/error');

app.use(bodyParser.json());
app.use(cors());

app.use("/", upload);

app.use("", video);

app.use("", base64);

app.use("", audio);

app.use("", mangas);

app.get('/content', [
    check('path').not().isEmpty().withMessage(errorFile.commonErrorMessage)
], (req, res) => {
    let error = errorFile.checkError(req);
    if (error) {
        return res.status(422).json(error);
    }

    let repo = req.query.path;

    if (!repo.startsWith('Repositories')) {
        repo = 'Repositories/' + repo;
    }

    console.log('Récupération de tous le contenu du dossier ' + repo);

    getAllContent(res, repo);
});

app.all("/*", (req, res, next) => {
    console.log("Request on ", req.path);
    next();
});

app.listen(8080, () => {
    console.log('Stream app launched on port ' + 8080);
});

function getAllContent(res, repo) {
    let contentList = [];
    let dir = path.resolve(__dirname.replace('/app/server', '/app'), repo);
    repo = repo.replace('//', '/');

    fs.readdirSync(dir).forEach(file => {
        contentList.push(file);
    });

    return res.status(200).send({
        list: contentList,
        path: repo
    });
}
