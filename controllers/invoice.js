const { response } = require('express');
const { db } = require('../database/db');
const { decryptCredentials } = require('../helpers/decryptCredentials');
const { decryptWord } = require('../helpers/decryptWord');

const porcentajeIva = async ( req, res = response ) => {
    const { userEncrypt, passwordEncrypt, databaseEncrypt, schemaEncrypt } = req.body

    //Desencriptar credenciales
    const { user, password, database } = decryptCredentials(userEncrypt, passwordEncrypt, databaseEncrypt);

    //Desencriptar schema
    const schema = decryptWord(schemaEncrypt);

    try {
        const pool = db(user, password, database);
        const result = await pool.query(
            `SELECT impuesto FROM ${ schema }.scconprm`);
            
        res.json({
            ok: true,
            msg: result.rows[0].impuesto
        });

        pool.end();

    } catch (error) {
        if( error.code === '28P01' || error.code === '3D000' ){
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales incorrectas'
            });
        }else{
            return res.status(500).json({
                ok: false,
                msg: 'Ha ocurrido un error',
                error: error
            });
        }
    }
}

const importaExistencias = async ( req, res = response ) => {
    const { userEncrypt, passwordEncrypt, databaseEncrypt, schemaEncrypt } = req.body

    //Desencriptar credenciales
    const { user, password, database } = decryptCredentials(userEncrypt, passwordEncrypt, databaseEncrypt);

    //Desencriptar schema
    const schema = decryptWord(schemaEncrypt);

    try {
        const pool = db(user, password, database);
        const result = await pool.query(
            `SELECT invcero FROM ${ schema }.scconprm`);
        
        res.json({
            ok: true,
            msg: result.rows[0].invcero
        });

        pool.end();

    } catch (error) {
        if( error.code === '28P01' || error.code === '3D000' ){
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales incorrectas'
            });
        }else{
            return res.status(500).json({
                ok: false,
                msg: 'Ha ocurrido un error',
                error: error
            });
        }
    }
}

const listUltimaFactura = async ( req, res = response ) => {

    const { userEncrypt, passwordEncrypt, databaseEncrypt, schemaEncrypt } = req.body

    //Desencriptar credenciales
    const { user, password, database } = decryptCredentials(userEncrypt, passwordEncrypt, databaseEncrypt);

    //Desencriptar schema
    const schema = decryptWord(schemaEncrypt);

    try {
        const pool = db(user, password, database);
        const result = await pool.query(
            `SELECT factura, fecha, vence, tip, dividendos, vendedor, bodega, comentario, 
            cliente, ruc, nombrec, direccion, telefono, email, 
            bruto, base_0, base_i, impuesto, total, autoriza, neto, descto, pdescto 
            FROM ${ schema }.scencfac ORDER BY factura DESC LIMIT 1`);
        
        let ultimaFactura;
        if( result.rows.length > 0 ){

            ultimaFactura = result.rows[0];
            pool.end();

            const pool1 = db(user, password, database);
            const result1 = await pool1.query(
                `SELECT bodega, codigo, detalle, cantidad, 
                precio, descto, total, impuesto 
                FROM ${ schema }.screnfac where factura = $1;`
                , [ultimaFactura.factura] );
            
            ultimaFactura.listProducts = result1.rows;
            console.log(ultimaFactura);
            pool1.end();
        }else
            ultimaFactura = {};

        res.json({
            ok: true,
            msg: ultimaFactura
        });

    } catch (error) {
        if( error.code === '28P01' || error.code === '3D000' ){
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales incorrectas'
            });
        }else{
            return res.status(500).json({
                ok: false,
                msg: 'Ha ocurrido un error',
                error: error
            });
        }
    }
}

module.exports = {
    porcentajeIva,
    importaExistencias,
    listUltimaFactura,
}