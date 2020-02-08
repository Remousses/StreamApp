const fs = require('fs'),
    path = require('path'),
    express = require('express'),
    cors = require("cors"),
    app = express(),
    shell = require('shelljs'),
    btoa = require('btoa'),
    util = require('util'),
    { check, validationResult } = require('express-validator');

app.use(cors());

app.get('/repositories', (req, res) => {
    console.log('Récupération de tous le contenu du dossier Repositories');
    getAllContent(res, 'Repositories');
});

app.get('/content', [
    check('path').not().isEmpty().withMessage('Ce champ est obligatoire')
], (req, res) => {
    let error = checkError(req, res);
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

app.get('/searchImage', [
    check('path').not().isEmpty().withMessage('Ce champ est obligatoire')
], (req, res) => {
    let repo = req.query.path;

    console.log('Récupération de l\'image ' + repo);

    searchImage(req, res, repo);
});

app.get('/mangas/searchManga', [
    check('name').not().isEmpty().withMessage('Ce champ est obligatoire'),
    check('chapter').not().isEmpty().withMessage('Ce champ est obligatoire')
], (req, res) => {
    let error = checkError(req, res);
    if (error) {
        return res.status(422).json(error);
    }

    let name = req.query.name;
    let chapter = req.query.chapter;
    console.log('Trying to search chapter ' + chapter + ' of manga ' + name);

    shell.exec('./Bash-scripts/mangas.sh ' + name + ' ' + chapter);

    res.status(200).send({
        res: 'OK'
    }).end();
});

app.all('*', (req, res) => {
    console.log("path", req.baseUrl);
})

app.put('/uploads', (req, res) => {
    const file = req.body;
    console.log("file", file);

    const base64data = file.content.replace(/^data:.*,/, '');
    fs.writeFile(userFiles + file.name, base64data, 'base64', (err) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            res.set('Location', userFiles + file.name);
            res.status(200);
            res.send(file);
        }
    });
});

app.delete('/uploads/**', (req, res) => {
    const fileName = req.url.substring(7).replace(/%20/g, ' ');
    fs.unlink(userFiles + fileName, (err) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            res.status(204);
            res.send({});
        }
    });
});

app.listen(8080, () => {
    console.log('Streaming app launched on port ' + 8080);
});

function searchImage(req, res, repo) {
    let error = checkError(req, res);
    if (error) {
        return res.status(422).json(error);
    }
    console.log("searchImage");
    let bufferImage = fs.readFileSync(path.resolve(__dirname, repo));
    let binary = '';
    let bytes = new Uint8Array(bufferImage);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    let encode = 'data:image/' + repo.split('.')[1] + ';base64,'

    return res.status(200).send({
        image: encode + btoa(binary)
    })

}

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