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
    const error = errorFile.checkError(req);
    if (error) {
        return res.status(422).json(error);
    }
    const name = req.query.name;
    const chapter = req.query.chapter;
    console.log('Trying to search chapter ' + chapter + ' of manga ' + name);

    shell.exec('./server/bash-scripts/mangas-scan.sh ' + name + ' ' + chapter);

    return res.status(200).json({
        res: 'OK'
    });
});

routes.get('/searchFileOrFolder', [
    check('path').not().isEmpty().withMessage(errorFile.commonErrorMessage),
    check('fileOrFolder').not().isEmpty().withMessage(errorFile.commonErrorMessage)
], (req, res) => {
    const error = errorFile.checkError(req);
    if (error) {
        return res.status(422).json(error);
    }
    const path = req.query.path;
    const fileOrFolder = req.query.fileOrFolder;
    console.log('Trying to search ' + fileOrFolder + ' in ' + path);

    // shell.exec('./server/bash-scripts/mangas-scan.sh ' + name + ' ' + chapter);

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