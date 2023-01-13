const { response } = require('express');

const pool = require('../database/db');
const { encryptWord } = require('../helpers/encryptWord');
const { createJWT } = require('../helpers/jwt');


const login = async ( req, res = response ) => {

    const { user, pass } = req.body

    //Enriptar pass
    const passEncrypt = encryptWord(pass);

    try {
        const result = await pool.query(`SELECT name FROM public.user 
            WHERE email = $1 AND password = $2`, [user, passEncrypt]);

        if( result.rows.length > 0 ){
            //Generar JWT
            const token = await createJWT( user );

            res.json({
                ok: true,
                msg: 'Correct data',
                uid: user,
                name: result.rows[0]?.name?.trim(),
                token
            });

        }else{
            return res.status(400).json({
                ok: false,
                msg: 'Incorrect data'
            });
        }

    } catch (error) {
        if( error.code === '53300' ){
            return res.status(500).json({
                ok: false,
                msg: 'You have exceeded the number of connections allowed. Come back soon.',
            });
        }else{
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: 'Incorrect data',
                // error: error
            });
        }
    }
}

const renewToken = async ( req, res = response ) => {

    const { user } = req;

    //Generar JWT
    const token = await createJWT( user );

    res.json({
        ok: true,
        user,
        token
    });
} 

module.exports = {
    login,
    renewToken,
}