const routes = require('express').Router(),
    shell = require('shelljs'),
    { check } = require('express-validator');

const errorFile = require('../common/error');

routes.get('/test', (req, res) => {
    shell.exec('./bash-scripts/test.sh one-piece');

    return res.status(200).json({
        res: 'OK'
    });
});

routes.get('/searchManga', [
    check('name').not().isEmpty().withMessage(errorFile.commonErrorMessage),
    check('chapter').not().isEmpty().withMessage(errorFile.commonErrorMessage)
], (req, res) => {
    errorFile.checkError(req, res);

    const name = req.query.name;
    const chapter = req.query.chapter;
    console.log('Trying to search chapter ' + chapter + ' of manga ' + name);

    shell.exec('./server/bash-scripts/mangas-scan.sh ' + name + ' ' + chapter);

    return res.status(200).json({
        res: 'OK'
    });
});

routes.get('/mangas/dlCA', (req, res) => {
    shell.exec('./server/bash-scripts/dl-ca.sh');

    return res.status(200).json({
        res: 'OK'
    });
});

module.exports = routes;