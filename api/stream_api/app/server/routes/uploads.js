const routes = require('express').Router(),
    multer = require('multer'),
    fs = require('fs'),
    { check } = require('express-validator'),
    rimraf = require("rimraf"),
    request = require('request');

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

routes.put('/uploads/files', upload.array('files'), (req, res, next) => {
    const files = req.files;

    if (!files) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        return next(error)
    }
    console.log('Télechargement de tous les fichiers terminé');
    
    return res.json({ filesOploaded: true });
});

routes.put('/upload/links', [
    check('folderDestination').not().isEmpty().withMessage(errorFile.commonErrorMessage),
    check('links').not().isEmpty().withMessage(errorFile.commonErrorMessage)
], async (req, res) => {
    errorFile.checkError(req, res);

    const body = req.body;
    const folderDestination = body.folderDestination + '/';
    const links = body.links;

    const errors = [];
    const allLinks = await checkUploadLinksErrors(folderDestination, links, errors);
    
    return errors.length != 0
        ? res.status(400).json({ err: errors })
        : res.status(200).json({ res: allLinks });
});

function checkUploadLinksErrors(folderDestination, links, errors) {
    // return new Promise((resolve, reject) => {
        const allLinks = links.map(link => {
            return uploadLink(folderDestination, link)
        })
        return Promise.all(allLinks).then(res => {
            console.log("Result of many link upload : ", res);

            res.forEach(file => {
                // console.log("aadeadazdazdzad", file)
                // console.log("ezzfregse<fwrgdrgfqer", file.err)
                if (file.err) {
                    errors.push({ err: file.err });
                } else {
                    console.log("yolo", file);
                }
            })
            // return res;
        });
    // });
}

function uploadLink(folderDestination, link) {
    return new Promise((resolve, reject) => {
        const fileName = link.substr(link.lastIndexOf('/') + 1);
        const path = folderDestination + fileName;
        const linkError = { fileName, error : {}};

        console.log('Création du fichier ' + fileName + ' dans le dossier ' + folderDestination)

        const file = fs.createWriteStream(path);

        // on lance le téléchargement
        const sendReq = request.get(link);

        // on vérifie la validité du code de réponse HTTP
        sendReq.on('response', (response) => {
            if (response.statusCode !== 200) {
                console.log('Response status was ' + response.statusCode);
                error = true;
                linkError.error.statusCode = statusCode;
                reject({ err : linkError });
            }
        });

        // au cas où request rencontre une erreur on efface le fichier partiellement écrit
        // puis on passe l'erreur au callback
        sendReq.on('error', (err) => {
            console.log('Une erreur c\'est produit, durant la récupération du lien', link, err.message);
            fs.unlink(path);
            
            linkError.error.request = err.message;
            reject({ err : linkError });
        });

        // écrit directement le fichier téléchargé
        sendReq.pipe(file);

        // lorsque le téléchargement est terminé on appelle le callback
        file.on('finish', () => {
            // close étant asynchrone, le cb est appelé lorsque close a terminé
            file.close(_ => console.log('File ' + fileName +  ' was successfully closed'));
            resolve({ res: 'File ' + fileName + ' was successfully uploaded'})
        });

        // si on rencontre une erreur lors de l'écriture du fichier
        // on efface le fichier puis on passe l'erreur au callback
        file.on('error', (err) => {
            // on efface le fichier sans attendre son effacement
            // on ne vérifie pas non plus les erreur pour l'effacement
            console.log('Une erreur c\'est produit, suppression du fichier', err.message);
            fs.unlink(path);
            linkError.error.write = err.message;
            reject({ err : linkError });
        });
    }).catch(err => {
        return err;
    });
}

routes.put('/createFolder', (req, res) => {
    const body = req.body;
    const folderName = body.folderName.trim();
    const dir = body.currentFolder + '/' + folderName;

    console.log('Création du dossier ' + folderName + ' en cours');

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, {
            recursive: true
        });
        console.log('Création du dossier ' + folderName + ' terminé');
        return res.status(200).json({ folderCreated: true });
    }
    
    return res.status(404).json({ folderCreated: false });
});

routes.delete('/deleteFile',[
    check('currentFolder').not().isEmpty().withMessage(errorFile.commonErrorMessage),
    check('fileName').not().isEmpty().withMessage(errorFile.commonErrorMessage)
], (req, res) => {
    const query = req.query;
    const path = query.currentFolder + '/' + query.fileName;

    console.log('Suppression du fichier ' + path + ' en cours');
    
    
    fs.unlink(path, (err) => {
        if (err) {
            console.log('Erreur lors de la suppression du fichier ' + path, err);
            return res.sendStatus(500);
        } else {
            console.log('Suppression du fichier ' + path + ' terminé');
            return res.status(200).json({ fileCreated: true });
        }
    });
});

routes.delete('/deleteFolder',[
    check('currentFolder').not().isEmpty().withMessage(errorFile.commonErrorMessage),
], (req, res) => {
    const currentFolder = req.query.currentFolder;

    console.log('Suppression du dossier ' + currentFolder + ' en cours');
    
    rimraf(currentFolder, () => {
        console.log('Suppression du dossier ' + currentFolder + ' terminé')
        res.status(200).json({ folderDeleted: true }).end()
    });
});

module.exports = routes;