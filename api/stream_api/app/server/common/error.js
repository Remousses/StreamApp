const { validationResult } = require('express-validator');

module.exports = {
    checkError : (req) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return { errors: errors.array() }
        }
    },
    commonErrorMessage : 'Ce champ est obligatoire'
}
