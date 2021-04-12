const routes = require('express').Router(),
    { check } = require('express-validator'),
    fs = require('fs'),
    path = require('path');

const errorFile = require('../common/error');

routes.get('/searchImage', [
    check('path').not().isEmpty().withMessage(errorFile.commonErrorMessage)
], (req, res) => {
    const error = errorFile.checkError(req);
    if (error) {
        return res.status(422).json(error);
    }    
    const repo = req.query.path;

    console.log('Récupération de l\'image ' + repo);

    searchImage(req, res, repo, 'image');
});

routes.get('/searchPdf', [
    check('path').not().isEmpty().withMessage(errorFile.commonErrorMessage)
], (req, res) => {
    const error = errorFile.checkError(req);
    if (error) {
        return res.status(422).json(error);
    }
    const repo = req.query.path;

    console.log('Récupération du pdf ' + repo);

    searchImage(req, res, repo, 'pdf');
});

function searchImage(req, res, repo, type) {
    const bufferImage = fs.readFileSync(path.resolve(__dirname.replace('/app/server/routes', '/app'), repo));
    let data;

    switch (type) {
        case 'image':
            data = 'data:image/' + repo.split('.')[1] + ';base64,' + Buffer.from(bufferImage).toString('base64');
            break;

        case 'pdf':
            data = 'data:application/pdf;base64,' + Buffer.from(bufferImage).toString('base64');
            break;
        default:
            break;
    }

    if (data) {
        return res.status(200).json({ data });
    }
    
    return res.status(422).json({
        error: 'No data found'
    });
}

module.exports = routes;
