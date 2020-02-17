const fs = require('fs'),
    path = require('path'),
    btoa = require('btoa');

const checkError = require('./checkError');

module.exports = function searchImage(req, res, repo) {
    let error = checkError(req, res);
    if (error) {
        return res.status(422).json(error);
    }

    let bufferImage = fs.readFileSync(path.resolve(__dirname.replace('/app/server/common', '/app'), repo));
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
