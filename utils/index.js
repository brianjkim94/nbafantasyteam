const bcrypt = require('bcryptjs');

function validPassword(typedPassword, userPassword) {
    let isCorrectPassword = bcrypt.compareSync(typedPassword, userPassword);

    return isCorrectPassword; // return true or false
}

module.exports = {
    validPassword 
}