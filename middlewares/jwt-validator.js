const { response } = require('express');
const jwt = require('jsonwebtoken');

const validatorJWT = ( req, res = response, next ) => {

    const token = req.header('x-token');

    if( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {
        
        const { user } = jwt.verify(
            token,
            process.env.SECRET_JWT_SPEED
        );

        req.user = user;

    } catch (error) {
        return response.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }

    next();

}

module.exports = {
    validatorJWT
}