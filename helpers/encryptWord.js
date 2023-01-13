const md5 = require('md5-nodejs');

const encryptWord = ( word ) => {
    let wordEncrypt = "";

    //Encriptar palabra
    wordEncrypt = md5(word);

    return wordEncrypt;

}

module.exports = {
    encryptWord
}