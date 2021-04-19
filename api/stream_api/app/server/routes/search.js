const routes = require('express').Router(),
    shell = require('shelljs'),
    { check } = require('express-validator'),
    find = require('find');

const errorFile = require('../common/error');

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

routes.get('/searchFile', [
    check('path').not().isEmpty().withMessage(errorFile.commonErrorMessage),
    check('fileName').not().isEmpty().withMessage(errorFile.commonErrorMessage)
], async (req, res) => {
    const error = errorFile.checkError(req);
    if (error) {
        return res.status(422).json(error);
    }
    let path = req.query.path;
    path = path && path !== 'null' ? '/app/' + path : '/app/Repositories';
    const fileName = req.query.fileName;
    
    console.log('Trying to search ' + fileName + ' in ' + path);
    // '[\/]' + fileName + '([a-zA-Z0-9]?)\.'
    const search = data => data.replace('/app/', '');
    return res.status(200).json({
        files: find.fileSync(new RegExp(fileName), path).filter(file => new RegExp('.*' + fileName + '([a-zA-Z0-9]?)\.?').test(file)).map(search)
    });
});

module.exports = routes;