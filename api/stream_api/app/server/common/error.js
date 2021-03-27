const { validationResult } = require('express-validator');

module.exports = {
    checkError : (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }
    },
    commonErrorMessage : 'Ce champ est obligatoire'
}
