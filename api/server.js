const fs = require('fs'),
    path = require('path'),
    express = require('express'),
    cors = require("cors"),
    bodyParser = require("body-parser"),
    app = express(),
    { check, validationResult } = require('express-validator');

const domaineName = 'http://localhost:8080/',
    musicsUrl = domaineName + 'musics/', musicUrl = musicsUrl + 'music';

    app.use(cors());

app.get('/musics', (req, res) => {
    let videoList = [];
    fs.readdirSync(path.resolve(__dirname, 'Music')).forEach(file => {
        console.log("yolo", file)
        videoList.push(file);
    });

    console.log("videoList", videoList)
    res.status(200).send({
        videoList
    }).end();
});


app.get('/musics/music', [
    check('name').not().isEmpty().withMessage('Ce champ est obligatoire'),
    check('searchVideo').isBoolean().withMessage('Ce champ doit être de type boolean')
], (req, res) => {
    let error = checkError(req, res);
    if (error) {
        return res.status(422).json(error);
    }

    let query = req.query;
    let videoName = query.name;
    let searchVideo = query.searchVideo;
    let extension = videoName.split('.')[1];
console.log("yolo", searchVideo)
    // Si <video src="http://localhost:8080/music/Marshmello-Together.mp4" controls></video>
    if (!searchVideo || searchVideo === 'false') {
        // '<video src="' + musicUrl + '?name=' + videoName + '&searchVideo=true" controls></video>'
        return res.status(200).json({
            res : {
                videoLink : musicUrl + '?name=' + videoName + '&searchVideo=true'
            }
        });
    } else {
        console.log("tzdzest")
        let file = path.resolve(__dirname, 'Music/' + videoName);
        fs.stat(file, function (err, stats) {
            if (err) {
                if (err.code === 'ENOENT') {
                    // 404 Error if file not found
                    console.log("ENOENT");
                    
                    return res.sendStatus(404);
                }
                res.end(err);
            }
            var range = req.headers.range;
            console.log('range', range)
            if (!range) {
                console.log("Wrong range");
                // 416 Wrong range
                return res.sendStatus(416);
            }
            var positions = range.replace(/bytes=/, '').split('-');
            var start = parseInt(positions[0], 10);
            var total = stats.size;
            var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
            var chunksize = (end - start) + 1;

            res.writeHead(206, {
                'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/' + extension
            });

            var stream = fs.createReadStream(file, { start: start, end: end })
                .on('open', function () {
                    stream.pipe(res);
                }).on('error', function (err) {
                    res.end(err);
                });
        });
    }
});

app.listen(8080, () => {
    console.log('Streaming app launched on port ' + 8080);
});

function checkError(req, res) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return { errors: errors.array() }
    }
}