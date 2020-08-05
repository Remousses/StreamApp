const routes = require('express').Router(),
    shell = require('shelljs'),
    { check } = require('express-validator'),
    fs = require('fs');

const errorFile = require('../common/error');

routes.get('/test', (req, res) => {
    shell.exec('./bash-scripts/test.sh one-piece');

    res.status(200).send({
        res: 'OK'
    }).end();
});

routes.get('/mangas/searchManga', [
    check('name').not().isEmpty().withMessage(errorFile.commonErrorMessage),
    check('chapter').not().isEmpty().withMessage(errorFile.commonErrorMessage)
], (req, res) => {
    let error = errorFile.checkError(req);
    if (error) {
        return res.status(422).json(error);
    }

    let name = req.query.name;
    let chapter = req.query.chapter;
    console.log('Trying to search chapter ' + chapter + ' of manga ' + name);

    shell.exec('./server/bash-scripts/mangas-scan.sh ' + name + ' ' + chapter);

    res.status(200).send({
        res: 'OK'
    }).end();
});

routes.get('/mangas/dlCA', (req, res) => {
    shell.exec('./server/bash-scripts/dl-ca.sh');

    res.status(200).send({
        res: 'OK'
    }).end();
});

module.exports = routes;