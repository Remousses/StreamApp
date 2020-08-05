const fs = require('fs'),
    path = require('path');

const errorFile = require('./error');

module.exports = function launchContent(req, res, repo, fileName) {
    let error = errorFile.checkError(req);
    if (error) {
        return res.status(422).json(error);
    }

    let extension = fileName.split('.')[1];

    let file = path.resolve(__dirname.replace('/app/server/common', '/app'), repo);
    console.log("file", file);

    fs.stat(file, function (err, stats) {
        if (err) {
            if (err.code === 'ENOENT') {
                // 404 Error if file not found
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
            .on('open', (ddd) => {
                stream.pipe(res);
                console.log("ddd", ddd);
            }).on('error', function (err) {
                return res.status(200).send(err);
            });
    });
}
