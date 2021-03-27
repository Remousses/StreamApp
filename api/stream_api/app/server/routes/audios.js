const routes = require('express').Router(),
    { check } = require('express-validator');

const launchContent = require('../common/lauchContent'),
    errorFile = require('../common/error');

routes.get('/searchAudio', [
    check('name').not().isEmpty().withMessage(errorFile.commonErrorMessage),
    check('path').not().isEmpty().withMessage(errorFile.commonErrorMessage)
], (req, res) => {
    errorFile.checkError(req, res);

    const audioName = req.query.name;
    const repo = req.query.path;

    console.log('Récupération de l\'audio ' + repo);

    launchContent(req, res, repo, audioName);
});

module.exports = routes;

