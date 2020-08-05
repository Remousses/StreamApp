const routes = require('express').Router(),
    { check } = require('express-validator');

const launchContent = require('../common/lauchContent'),
    errorFile = require('../common/error');

routes.get('/searchVideo', [
    check('name').not().isEmpty().withMessage(errorFile.commonErrorMessage),
    check('path').not().isEmpty().withMessage(errorFile.commonErrorMessage)
], (req, res) => {
    let videoName = req.query.name;
    let repo = req.query.path;

    console.log('Récupération de la vidéo ' + repo);

    launchContent(req, res, repo, videoName);
});

module.exports = routes;