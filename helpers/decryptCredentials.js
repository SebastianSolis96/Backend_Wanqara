const { decryptWord } = require('./decryptWord');

const decryptCredentials = ( userEncrypt, passwordEncrypt, databaseEncrypt ) => {
    
    const user = decryptWord(userEncrypt);
    const password = decryptWord(passwordEncrypt);
    const database = decryptWord(databaseEncrypt);

    return {
        user, 
        password, 
        database
    }

}

module.exports = {
    decryptCredentials
}