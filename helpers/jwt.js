const jwt = require('jsonwebtoken');

const createJWT = ( user ) => {

    return new Promise( (resolve, reject) => {

        const payload = { user };

        jwt.sign( payload, process.env.SECRET_JWT_SPEED, {
            expiresIn: '2h'
        }, (err, token) => {

            if( err ){
                console.log(err);
                reject('Failed to create token')
            }

            resolve( token );

        })

    });

}

module.exports = {
    createJWT
}