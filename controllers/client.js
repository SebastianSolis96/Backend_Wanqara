const { response } = require('express');
const { db } = require('../database/db');
const { decryptCredentials } = require('../helpers/decryptCredentials');
const { decryptWord } = require('../helpers/decryptWord');

const listUltimoCliente = async ( req, res = response ) => {

    const { userEncrypt, passwordEncrypt, databaseEncrypt, schemaEncrypt } = req.body

    //Desencriptar credenciales
    const { user, password, database } = decryptCredentials(userEncrypt, passwordEncrypt, databaseEncrypt);

    //Desencriptar schema
    const schema = decryptWord(schemaEncrypt);

    try {
        const pool = db(user, password, database);
        const result = await pool.query(
            `SELECT CODIGOC, RUC, NOMBREC, DIRECCION, TELEFONO, E_MAIL, CIUDAD, REG_IVA 
            FROM ${ schema }.SCDETACLI ORDER BY HORA DESC LIMIT 1`);
        
        pool.end();
            
        res.json({
            ok: true,
            msg: result.rows[0]
        });

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

const listClienteByCodigo = async ( req, res = response ) => {

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
            `SELECT CODIGOC, RUC, NOMBREC, DIRECCION, TELEFONO, E_MAIL, CIUDAD, REG_IVA 
            FROM ${ schema }.SCDETACLI WHERE 
            CODIGOC = $1 OR CODIGOC = $2 OR CODIGOC = $3 OR CODIGOC = $4`,
            [id, idUpperCase, idLowerCase, idCapital]);
            
        pool.end();

        res.json({
            ok: true,
            msg: result.rows[0]
        });

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

const listClientes = async ( req, res = response ) => {
    const { userEncrypt, passwordEncrypt, databaseEncrypt, schemaEncrypt } = req.body

    //Desencriptar credenciales
    const { user, password, database } = decryptCredentials(userEncrypt, passwordEncrypt, databaseEncrypt);

    //Desencriptar schema
    const schema = decryptWord(schemaEncrypt);

    try {
        const pool = db(user, password, database);
        const result = await pool.query(
            `SELECT CODIGOC, RUC, NOMBREC, DIRECCION, TELEFONO, E_MAIL, CIUDAD, REG_IVA 
            FROM ${ schema }.SCDETACLI  ORDER BY HORA DESC`);
            
        pool.end();

        res.json({
            ok: true,
            msg: result.rows,
        });

    } catch (error) {
        console.log(error);
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

const listClientesByParam = async ( req, res = response ) => {

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
            `SELECT CODIGOC, RUC, NOMBREC, DIRECCION, TELEFONO, E_MAIL, CIUDAD, REG_IVA 
            FROM ${ schema }.SCDETACLI WHERE 
            CODIGOC LIKE '%'||$1||'%' OR CODIGOC LIKE '%'||$2||'%' OR CODIGOC LIKE '%'||$3||'%' OR CODIGOC LIKE '%'||$4||'%' 
            OR RUC LIKE '%'||$1||'%' OR RUC LIKE '%'||$2||'%' OR RUC LIKE '%'||$3||'%' OR RUC LIKE '%'||$4||'%' 
            OR NOMBREC LIKE '%'||$1||'%' OR NOMBREC LIKE '%'||$2||'%' OR NOMBREC LIKE '%'||$3||'%' OR NOMBREC LIKE '%'||$4||'%'`, 
            [id, idUpperCase, idLowerCase, idCapital]);
            
        pool.end();

        res.json({
            ok: true,
            msg: result.rows
        });

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

const checkClientOnInvoices = async ( req, res = response ) => {

    const { userEncrypt, passwordEncrypt, databaseEncrypt, schemaEncrypt } = req.body

    //Desencriptar credenciales
    const { user, password, database } = decryptCredentials(userEncrypt, passwordEncrypt, databaseEncrypt);

    //Desencriptar schema
    const schema = decryptWord(schemaEncrypt);

    const { id } = req.params;
    
    try {
        const pool = db(user, password, database);
        const result = await pool.query(
            `SELECT FACT.CLIENTE FROM ${ schema }.SCENCFAC FACT INNER JOIN ${ schema }.SCDETACLI CLI 
            ON FACT.CLIENTE = CLI.CODIGOC WHERE CODIGOC = $1`, [id]);
        
        pool.end();

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

const saveCliente = async ( req, res = response ) => {
    console.log('xdd');
    const { userEncrypt, passwordEncrypt, databaseEncrypt, schemaEncrypt, userScae } = req.body;        
    let { codigo, ruc, nombre, grabaIva, direccion, telefono, correo } = req.body;

    if(!direccion || direccion === null)
        direccion = '';
    
    if(!telefono || telefono === null)
        telefono = '';
    
    if(!correo || correo === null)
        correo = '';

    //Desencriptar credenciales
    const { user, password, database } = decryptCredentials(userEncrypt, passwordEncrypt, databaseEncrypt);

    //Desencriptar schema y usuario.
    const schema = decryptWord(schemaEncrypt);

    try {
        const pool = db(user, password, database);
        const result = await pool.query(
            `INSERT INTO ${ schema }.SCDETACLI (codigoc, nombrec, grupo, ruc, contacto, 
                codigocont, ciudad, ref_contac, pasaporte, direccion, 
                direc2, telefono, e_mail, fax, mtdtabcom, 
                estatus, limite_cre, dia_cre, transporte, trans, 
                descuento, comentario, zona, cobrador, vendedor, 
                juri, saldo, f_ult_pag, totvendido, reg_iva, 
                impuesto, edo, banco, ctabanco, sucur, 
                tipo, nomb_c, cedu_c, dir1_c, dir2_c, 
                dir3_c, tel1_c, tel2_c, zona_c, dividendos, 
                recargo, rlegal, nzona, tipcli, mas1, 
                mas2, mas3, mas4, mas5, mas6, 
                mas7, mas8, mas9, mas10, lprecio, 
                pais, carga, principal, scliente, empleado, 
                cambios, grafico, hora, usuario, provincia, 
                canton, parroquia, sexo, estado_c, natu, 
                origen_i, rela, for_pago, cuenta, c_banco, corriente) 
            VALUES ($1, $2, '', $3, $2, 
                '1.1.2.02.01', '', '', 0, $4, 
                '', $5, $6, '', '', 
                '', 99999999.99, 0, '', '', 
                0, '', '', '', '', 
                '', 0, localtimestamp, 0, $7, 
                '', '', '', '', '', 
                '', '', '', '', '', 
                '', '', '', '', '', 
                0, '', '', '', '', 
                '', '', '', '', '', 
                '', '', '', '', '', 
                '', 0, 0, '', '', 
                0, '', localtimestamp, $8, '', 
                '', '', '', '', 0, 
                '', 0, '', '', '', 0) RETURNING *`, [
                    codigo, nombre, ruc, direccion, telefono, correo, grabaIva, userScae
                ]);

        pool.end(); 

        res.json({
            ok: true,
            msg: result.rows[0]
        });

    } catch (error) {
        if( error.code === '28P01' || error.code === '3D000' ){
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales incorrectas'
            });
        }else{
            if( error.code === '23505' ){
                return res.status(500).json({
                    ok: false,
                    msg: 'El cliente ya existe',
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
}

const updateCliente = async ( req, res = response ) => {

    const { userEncrypt, passwordEncrypt, databaseEncrypt, schemaEncrypt } = req.body;        
    let { ruc, nombre, grabaIva, direccion, telefono, correo } = req.body;

    const { id } = req.params;

    if(!direccion || direccion === null)
        direccion = '';
    
    if(!telefono || telefono === null)
        telefono = '';
    
    if(!correo || correo === null)
        correo = '';

    //Desencriptar credenciales
    const { user, password, database } = decryptCredentials(userEncrypt, passwordEncrypt, databaseEncrypt);

    //Desencriptar schema y usuario.
    const schema = decryptWord(schemaEncrypt);

    try {
        const pool = db(user, password, database);
        const result = await pool.query(
            `UPDATE ${ schema }.SCDETACLI SET nombrec=$1, ruc=$2, direccion=$3, 
            telefono=$4, e_mail=$5, reg_iva=$6 WHERE codigoc=$7 RETURNING *`, [
                nombre, ruc, direccion, telefono, correo, grabaIva, id
            ]);

        pool.end();
            
        res.json({
            ok: true,
            msg: result.rows[0]
        });

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

const deleteCliente = async ( req, res = response ) => {

    const { userEncrypt, passwordEncrypt, databaseEncrypt, schemaEncrypt } = req.body;

    const { id } = req.params;

    //Desencriptar credenciales
    const { user, password, database } = decryptCredentials(userEncrypt, passwordEncrypt, databaseEncrypt);

    //Desencriptar schema y usuario.
    const schema = decryptWord(schemaEncrypt);

    try {
        const pool = db(user, password, database);
        const result = await pool.query(
            `DELETE FROM ${ schema }.SCDETACLI WHERE codigoc=$1 RETURNING *`, [ id ]);
        
        if( result.rowCount === 0 ){
            return res.status(404).json({
                ok: false,
                msg: 'El cliente no existe'
            });
        }

        pool.end();
        
        res.status(400).json({
            ok: true,
            msg: 'Cliente eliminado',
            deleted: result.rows[0]
        });

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

module.exports = {
    listUltimoCliente,
    listClientes,
    listClienteByCodigo,
    listClientesByParam,
    checkClientOnInvoices,
    saveCliente,
    updateCliente,
    deleteCliente
}