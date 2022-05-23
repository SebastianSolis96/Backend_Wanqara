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

const saveFactura = async ( req, res = response ) => {
    const { userEncrypt, passwordEncrypt, databaseEncrypt, schemaEncrypt, user:userScae } = req.body;        
    const { vendedor, dividendos, factura, listProducts, clienteRegistraIva, fecha, vence, tip, 
        bodega, comentario, cliente, ruc, nombrec, direccion, telefono, email, bruto,
        base_0, base_i, impuesto, total, neto, descto, pdescto } = req.body;
    
    //Desencriptar credenciales
    const { user, password, database } = decryptCredentials(userEncrypt, passwordEncrypt, databaseEncrypt);

    //Desencriptar schema y usuario.
    const schema = decryptWord(schemaEncrypt);

    try {
        //Traer el nombre de la bodega por el código
        const poolVendedor = db(user, password, database);
        const resultVendedor = await poolVendedor.query(`SELECT codigoven, nombreven FROM ${ schema }.scdetaven  
            WHERE codigoven = $1`, [vendedor.trim()]);
        const nombreVendedor = resultVendedor.rows[0].nombreven.trim(); //$24 = nvendedor
        poolVendedor.end();

        const poolDividendos = db(user, password, database);
        const resultDividendos = await poolDividendos.query(`SELECT codigo, detalle FROM ${ schema }.scctadiv WHERE codigo = $1`, [dividendos.trim()]);
        const nombreDividendos = resultDividendos.rows[0].detalle.trim(); //$25 = nforma

        poolDividendos.end();

        const pool = db(user, password, database);

        const result = await pool.query(
            `INSERT INTO ${ schema }.scencfac (factura, fecha, vence, tip, dividendos, 
                vendedor, bodega, comentario, cliente, ruc, 
                nombrec, direccion, telefono, email, bruto, 
                base_0, base_i, impuesto, total, neto, 
                descto, pdescto, usuario, hora, forigen, 
                fechac,  pasaporte, cajero, cf, otros, 
                guia, pedido, codtr, nomtr, cedtr, 
                placatr, empresa, directr, nvendedor, nforma, 
                ngrupo, fechas, cprecio, efectivo, cuotas, 
                dgracia, dintervalo, interes, mcuotas, c_costo, 
                asignado, grupo, fue, numcaja, cambios, 
                tip_fac, pedido_c, origen, anulado, refer1, 
                refer2, refer3, refer4, autoriza, desde, 
                hasta, fcaduca, lst, tddv, ctc, 
                baseimp2, impto2, ice, transfer, cxc, 
                cimp, fp, base_i_acc, base_i_asc, base_0_acc, 
                base_0_asc, temporada, print_cod, access_cod, auto_cod, 
                print_guia, acces_guia, auto_guia, guia_hija, carga, 
                cfrio, claveauto, horaauto, firmado, tipo_emi, 
                cmotivo, variedad, log, tcarga, tcfrio, 
                guiafirma, autoguia, guiahora, guiaclave, dae, 
                piva, motivo, pdesde, phasta, factor, 
                aumento, tarjeta1, tarjeta2, tarjeta3, montot1, 
                montot2, montot3, lote1, lote2, lote3, 
                clote, credito, cm, cuenta1, cuenta2, 
                cuenta3) 
                VALUES ($1, $2, $3, $4, $5, 
                    $6, $7, $8, $9, $10, 
                    $11, $12, $13, $14, $15, 
                    $16, $17, $18, $19, $20, 
                    $21, $22, $23, localtimestamp, '', 
                    localtimestamp, 0, '', 0, 0.00, 
                    '', '', '', '', '', 
                    '', '', '', $24, $25, 
                    '', '', '', 0.00, 0, 
                    0, '', 0, 0.00, '', 
                    0, '', '', '', 0, 
                    0, '', '', '', '', 
                    '', '', '', '', '', 
                    '', localtimestamp, '', '', '', 
                    0.00, 0.00, '', '', 0, 
                    1, '', 0.00, 0.00, 0.00, 
                    0.00, '', 0, '', '', 
                    0, '', '', '', '', 
                    '', '', '', 0, 0, 
                    '', '', '', '', '', 
                    0, '', '', '', '', 
                    0, '', '', '', 0.00, 
                    0, '', '', '', 0.00, 
                    0.00, 0.00, '', '', '', 
                    0, 0.00, 0, '', '', 
                    '') RETURNING *`, [
                        factura, fecha, vence, tip, dividendos, 
                        vendedor, bodega, comentario, cliente, ruc,
                        nombrec, direccion, telefono, email, bruto,
                        base_0, base_i, impuesto, total, neto,
                        descto, pdescto, userScae, nombreVendedor, nombreDividendos 
                    ]);

            let encabezadoGuardado = null;
            encabezadoGuardado = result.rows[0];

            pool.end();

            //Guardar detalle de la factura
            if( encabezadoGuardado ) {
                //Traer el último id y aumentar uno
                const poolId = db(user, password, database);
                const resultId = await poolId.query(`SELECT id FROM ${ schema }.screnfac order by id desc limit 1;`);
                let id = 0
                if( resultId.rows.length > 0 )
                    id = parseInt(resultId.rows[0].id);
                id = id + 1;

                poolId.end();

                let listProductsSaved = [];
                listProducts.forEach(async product => {
                    const { codigo, detalle, cantidad, precio, descto, total, bodega, impuesto } = product;
                    
                    const poolDetalle = db(user, password, database);
                    const resultDetalle = await poolDetalle.query(
                        `INSERT INTO ${ schema }.screnfac (factura, codigo, detalle, cantidad, precio, 
                            descto, total, bodega, impuesto, usuario, 
                            hora, convertir, comentario, completo, unidad, 
                            serial, detserial, fechaser, reembolso, uconvertir, 
                            nomgru, c_costo, medida, origen, cambios, 
                            bonifica, comenn, servicio, c_barra, activo, 
                            deducible, tipo, ptarj, id) 
                            VALUES ($1, $2, $3, $4, $5, 
                                $6, $7, $8, $9, $10, 
                                localtimestamp, 0.00, '', 1, 'UND', 
                                '', '', localtimestamp, 0.00, '', 
                                '', '', 0.00, 'FAC', 0, 
                                0.00, '', 0, '', 0, 
                                1, '', 0.00, $11) RETURNING *`, [
                                    factura, codigo, detalle, cantidad, precio,
                                    descto, total, bodega, impuesto, userScae, id
                                ]);
                                
                    //ME QUEDÉ AQUÍ
                    listProductsSaved.push({...resultDetalle.rows[0]});
                    console.log(listProductsSaved);
                    poolDetalle.end();
                });
                
                if( listProductsSaved.length > 0 ) {
                    const activeInvoice = { 
                        ...encabezadoGuardado, 
                        listProducts: listProductsSaved, 
                        clienteRegistraIva: clienteRegistraIva,
                    };

                    return res.json({
                        ok: true,
                        msg: activeInvoice
                    });

                }else{
                    return res.status(400).json({
                        ok: false,
                        msg: 'Error al guardar el detalle de la factura'
                    });
                }

            }else{
                res.json({
                    ok: false,
                    msg: 'Error al guardar el encabezado de la factura'
                });
            }

    } catch (error) {
        console.log(error);
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
    saveFactura,
}