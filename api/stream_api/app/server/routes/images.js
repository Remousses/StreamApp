const routes = require('express').Router(),
    { check } = require('express-validator'),
    fs = require('fs'),
    path = require('path'),
    btoa = require('btoa')
    Util = require('util');

const errorFile = require('../common/error');

routes.get('/searchImage', [
    check('path').not().isEmpty().withMessage(errorFile.commonErrorMessage)
], (req, res) => {
    let repo = req.query.path;

    console.log('Récupération de l\'image ' + repo);

    searchImage(req, res, repo);
});

function searchImage(req, res, repo) {
    const error = errorFile.checkError(req);
    if (error) {
        return res.status(422).json(error);
    }

    const bufferImage = fs.readFileSync(path.resolve(__dirname.replace('/app/server/routes', '/app'), repo));

    return res.status(200).send({
        image: 'data:image/' + repo.split('.')[1] + ';base64,' + new Buffer(bufferImage).toString('base64')
    });
}

module.exports = routes;
