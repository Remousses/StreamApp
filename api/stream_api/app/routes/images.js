const routes = require('express').Router(),
    { check } = require('express-validator');

const searchImage = require('../common/searchImage') 

routes.get('/searchImage', [
    check('path').not().isEmpty().withMessage('Ce champ est obligatoire')
], (req, res) => {
    let repo = req.query.path;

    console.log('Récupération de l\'image ' + repo);

    searchImage(req, res, repo);
});

module.exports = routes;
