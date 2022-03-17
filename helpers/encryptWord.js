const encryptWord = ( word ) => {

    //Variables
    let wordAscii;
    let wordEncryptInt = 0;
    let wordEncrypt = "";
    let lengthWord = word.trim().length;

    //Encriptar palabra
    for(let i = 0; i < lengthWord; i++){
        //Transformar a código ASCII
        wordAscii = word.trim().charCodeAt(i);
        //Aumentar valor a ASCII
        wordEncryptInt = wordAscii + 148;
        //Llenar String con la palabra encriptada
        wordEncrypt = wordEncrypt +""+ String.fromCharCode(wordEncryptInt);
    }

    return wordEncrypt;

}

module.exports = {
    encryptWord
}