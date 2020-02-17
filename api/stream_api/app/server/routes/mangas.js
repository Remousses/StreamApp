const routes = require('express').Router(),
    shell = require('shelljs'),
    { check } = require('express-validator');

const checkError = require('../common/checkError');

routes.get('/test', (req, res) => {
    shell.exec('./Bash-scripts/test.sh one-piece');

    res.status(200).send({
        res: 'OK'
    }).end();
});

routes.get('/mangas/searchManga', [
    check('name').not().isEmpty().withMessage('Ce champ est obligatoire'),
    check('chapter').not().isEmpty().withMessage('Ce champ est obligatoire')
], (req, res) => {
    let error = checkError(req, res);
    if (error) {
        return res.status(422).json(error);
    }

    let name = req.query.name;
    let chapter = req.query.chapter;
    console.log('Trying to search chapter ' + chapter + ' of manga ' + name);

    shell.exec('./Bash-scripts/mangas-scan.sh ' + name + ' ' + chapter);

    res.status(200).send({
        res: 'OK'
    }).end();
});

module.exports = routes;