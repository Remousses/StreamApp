const { validationResult } = require('express-validator');

module.exports = function checkError(req, res) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return { errors: errors.array() }
    }
}
