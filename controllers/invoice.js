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
        //Encabezado última factura
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
            
            //Traer el código del cliente y prepararlo
            const id = ultimaFactura.cliente.trim();
            const idUpperCase = id.toUpperCase();
            const idLowerCase = id.toLowerCase();
            const idCapital = idLowerCase.replace(/^\w/, (c) => c.toUpperCase());

            //Buscar cliente de la factura por código para saber si graba IVA o no
            const poolIvaClienteFactura = db(user, password, database);
            const resultClienteFactura = await poolIvaClienteFactura.query(
                `SELECT CODIGOC, RUC, NOMBREC, DIRECCION, TELEFONO, E_MAIL, CIUDAD, REG_IVA 
                FROM ${ schema }.SCDETACLI WHERE 
                CODIGOC = $1 OR CODIGOC = $2 OR CODIGOC = $3 OR CODIGOC = $4`,
                [id, idUpperCase, idLowerCase, idCapital]);
            
            //Prepar indicador para si graba IVA o no el cliente en número
            let indicadorIvaCliente = resultClienteFactura.rows[0].reg_iva.trim();
            indicadorIvaCliente = parseInt(indicadorIvaCliente);
            
            //Agregar al objeto ultimaFactura el indicador de si el cliente en factura graba IVA o no
            ultimaFactura.clienteRegistraIva = indicadorIvaCliente;
            poolIvaClienteFactura.end();

            const poolDetalleFactura = db(user, password, database);
            const resultDetalleFactura = await poolDetalleFactura.query(
                `SELECT bodega, codigo, detalle, cantidad, 
                precio, descto, total, impuesto 
                FROM ${ schema }.screnfac where factura = $1;`
                , [ultimaFactura.factura] );
            
            ultimaFactura.listProducts = resultDetalleFactura.rows;
            poolDetalleFactura.end();
            
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