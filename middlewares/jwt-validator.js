const { response } = require('express');
const jwt = require('jsonwebtoken');

const validatorJWT = ( req, res = response, next ) => {

    const token = req.header('x-token');

    if( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'There is no token in the request'
        });
    }

    try {
        
        const { user } = jwt.verify(
            token,
            process.env.SECRET_JWT_SPEED
        );

        req.user = user;

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Invalid token'
        });
    }

    next();

}

module.exports = {
    validatorJWT
}