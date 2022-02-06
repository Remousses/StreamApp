const routes = require('express').Router(),
    { check } = require('express-validator'),
    path = require("path");

const errorFile = require('../common/error');

routes.get('/downloads/files', [
    check('name').not().isEmpty().withMessage(errorFile.commonErrorMessage),
    check('path').not().isEmpty().withMessage(errorFile.commonErrorMessage)
], (req, res) => {
    const error = errorFile.checkError(req);
    if (error) {
        return res.status(422).json(error);
    }
    const filepath = path.resolve(__dirname.replace('/app/server/routes', '/app'), req.query.path) + '/' + req.query.name;
    return res.sendFile(filepath);
});

module.exports = routes;

