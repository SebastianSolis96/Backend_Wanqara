const { encryptWord } = require('./encryptWord');

const encryptCredentials = ( user, password, database ) => {
    
    const userEncrypt = encryptWord(user);
    const passwordEncrypt = encryptWord(password);
    const databaseEncrypt = encryptWord(database);

    return {
        userEncrypt, 
        passwordEncrypt, 
        databaseEncrypt
    }

}

module.exports = {
    encryptCredentials
}