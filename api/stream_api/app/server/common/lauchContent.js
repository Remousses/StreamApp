const fs = require('fs'),
    path = require('path');

module.exports = function launchContent(req, res, repo, fileName) {
    const extension = fileName.split('.')[1];

    const file = path.resolve(__dirname.replace('/app/server/common', '/app'), repo);

    fs.stat(file, function (err, stats) {
        if (err) {
            if (err.code === 'ENOENT') {
                // 404 Error if file not found
                return res.sendStatus(404);
            }
            return res.status(500).json(err);
        }
        const range = req.headers.range;

        if (!range) {
            console.log("Wrong range");
            // 416 Wrong range
            return res.sendStatus(416);
        }
        const positions = range.replace(/bytes=/, '').split('-');
        const start = parseInt(positions[0], 10);
        const total = stats.size;
        const end = positions[1] ? parseInt(positions[1], 10) : total - 1;
        const chunksize = (end - start) + 1;

        res.writeHead(206, {
            'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/' + extension
        });

        const stream = fs.createReadStream(file, { start: start, end: end })
            .on('open', _ => stream.pipe(res))
            .on('error', (err) => res.status(200).json(err));
    });
}
