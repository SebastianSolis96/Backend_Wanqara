const { response } = require('express');
const { db } = require('../database/db');
const { decryptCredentials } = require('../helpers/decryptCredentials');
const { decryptWord } = require('../helpers/decryptWord');

const listUltimoProducto = async ( req, res = response ) => {

    const { userEncrypt, passwordEncrypt, databaseEncrypt, schemaEncrypt } = req.body

    //Desencriptar credenciales
    const { user, password, database } = decryptCredentials(userEncrypt, passwordEncrypt, databaseEncrypt);

    //Desencriptar schema
    const schema = decryptWord(schemaEncrypt);

    try {
        const pool = db(user, password, database);
        const result = await pool.query(
            `SELECT CODIGOA, NOMBREA, PRECIO_1, BODEGA, GRUPO, IMPUESTO, SERVICIO 
            FROM ${ schema }.SCDETAART ORDER BY HORA DESC LIMIT 1`);
            
        res.json({
            ok: true,
            msg: result.rows[0]
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

const listProductoByCodigo = async ( req, res = response ) => {

    const { userEncrypt, passwordEncrypt, databaseEncrypt, schemaEncrypt } = req.body

    //Desencriptar credenciales
    const { user, password, database } = decryptCredentials(userEncrypt, passwordEncrypt, databaseEncrypt);

    //Desencriptar schema
    const schema = decryptWord(schemaEncrypt);

    const { id } = req.params;
    const idUpperCase = id.toUpperCase();
    const idLowerCase = id.toLowerCase();
    const idCapital = idLowerCase.replace(/^\w/, (c) => c.toUpperCase());

    try {
        const pool = db(user, password, database);
        const result = await pool.query(
            `SELECT CODIGOA, NOMBREA, BODEGA, PRECIO_1, IMPUESTO, GRUPO, SERVICIO 
            FROM ${ schema }.SCDETAART WHERE 
            CODIGOA = $1 OR CODIGOA = $2 OR CODIGOA = $3 OR CODIGOA = $4`,
            [id, idUpperCase, idLowerCase, idCapital]);
            
        res.json({
            ok: true,
            msg: result.rows[0]
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

const listProductos = async ( req, res = response ) => {

    const { userEncrypt, passwordEncrypt, databaseEncrypt, schemaEncrypt } = req.body

    //Desencriptar credenciales
    const { user, password, database } = decryptCredentials(userEncrypt, passwordEncrypt, databaseEncrypt);

    //Desencriptar schema
    const schema = decryptWord(schemaEncrypt);

    try {
        const pool = db(user, password, database);
        const result = await pool.query(
            `SELECT CODIGOA, NOMBREA, BODEGA, PRECIO_1, IMPUESTO, GRUPO, SERVICIO 
            FROM ${ schema }.SCDETAART ORDER BY HORA DESC`);
            
        res.json({
            ok: true,
            msg: result.rows,
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

const listProductosByParam = async ( req, res = response ) => {

    const { userEncrypt, passwordEncrypt, databaseEncrypt, schemaEncrypt } = req.body

    //Desencriptar credenciales
    const { user, password, database } = decryptCredentials(userEncrypt, passwordEncrypt, databaseEncrypt);

    //Desencriptar schema
    const schema = decryptWord(schemaEncrypt);

    const { id } = req.params;
    const idUpperCase = id.toUpperCase();
    const idLowerCase = id.toLowerCase();
    const idCapital = idLowerCase.replace(/^\w/, (c) => c.toUpperCase());

    try {
        const pool = db(user, password, database);
        const result = await pool.query(
            `SELECT CODIGOA, NOMBREA, BODEGA, PRECIO_1, IMPUESTO, GRUPO, SERVICIO 
            FROM ${ schema }.SCDETAART WHERE 
            CODIGOA LIKE '%'||$1||'%' OR CODIGOA LIKE '%'||$2||'%' OR CODIGOA LIKE '%'||$3||'%' OR CODIGOA LIKE '%'||$4||'%' 
            OR NOMBREA LIKE '%'||$1||'%' OR NOMBREA LIKE '%'||$2||'%' OR NOMBREA LIKE '%'||$3||'%' OR NOMBREA LIKE '%'||$4||'%'`, 
            [id, idUpperCase, idLowerCase, idCapital]);
            
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
            return res.status(500).json({
                ok: false,
                msg: 'Ha ocurrido un error',
                error: error
            });
        }
    }
}

const saveProducto = async ( req, res = response ) => {
    
    const { userEncrypt, passwordEncrypt, databaseEncrypt, schemaEncrypt, userScae } = req.body;        
    const { codigo, nombre, bodega, precio, impuesto, grupo, servicio } = req.body;

    //Desencriptar credenciales
    const { user, password, database } = decryptCredentials(userEncrypt, passwordEncrypt, databaseEncrypt);

    //Desencriptar schema y usuario.
    const schema = decryptWord(schemaEncrypt);

    try {
        const pool = db(user, password, database);
        const result = await pool.query(
            `INSERT INTO ${ schema }.SCDETAART (CODIGOA, NOMBREA, BODEGA, GRUPO, MARCA, 
                PRECIO_1, MEDIDA, PRECIO_2, PRECIO_3, PRECIO_4, 
                PRECIO_5, PRECIO_6, PRECIO_7, PORC1, PORC2, 
                PORC3, PORC4, PORC5, PORC6, PORC7, 
                EXISTENCIA, PROVEEDOR, PRESENTACI, UNIDAD, IMPUESTO, 
                CTACON1, CTACON2, CTACON3, CTACON4, CONVERSION, 
                UBICACION, GRAFICO, PESO, TIPO1, FECHAINV, 
                BALANZA, PARTES, DCTO, ITM, STOCK_MIN, 
                STOCK_MAX, ULTING, ULTSAL, ULTDEV, FISICO, 
                AJUSTE, PEDIDO, ULTPED, FREPOS, RESERVADA, 
                DEMANDA, TVENTA, TCOMPRA, TDEVOL, COSTO_TOT, 
                SERVICIO, VALORC, REEMBOLSO, BAJA, SERIAL, 
                IMPTO2, ENSAMBLAJE, RECARGO1, RECARGO2, RECARGO3, 
                COMISION, FACTURADO, CAMBIOS, C_BARRA, N_CODIGO, 
                UTILIDAD, LISTA, COMENTARIO, HORA, USUARIO, 
                COSTO_PRO, C_TRIBU, CODIGOP, CODIGOQR, LONGITUD, 
                DIAMETRO) 
            VALUES ($1, $2, $3, $4, '', 
                $5, '', 0, 0, 0, 
                0, 0, 0, 0, 0, 
                0, 0, 0, 0, 0, 
                0, '', '', '', $6, 
                '1.1.3.01.01', '', '', '', '', 
                '', '', '', '', localtimestamp, 
                0, 0, 0, 0, 0, 
                0, localtimestamp, localtimestamp, localtimestamp, 0, 
                0, 0, localtimestamp, localtimestamp, 0, 
                0, 0, 0, 0, 0, 
                $7, 0, 0, 0, 0, 
                '', 0, 0, 0, 0, 
                0, 0, 0, '', '', 
                0, 0, '', localtimestamp, $8, 
                0, 0, 0, 0, 0, 
                '') RETURNING *`, [
                    codigo, nombre, bodega, grupo, precio, impuesto, servicio, userScae
                ]);
        
        res.json({
            ok: true,
            msg: result.rows[0]
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

const checkProductoOnInvoices = async ( req, res = response ) => {

    const { userEncrypt, passwordEncrypt, databaseEncrypt, schemaEncrypt } = req.body

    //Desencriptar credenciales
    const { user, password, database } = decryptCredentials(userEncrypt, passwordEncrypt, databaseEncrypt);

    //Desencriptar schema
    const schema = decryptWord(schemaEncrypt);

    const { id } = req.params;
    
    try {
        const pool = db(user, password, database);
        const result = await pool.query(
            `SELECT FACT.CODIGO FROM DEMOSCAE.SCRENFAC FACT INNER JOIN DEMOSCAE.SCDETAART ART 
            ON FACT.CODIGO = ART.CODIGOA WHERE CODIGOA = $1`, [id]);
        
        if( result.rows.length > 0 ){
            res.json({
                ok: true,
                msg: result.rows
            });
        }else{
            res.json({
                ok: false,
                msg: 'No existen facturas de este cliente'
            });
        }

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

const updateProducto = async ( req, res = response ) => {

    const { userEncrypt, passwordEncrypt, databaseEncrypt, schemaEncrypt } = req.body;        
    const { nombre, bodega, precio, impuesto, grupo, servicio } = req.body;

    const { id } = req.params;

    //Desencriptar credenciales
    const { user, password, database } = decryptCredentials(userEncrypt, passwordEncrypt, databaseEncrypt);

    //Desencriptar schema y usuario.
    const schema = decryptWord(schemaEncrypt);

    try {
        const pool = db(user, password, database);
        const result = await pool.query(
            `UPDATE ${ schema }.SCDETAART SET nombrea=$1, bodega=$2, grupo=$3, 
            precio_1=$4, impuesto=$5, servicio=$6 WHERE codigoa=$7 RETURNING *`, [
                nombre, bodega, grupo, precio, impuesto, servicio, id
            ]);
            
        res.json({
            ok: true,
            msg: result.rows[0]
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

const deleteProducto = async ( req, res = response ) => {

    const { userEncrypt, passwordEncrypt, databaseEncrypt, schemaEncrypt } = req.body;

    const { id } = req.params;

    //Desencriptar credenciales
    const { user, password, database } = decryptCredentials(userEncrypt, passwordEncrypt, databaseEncrypt);

    //Desencriptar schema y usuario.
    const schema = decryptWord(schemaEncrypt);

    try {
        const pool = db(user, password, database);
        const result = await pool.query(
            `DELETE FROM ${ schema }.SCDETAART WHERE codigoa=$1`, [ id ]);
        
        if( result.rowCount === 0 ){
            return res.status(404).json({
                ok: false,
                msg: 'El artículo no existe'
            });
        }

        res.status(400).json({
            ok: true,
            msg: 'Artículo eliminado',
            deleted: result.rows[0]
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

module.exports = {
    listUltimoProducto,
    listProductoByCodigo,
    listProductos,
    listProductosByParam,
    saveProducto,
    checkProductoOnInvoices,
    updateProducto,
    deleteProducto
}