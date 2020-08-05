const routes = require('express').Router(),
    { check } = require('express-validator');

const searchImage = require('../common/searchImage'),
    errorFile = require('../common/error');

routes.get('/searchImage', [
    check('path').not().isEmpty().withMessage(errorFile.commonErrorMessage)
], (req, res) => {
    let repo = req.query.path;

    console.log('Récupération de l\'image ' + repo);

    searchImage(req, res, repo);
});

module.exports = routes;
