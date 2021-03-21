const routes = require('express').Router(),
    multer = require('multer'),
    fs = require('fs'),
    { check } = require('express-validator'),
    rimraf = require("rimraf"),
    shell = require('shelljs');

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, req.body.currentFolder)
    },
    filename: (req, file, callBack) => {
        callBack(null, file.originalname)
    }
});

const upload = multer({ storage: storage });

const errorFile = require('../common/error');

routes.put('/uploads/files', upload.array('files'),
    (req, res, next) => {
        const files = req.files;

        if (!files) {
            const error = new Error('No File')
            error.httpStatusCode = 400
            return next(error)
        }
        console.log('Télechargement de tous les fichiers terminé');
        
        res.send({ filesOploaded: true }).end();
    }
);


routes.put('/upload/links', [
    check('folderDestination').not().isEmpty().withMessage(errorFile.commonErrorMessage),
    check('links').not().isEmpty().withMessage(errorFile.commonErrorMessage)
], (req, res) => {
    let error = errorFile.checkError(req);
    if (error) {
        return res.status(422).json(error);
    }

    let folderDestination = req.query.folderDestination;
    let links = req.query.links;

    let test = shell.exec('./server/bash-scripts/upload-links.sh ' + folderDestination + ' ' + links);
    
    console.log();
    console.log("output", test.stdout)
    
    res.status(200).send({
        res: 'OK'
    }).end();
});

routes.put('/createFolder', (req, res) => {
    const body = req.body;
    const folderName = body.folderName;
    const dir = body.currentFolder + '/' + folderName;

    console.log('Création du dossier ' + folderName + ' en cours');

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, {
            recursive: true
        });
        console.log('Création du dossier ' + folderName + ' terminé');
        return res.status(200).json({ folderCreated: true });
    }
    
    res.status(404).send({ folderCreated: false }).end();
});

routes.delete('/deleteFile',[
    check('currentFolder').not().isEmpty().withMessage(errorFile.commonErrorMessage),
    check('fileName').not().isEmpty().withMessage(errorFile.commonErrorMessage)
], (req, res) => {
    let query = req.query;
    let path = query.currentFolder + '/' + query.fileName;

    console.log('Suppression du fichier ' + path + ' en cours');
    
    
    // fs.close(16)

    fs.unlink(path, (err) => {
        if (err) {
            console.log('Erreur lors de la suppression du fichier ' + path, err);
            res.sendStatus(500);
        } else {
            console.log('Suppression du fichier ' + path + ' terminé');
            res.status(200).send({ fileCreated: true }).end();
        }
    });
});

routes.delete('/deleteFolder',[
    check('currentFolder').not().isEmpty().withMessage(errorFile.commonErrorMessage),
], (req, res) => {
    let currentFolder = req.query.currentFolder;

    console.log('Suppression du dossier ' + currentFolder + ' en cours');
    
    rimraf(currentFolder, () => {
        console.log('Suppression du dossier ' + currentFolder + ' terminé')
        res.status(200).send({ folderDeleted: true })
    });
});

module.exports = routes;