const fs = require('fs'),
    path = require('path'),
    express = require('express'),
    cors = require("cors"),
    app = express(),
    { check, validationResult } = require('express-validator');

const repositories = "Repositories";

app.use(cors());

app.get('/repositories', (req, res) => {
    console.log('Récupération de tous le contenu du dossier Repositories');
    getAllContent(res, repositories);
});

app.get('/content', [
    check('path').not().isEmpty().withMessage('Ce champ est obligatoire')
], (req, res) => {
    let error = checkError(req, res);
    if (error) {
        return res.status(422).json(error);
    }

    let repo = req.query.path;

    if (!repo.startsWith("Repositories")) {
        repo = 'Repositories/' + repo;
    }

    console.log('Récupération de tous le contenu du dossier ' + repo);

    getAllContent(res, repo);
});

// videos/video/searchVideo?name=Marshmello-Together.mp4

app.get('/searchVideo', [
    check('name').not().isEmpty().withMessage('Ce champ est obligatoire'),
    check('path').not().isEmpty().withMessage('Ce champ est obligatoire')
], (req, res) => {
    let videoName = req.query.name;
    let repo = req.query.path;

    console.log('Récupération de la vidéo ' + repo);

    launchContent(req, res, repo, videoName);
});

app.get('/searchAudio', [
    check('name').not().isEmpty().withMessage('Ce champ est obligatoire'),
    check('path').not().isEmpty().withMessage('Ce champ est obligatoire')
], (req, res) => {
    let audioName = req.query.name;
    let repo = req.query.path;

    console.log('Récupération de l\'audio ' + repo);

    launchContent(req, res, repo, audioName);
});

app.listen(8080, () => {
    console.log('Streaming app launched on port ' + 8080);
});

function getAllContent(res, repo) {
    let contentList = [];

    repo = repo.replace('//', '/');

    fs.readdirSync(path.resolve(__dirname, repo)).forEach(file => {
        contentList.push(file);
    });

    return res.status(200).send({
        list: contentList,
        path: repo
    });
}

function launchContent(req, res, repo, fileName) {
    let error = checkError(req, res);
    if (error) {
        return res.status(422).json(error);
    }

    let extension = fileName.split('.')[1];
    let file = path.resolve(__dirname, repo);

    fs.stat(file, function (err, stats) {
        if (err) {
            if (err.code === 'ENOENT') {
                // 404 Error if file not found
                console.log("ENOENT");

                return res.sendStatus(404);
            }
            return res.status(500).send(err);
        }
        let range = req.headers.range;

        if (!range) {
            console.log("Wrong range");
            // 416 Wrong range
            return res.sendStatus(416);
        }
        let positions = range.replace(/bytes=/, '').split('-');
        let start = parseInt(positions[0], 10);
        let total = stats.size;
        let end = positions[1] ? parseInt(positions[1], 10) : total - 1;
        let chunksize = (end - start) + 1;

        res.writeHead(206, {
            'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/' + extension
        });

        let stream = fs.createReadStream(file, { start: start, end: end })
            .on('open', function () {
                stream.pipe(res);
            }).on('error', function (err) {
                return res.status(200).send(err);
            });
    });
}

function checkError(req, res) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return { errors: errors.array() }
    }
}