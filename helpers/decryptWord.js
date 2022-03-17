const decryptWord = ( word ) => {

    //Variables
    let wordEncryptAscii;
    let wordEncryptInt = 0;
    let wordDecrypt = "";
    let lengthWord = word.trim().length;

    //Desencriptar palabra
    for(let i = 0; i < lengthWord; i++){
        //Transformar a código ASCII
        wordEncryptAscii = word.trim().charCodeAt(i);
        //Restar valor a ASCII
        wordEncryptInt = wordEncryptAscii - 148;
        //Llenar String con la palabra desencriptada
        wordDecrypt = wordDecrypt +""+ String.fromCharCode(wordEncryptInt);
    }

    return wordDecrypt;

}

module.exports = {
    decryptWord
}