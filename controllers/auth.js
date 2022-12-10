const { response } = require('express');
const { db } = require('../database/db');
const { encryptCredentials } = require('../helpers/encryptCredentials');
const { decryptCredentials } = require('../helpers/decryptCredentials');
const { decryptWord } = require('../helpers/decryptWord');
const { encryptWord } = require('../helpers/encryptWord');
const { generarJWT } = require('../helpers/jwt');

const credentialsValidator = async ( req, res = response ) => {

    const { user, password, database } = req.body

    //Encriptar credenciales
    const { userEncrypt, passwordEncrypt, databaseEncrypt } = encryptCredentials(user, password, database);

    try {
        const pool = db(user, password, database);
        const result = await pool.query('SELECT NOW()');
        // console.log(result.rows[0]);

        res.json({
            ok: true,
            msg: 'Validación correcta',
            user: userEncrypt, 
            password: passwordEncrypt, 
            database: databaseEncrypt
        });

        pool.end();

    } catch (error) {
        if( error.code === '28P01' || error.code === '3D000' ){
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales incorrectas'
            });
        }else if( error.code === '53300' ){
            return res.status(500).json({
                ok: false,
                msg: 'Ha superado el número de conexiones permitidas. Vuelva pronto',
            });
        }else{
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: 'Ha ocurrido un error',
                // error: error
            });
        }
    }
}

const loginScae = async ( req, res = response ) => {

    const { userEncrypt, passwordEncrypt, databaseEncrypt, userScae, passwordScae } = req.body

    //Desencriptar credenciales
    const { user, password, database } = decryptCredentials(userEncrypt, passwordEncrypt, databaseEncrypt);

    //Enriptar usuario en login SCAE
    const userScaeEncrypt = encryptWord(userScae);

    try {
        const pool = db(user, password, database);
        // const result = await pool.query('SELECT PASSWORD FROM POSTGRES.SCCLAVE WHERE USUARIO = $1', [userScae]);
        const result = await pool.query('SELECT PASSWORD, USID FROM POSTGRES.SCCLAVE WHERE USUARIO = $1', [userScae]);

        const passwordEncryptScae = result.rows[0].password;
        
        const usid = result.rows[0].usid;

        const passwordDecrypt = decryptWord( passwordEncryptScae );

        if( passwordScae === passwordDecrypt ){

            //Generar JWT
            const token = await generarJWT( userScae );

            res.json({
                ok: true,
                msg: 'Datos correctos',
                userScae: userScaeEncrypt,
                usid,
                token
            });

            pool.end();

        }else{
            return res.status(400).json({
                ok: false,
                msg: 'Datos incorrectos'
            });
        }

    } catch (error) {
        if( error.code === '28P01' || error.code === '3D000' ){
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales incorrectas'
            });
        }else if( error.code === '53300' ){
            return res.status(500).json({
                ok: false,
                msg: 'Ha superado el número de conexiones permitidas. Vuelva pronto',
            });
        }else{
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: 'Datos incorrectos',
                // error: error
            });
        }
    }
}

const listEmpresas = async ( req, res = response ) => {

    const { userEncrypt, passwordEncrypt, databaseEncrypt, usid } = req.body

    //Desencriptar credenciales
    const { user, password, database } = decryptCredentials(userEncrypt, passwordEncrypt, databaseEncrypt);

    try {
        const pool = db(user, password, database);
        // const result = await pool.query('SELECT CODIGO, NOMBRE, RUC, DIRECCION, EMAIL, DIRECTORIO FROM POSTGRES.SCDETAEMPRESAS');
        const result = await pool.query(`SELECT CODIGO, NOMBRE, RUC, DIRECCION, EMAIL, 
            DIRECTORIO FROM POSTGRES.SCDETAEMPRESAS 
            WHERE useremp = $1;`, [ usid ]);
            
        res.json({
            ok: true,
            msg: result.rows
        });

        pool.end();

    } catch (error) {
        if( error.code === '28P01' || error.code === '3D000' ){
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales incorrectas'
            });
        }else{
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: 'Ha ocurrido un error',
                // error: error
            });
        }
    }
}

const listEmpresaByCodigo = async ( req, res = response ) => {

    const { userEncrypt, passwordEncrypt, databaseEncrypt, code } = req.body

    //Desencriptar credenciales
    const { user, password, database } = decryptCredentials(userEncrypt, passwordEncrypt, databaseEncrypt);

    try {
        const pool = db(user, password, database);
        const result = await pool.query('SELECT CODIGO, NOMBRE, RUC, DIRECCION, EMAIL, DIRECTORIO FROM POSTGRES.SCDETAEMPRESAS WHERE CODIGO = $1', [code]);
        
        const { directorio } = result.rows[0];
        const directorioEncrypt = encryptWord(directorio.trim());
        
        res.json({
            ok: true,
            msg: result.rows[0],
            schema: directorioEncrypt
        });

        pool.end();

    } catch (error) {
        if( error.code === '28P01' || error.code === '3D000' ){
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales incorrectas'
            });
        }else{
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: 'Ha ocurrido un error',
                // error: error
            });
        }
    }
}

const renewToken = async ( req, res = response ) => {

    const { user } = req;

    //Generar JWT
    const token = await generarJWT( user );

    res.json({
        ok: true,
        user,
        token
    });
} 

module.exports = {
    credentialsValidator,
    loginScae,
    listEmpresas,
    listEmpresaByCodigo,
    renewToken,
}