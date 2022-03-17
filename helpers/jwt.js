const jwt = require('jsonwebtoken');

const generarJWT = ( user ) => {

    return new Promise( (resolve, reject) => {

        const payload = { user };

        jwt.sign( payload, process.env.SECRET_JWT_SPEED, {
            expiresIn: '2h'
        }, (err, token) => {

            if( err ){
                console.log(err);
                reject('No se pudo generar el token')
            }

            resolve( token );

        })

    });

}

module.exports = {
    generarJWT
}