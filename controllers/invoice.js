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
        
        pool.end();

        res.json({
            ok: true,
            msg: result.rows[0].impuesto
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
        
        pool.end();
        
        res.json({
            ok: true,
            msg: result.rows[0].invcero
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
            bruto, base_0, base_i, impuesto, total, autoriza, neto, descto, pdescto, cmotivo, anulado, 
            nforma, claveauto, horaauto 
            FROM ${ schema }.scencfac ORDER BY factura DESC LIMIT 1`);
        
        let ultimaFactura;
        
        pool.end();

        if( result.rows.length > 0 ){
            ultimaFactura = result.rows[0];
            
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
            let indicadorIvaCliente = resultClienteFactura.rows[0]?.reg_iva?.trim() || '0';
            
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
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: 'Ha ocurrido un error',
                // error: error
            });
        }
    }
}

const listFacturaByNumber  = async (req, res) => {
    const { userEncrypt, passwordEncrypt, databaseEncrypt, schemaEncrypt } = req.body;
    const { id } = req.params;

    //Desencriptar credenciales
    const { user, password, database } = decryptCredentials(userEncrypt, passwordEncrypt, databaseEncrypt);

    //Desencriptar schema y usuario.
    const schema = decryptWord(schemaEncrypt);
    try {
        //Encabezado última factura
        const pool = db(user, password, database);
        const result = await pool.query(
            `SELECT factura, fecha, vence, tip, dividendos, vendedor, bodega, comentario, 
            cliente, ruc, nombrec, direccion, telefono, email, 
            bruto, base_0, base_i, impuesto, total, autoriza, neto, descto, pdescto, cmotivo, anulado, 
            nforma, claveauto, horaauto    
            FROM ${ schema }.scencfac WHERE factura = $1`, [id]);
        
        pool.end();

        let facturaEncontrada;
        if( result.rows.length > 0 ){

            facturaEncontrada = result.rows[0];
            
            //Traer el código del cliente y prepararlo
            const idCliente = facturaEncontrada.cliente.trim();
            const idUpperCase = idCliente.toUpperCase();
            const idLowerCase = idCliente.toLowerCase();
            const idCapital = idLowerCase.replace(/^\w/, (c) => c.toUpperCase());

            //Buscar cliente de la factura por código para saber si graba IVA o no
            const poolIvaClienteFactura = db(user, password, database);
            const resultClienteFactura = await poolIvaClienteFactura.query(
                `SELECT CODIGOC, RUC, NOMBREC, DIRECCION, TELEFONO, E_MAIL, CIUDAD, REG_IVA 
                FROM ${ schema }.SCDETACLI WHERE 
                CODIGOC = $1 OR CODIGOC = $2 OR CODIGOC = $3 OR CODIGOC = $4`,
                [idCliente, idUpperCase, idLowerCase, idCapital]);
            
            //Preparar indicador para si graba IVA o no el cliente en número
            let indicadorIvaCliente = resultClienteFactura.rows[0].reg_iva.trim();
            indicadorIvaCliente = parseInt(indicadorIvaCliente);
            
            //Agregar al objeto facturaEncontrada el indicador de si el cliente en factura graba IVA o no
            facturaEncontrada.clienteRegistraIva = indicadorIvaCliente;
            poolIvaClienteFactura.end();

            const poolDetalleFactura = db(user, password, database);
            const resultDetalleFactura = await poolDetalleFactura.query(
                `SELECT bodega, codigo, detalle, cantidad, 
                precio, descto, total, impuesto 
                FROM ${ schema }.screnfac where factura = $1;`
                , [facturaEncontrada.factura] );
            
            facturaEncontrada.listProducts = resultDetalleFactura.rows;
            poolDetalleFactura.end();
            
        }else
            facturaEncontrada = {};

        res.json({
            ok: true,
            msg: facturaEncontrada
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

// const saveDetalle = async( listProducts, id, schema, userScae, user, password, database, factura ) => {
//     listProducts.forEach(async (product) => {
//         const { codigo, detalle, cantidad, precio, descto, total, bodega, impuesto } = product;
//         const poolDetalle = db(user, password, database);
//         const resultDetalle = await poolDetalle.query(
//             `INSERT INTO ${ schema }.screnfac (factura, codigo, detalle, cantidad, precio, 
//                 descto, total, bodega, impuesto, usuario, 
//                 hora, convertir, comentario, completo, unidad, 
//                 serial, detserial, fechaser, reembolso, uconvertir, 
//                 nomgru, c_costo, medida, origen, cambios, 
//                 bonifica, comenn, servicio, c_barra, activo, 
//                 deducible, tipo, ptarj, id) 
//                 VALUES ($1, $2, $3, $4, $5, 
//                     $6, $7, $8, $9, $10, 
//                     localtimestamp, 0.00, '', 1, 'UND', 
//                     '', '', localtimestamp, 0.00, '', 
//                     '', '', 0.00, 'FAC', 0, 
//                     0.00, '', 0, '', 0, 
//                     1, '', 0.00, $11) RETURNING *`, [
//                         factura, codigo, detalle, cantidad, precio,
//                         descto, total, bodega, impuesto, userScae, id
//                     ]);
//         poolDetalle.end();
//     });
//     // console.log(resultDetalle);
//     // poolDetalle.end();
// }

const lastNumFactura = async ( req, res = response ) => {
    const { userEncrypt, passwordEncrypt, databaseEncrypt, schemaEncrypt } = req.body;

    //Desencriptar credenciales
    const { user, password, database } = decryptCredentials(userEncrypt, passwordEncrypt, databaseEncrypt);

    //Desencriptar schema
    const schema = decryptWord(schemaEncrypt);

    try {
        const pool = db(user, password, database);
        const result = await pool.query(
            `SELECT factura FROM ${ schema }.scencfac ORDER BY factura DESC LIMIT 1`);
        pool.end();
        
        if( result.rows.length > 0 ){
            res.json({
                ok: true,
                msg: result.rows[0].factura
            });
        }else{
            res.json({
                ok: true,
                msg: null
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

const lastNumFacturaSucursal = async ( req, res = response ) => {
    const { userEncrypt, passwordEncrypt, databaseEncrypt, schemaEncrypt, myBranch } = req.body;

    //Desencriptar credenciales
    const { user, password, database } = decryptCredentials(userEncrypt, passwordEncrypt, databaseEncrypt);

    //Desencriptar schema
    const schema = decryptWord(schemaEncrypt);

    try {
        const pool = db(user, password, database);
        const result = await pool.query(
            `SELECT factura FROM ${ schema }.scencfac 
            WHERE SUBSTR(FACTURA,1,$1)=$2
            ORDER BY 1 DESC LIMIT 1`, [ myBranch.trim().length, myBranch.trim() ]);
        pool.end();
        
        if( result.rows.length > 0 ){
            res.json({
                ok: true,
                msg: result.rows[0].factura
            });
        }else{
            res.json({
                ok: true,
                msg: null
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

const saveFactura = async ( req, res = response ) => {
    const { userEncrypt, passwordEncrypt, databaseEncrypt, schemaEncrypt, user:userScae } = req.body;        
    const { vendedor, dividendos, factura, listProducts, clienteRegistraIva, fecha, vence, tip, 
        bodega, comentario, cliente, ruc, nombrec, direccion, telefono, email, bruto,
        base_0, base_i, impuesto, total, neto, descto, pdescto } = req.body;

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
                
                let listProductsSaved = [];
                const listProductsLength = listProducts.length;

                for( let i = 0; i < listProductsLength; i++ ) {

                    //Traer el último id y aumentar uno
                    const poolId = db(user, password, database);
                    const resultId = await poolId.query(`SELECT id FROM ${ schema }.screnfac order by id desc limit 1;`);
                    let id = 0
                    if( resultId.rows.length > 0 )
                        id = parseInt(resultId.rows[0].id);
                    id = id + 1;

                    poolId.end();

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
                                $12, '', 0.00, 'FAC', 0, 
                                0.00, '', $13, '', 0, 
                                1, '', 0.00, $11) RETURNING *`, [
                                factura, listProducts[i].codigo, listProducts[i].detalle, listProducts[i].cantidad, 
                                listProducts[i].precio, listProducts[i].descto, listProducts[i].total, 
                                listProducts[i].bodega, listProducts[i].impuesto, userScae, id, 
                                listProducts[i].grupo, parseInt(listProducts[i].servicio) ]);
                    // console.log(resultDetalle.rows[0]);
                    listProductsSaved.push(resultDetalle.rows[0]);

                    poolDetalle.end();
                }
                
                if( listProductsSaved.length > 0 ) {
                    const listProductsSavedPrepared = listProductsSaved.map( (item) => {
                        return {
                            bodega: item.bodega.trim(),
                            codigo: item.codigo.trim(),
                            detalle: item.detalle.trim(),
                            precio: item.precio.trim(),
                            impuesto: item.impuesto.trim(),
                            cantidad: item.cantidad.trim(),
                            descto: parseFloat(item.descto.trim()).toFixed(2),
                            total: item.total.trim(),
                        }
                    });

                    const activeInvoice = { 
                        factura: encabezadoGuardado.factura.trim(),
                        dividendos: encabezadoGuardado.dividendos.trim(),
                        vendedor: encabezadoGuardado.vendedor.trim(),
                        bodega: encabezadoGuardado.bodega.trim(),
                        comentario: encabezadoGuardado.comentario.trim(),
                        fecha: encabezadoGuardado.fecha,
                        vence: encabezadoGuardado.vence,
                        tip: encabezadoGuardado.tip.trim(),
                        cliente: encabezadoGuardado.cliente.trim(),
                        ruc: encabezadoGuardado.ruc.trim(),
                        nombrec: encabezadoGuardado.nombrec.trim(),
                        direccion: encabezadoGuardado.direccion.trim(),
                        telefono: encabezadoGuardado.telefono.trim(),
                        email: encabezadoGuardado.email.trim(),
                        clienteRegistraIva: clienteRegistraIva,
                        listProducts: listProductsSavedPrepared,
                        base_0: parseFloat(encabezadoGuardado.base_0.trim()).toFixed(2),
                        base_i: parseFloat(encabezadoGuardado.base_i.trim()).toFixed(2),
                        bruto: parseFloat(encabezadoGuardado.bruto.trim()).toFixed(2),
                        descto: encabezadoGuardado.descto.trim(),
                        impuesto: encabezadoGuardado.impuesto.trim(),
                        neto: parseFloat(encabezadoGuardado.neto.trim()).toFixed(2),
                        pdescto: parseFloat(encabezadoGuardado.pdescto.trim()).toFixed(2),
                        total: encabezadoGuardado.total.trim(),
                    };
                    
                    // const poolScae = db(user, password, database);
                    // const respScae = await poolScae.query(`select existencias(?xcodi,?xbodi)`);
                    // poolScae.end();
                    // console.log(respScae);
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
            if( error.code === '23505' ){
                return res.status(500).json({
                    ok: false,
                    msg: 'La factura ya existe',
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

const updateFactura = async ( req, res = response ) => {
    const { userEncrypt, passwordEncrypt, databaseEncrypt, schemaEncrypt, user:userScae } = req.body;        
    const { vendedor, dividendos, factura, listProducts, clienteRegistraIva, fecha, vence, tip, 
        bodega, comentario, cliente, ruc, nombrec, direccion, telefono, email, bruto,
        base_0, base_i, impuesto, total, neto, descto, pdescto, id } = req.body;
        
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
            `UPDATE ${ schema }.scencfac SET fecha=$1, vence=$2, tip=$3, dividendos=$4, 
                vendedor=$5, bodega=$6, comentario=$7, cliente=$8, ruc=$9, 
                nombrec=$10, direccion=$11, telefono=$12, email=$13, bruto=$14, 
                base_0=$15, base_i=$16, impuesto=$17, total=$18, neto=$19, 
                descto=$20, pdescto=$21, usuario=$22, nvendedor=$23, nforma=$24, hora=localtimestamp 
                WHERE factura=$25 RETURNING *`, [
                        fecha, vence, tip, dividendos, 
                        vendedor, bodega, comentario, cliente, ruc,
                        nombrec, direccion, telefono, email, bruto,
                        base_0, base_i, impuesto, total, neto,
                        descto, pdescto, userScae, nombreVendedor, nombreDividendos, factura 
                    ]);

            let encabezadoGuardado = null;
            encabezadoGuardado = result.rows[0];
            
            pool.end();

            //Guardar detalle de la factura
            if( encabezadoGuardado ) {
                //Eliminar productos para guardar actializados.
                const poolDelete = db(user, password, database);
                const resultDelete = await poolDelete.query(`DELETE FROM ${ schema }.screnfac WHERE factura=$1 RETURNING *`, [factura]);
                poolDelete.end();

                if( resultDelete.rowCount === 0 ){
                    return res.status(404).json({
                        ok: false,
                        msg: 'Problemas al editar el detalle de la factura'
                    });
                }

                //Volver a guardar los productos.
                let listProductsSaved = [];
                const listProductsLength = listProducts.length;

                for( let i = 0; i < listProductsLength; i++ ) {

                    //Traer el último id y aumentar uno
                    const poolId = db(user, password, database);
                    const resultId = await poolId.query(`SELECT id FROM ${ schema }.screnfac order by id desc limit 1;`);
                    let idItem = 0
                    if( resultId.rows.length > 0 )
                        idItem = parseInt(resultId.rows[0].id);
                    idItem = idItem + 1;

                    poolId.end();

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
                                factura, listProducts[i].codigo, listProducts[i].detalle, listProducts[i].cantidad, 
                                listProducts[i].precio, listProducts[i].descto, listProducts[i].total, 
                                listProducts[i].bodega, listProducts[i].impuesto, userScae, idItem ]);
                    
                    listProductsSaved.push(resultDetalle.rows[0]);

                    poolDetalle.end();
                }
                
                if( listProductsSaved.length > 0 ) {
                    const listProductsSavedPrepared = listProductsSaved.map( (item) => {
                        return {
                            bodega: item.bodega.trim(),
                            codigo: item.codigo.trim(),
                            detalle: item.detalle.trim(),
                            precio: item.precio.trim(),
                            impuesto: item.impuesto.trim(),
                            cantidad: item.cantidad.trim(),
                            descto: parseFloat(item.descto.trim()).toFixed(2),
                            total: item.total.trim(),
                        }
                    });

                    const activeInvoice = { 
                        factura: encabezadoGuardado.factura.trim(),
                        dividendos: encabezadoGuardado.dividendos.trim(),
                        vendedor: encabezadoGuardado.vendedor.trim(),
                        bodega: encabezadoGuardado.bodega.trim(),
                        comentario: encabezadoGuardado.comentario.trim(),
                        fecha: encabezadoGuardado.fecha,
                        vence: encabezadoGuardado.vence,
                        tip: encabezadoGuardado.tip.trim(),
                        cliente: encabezadoGuardado.cliente.trim(),
                        ruc: encabezadoGuardado.ruc.trim(),
                        nombrec: encabezadoGuardado.nombrec.trim(),
                        direccion: encabezadoGuardado.direccion.trim(),
                        telefono: encabezadoGuardado.telefono.trim(),
                        email: encabezadoGuardado.email.trim(),
                        clienteRegistraIva: clienteRegistraIva,
                        listProducts: listProductsSavedPrepared,
                        base_0: parseFloat(encabezadoGuardado.base_0.trim()).toFixed(2),
                        base_i: parseFloat(encabezadoGuardado.base_i.trim()).toFixed(2),
                        bruto: parseFloat(encabezadoGuardado.bruto.trim()).toFixed(2),
                        descto: encabezadoGuardado.descto.trim(),
                        impuesto: encabezadoGuardado.impuesto.trim(),
                        neto: parseFloat(encabezadoGuardado.neto.trim()).toFixed(2),
                        pdescto: parseFloat(encabezadoGuardado.pdescto.trim()).toFixed(2),
                        total: encabezadoGuardado.total.trim(),
                    };
                    
                    return res.json({
                        ok: true,
                        msg: activeInvoice
                    });

                }else{
                    return res.status(400).json({
                        ok: false,
                        msg: 'Error al editar el detalle de la factura'
                    });
                }

            }else{
                res.json({
                    ok: false,
                    msg: 'Error al editar el encabezado de la factura'
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

const deleteFactura = async (req, res) => {
    const { userEncrypt, passwordEncrypt, databaseEncrypt, schemaEncrypt } = req.body;
    const { id } = req.params;

    //Desencriptar credenciales
    const { user, password, database } = decryptCredentials(userEncrypt, passwordEncrypt, databaseEncrypt);

    //Desencriptar schema y usuario.
    const schema = decryptWord(schemaEncrypt);
    try {
        const pool = db(user, password, database);
        const result = await pool.query(`DELETE FROM ${ schema }.scencfac WHERE factura = $1 RETURNING *`, [id]);
        pool.end();
        if( result.rowCount > 0 ) {
            return res.json({
                ok: true,
                msg: 'Factura eliminada',
                deleted: result.rows[0]
            });
        }

        if( result.rowCount === 0 ){
            return res.status(404).json({
                ok: false,
                msg: 'La factura no existe'
            });
        }

        return res.status(400).json({
            ok: false,
            msg: 'Error al eliminar la factura'
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

const firmaFactura = async (req, res) => {
    const { userEncrypt, passwordEncrypt, databaseEncrypt, schemaEncrypt } = req.body;
    const { id } = req.params;

    //Desencriptar credenciales
    const { user, password, database } = decryptCredentials(userEncrypt, passwordEncrypt, databaseEncrypt);

    //Desencriptar schema y usuario.
    const schema = decryptWord(schemaEncrypt);
    try {
        const pool = db(user, password, database);
        const result = await pool.query(`SELECT factura FROM ${ schema }.scencfac 
        WHERE length(autoriza) < 47 AND factura = $1`, [id]);
        // WHERE autoriza = '' AND factura = $1`, [id]);
        
        pool.end();
        
        if( result.rowCount > 0 ) {
            const poolFirma = db(user, password, database);
            const resultFirma = await poolFirma.query(`UPDATE ${ schema }.scencfac SET autoriza = 'APP' 
            WHERE factura = $1 RETURNING *`, [id]);

            poolFirma.end();

            if( resultFirma.rowCount > 0 ) {
                return res.json({
                    ok: true,
                    msg: 'Factura firmada',
                    firmada: result.rows[0]
                });
            }
            
            if( resultFirma.rowCount === 0 ){
                return res.status(404).json({
                    ok: false,
                    msg: 'La factura ya está firmada o no existe'
                });
            }
        }


        return res.status(400).json({
            ok: false,
            msg: 'Error al firmar la factura'
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

const listFacturasByParam = async ( req, res = response ) => {

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
            `SELECT FACTURA, FECHA, RUC, NOMBREC, TOTAL 
            FROM ${ schema }.scencfac WHERE 
            FACTURA LIKE '%'||$1||'%' OR FACTURA LIKE '%'||$2||'%' OR FACTURA LIKE '%'||$3||'%' OR FACTURA LIKE '%'||$4||'%' 
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

const listFacturasParaAnular = async ( req, res = response ) => {

    const { userEncrypt, passwordEncrypt, databaseEncrypt, schemaEncrypt } = req.body

    //Desencriptar credenciales
    const { user, password, database } = decryptCredentials(userEncrypt, passwordEncrypt, databaseEncrypt);

    //Desencriptar schema
    const schema = decryptWord(schemaEncrypt);

    try {
        const pool = db(user, password, database);
        const result = await pool.query(
            `SELECT factura, fecha, comentario
            FROM ${ schema }.scencfac WHERE anulado = 'P'`);
            
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

const anularFactura = async ( req, res = response ) => {
    const { userEncrypt, passwordEncrypt, databaseEncrypt, schemaEncrypt, invoicesList } = req.body; 
    const { user, password, database } = decryptCredentials(userEncrypt, passwordEncrypt, databaseEncrypt);
    //Desencriptar schema y usuario.
    const schema = decryptWord(schemaEncrypt);

    try {

        let checkCancelledInvoicesList = [];

        for( let i = 0; i < invoicesList.length ; i++ ) {
            const pool = db(user, password, database);

            const result = await pool.query(
                `UPDATE ${ schema }.scencfac SET anulado = 'S'  
                    WHERE factura=$1 RETURNING *`, [ invoicesList[i] ]);

            checkCancelledInvoicesList.push(result.rows[0]);
            
            pool.end();
        }
        console.log(checkCancelledInvoicesList);

        if( checkCancelledInvoicesList.length === invoicesList.length ){
            return res.json({
                ok: true,
                msg: checkCancelledInvoicesList
            });
        }else{
            return res.status(400).json({
                ok: false,
                msg: 'No se anularon todas las facturas seleccionadas. Por favor vuelva a intentarlo'
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

const deleteErrorFirma = async (req, res) => {
    const { userEncrypt, passwordEncrypt, databaseEncrypt, schemaEncrypt } = req.body;
    const { id } = req.params;

    //Desencriptar credenciales
    const { user, password, database } = decryptCredentials(userEncrypt, passwordEncrypt, databaseEncrypt);

    //Desencriptar schema y usuario.
    const schema = decryptWord(schemaEncrypt);
    try {
        //Encabezado última factura
        const pool = db(user, password, database);
        const result = await pool.query(
            `UPDATE ${ schema }.scencfac SET cmotivo = '' WHERE factura = $1`, [id]);
        
        pool.end();

        if( result.rowCount > 0 ) {
            return res.json({
                ok: true,
                msg: 'Error eliminado',
            });
        }

        return res.status(400).json({
            ok: false,
            msg: 'No se ha podido eliminar el error',
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

const anularUnaFactura = async (req, res) => {
    const { userEncrypt, passwordEncrypt, databaseEncrypt, schemaEncrypt } = req.body;
    const { id } = req.params;

    //Desencriptar credenciales
    const { user, password, database } = decryptCredentials(userEncrypt, passwordEncrypt, databaseEncrypt);

    //Desencriptar schema y usuario.
    const schema = decryptWord(schemaEncrypt);
    try {
        //Encabezado última factura
        const pool = db(user, password, database);
        const result = await pool.query(
            `UPDATE ${ schema }.scencfac SET anulado = 'S', total = 0.00, bruto = 0.00, neto = 0.00, 
            impuesto = 0.00, base_i = 0.00, base_0 = 0.00 
            WHERE factura = $1`, [id]);
        
        pool.end();

        if( result.rowCount > 0 ) {
            return res.json({
                ok: true,
                msg: 'Factura anulada',
            });
        }

        return res.status(400).json({
            ok: false,
            msg: 'No se ha podido anular la factura',
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

const listAllFacturasToReport = async ( req, res = response ) => {

    const { userEncrypt, passwordEncrypt, databaseEncrypt, schemaEncrypt } = req.body

    //Desencriptar credenciales
    const { user, password, database } = decryptCredentials(userEncrypt, passwordEncrypt, databaseEncrypt);

    //Desencriptar schema
    const schema = decryptWord(schemaEncrypt);

    let listInvoices = {
        list: [],
        neto: '',
        impuesto: '',
        baseCero: '',
        total: '' 
    };

    try {
        const pool = db(user, password, database);
        const result = await pool.query(
            `SELECT factura, fecha, vence, vendedor, ruc, nombrec, 
            neto, descto, impuesto, base_0, total 
            FROM ${ schema }.scencfac ORDER BY factura ASC`, []);
            
        pool.end();
        
        listInvoices.list = result.rows;

        const poolSum = db(user, password, database);
        const resultSum = await poolSum.query(
            `SELECT SUM( neto ) as neto_sum, SUM( impuesto ) as impuesto_sum, 
            SUM( base_0 ) as base_0_sum, SUM( total ) as total_sum 
            FROM ${ schema }.scencfac`, []);
            
        poolSum.end();

        listInvoices.neto = resultSum.rows[0].neto_sum;
        listInvoices.impuesto = resultSum.rows[0].impuesto_sum;
        listInvoices.baseCero = resultSum.rows[0].base_0_sum;
        listInvoices.total = resultSum.rows[0].total_sum;

        res.json({
            ok: true,
            msg: listInvoices
            // msg: result.rows
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
    porcentajeIva,
    importaExistencias,
    listUltimaFactura,
    lastNumFactura,
    lastNumFacturaSucursal,
    saveFactura,
    updateFactura,
    deleteFactura,
    firmaFactura,
    listFacturaByNumber,
    listFacturasByParam,
    listFacturasParaAnular,
    anularFactura,
    deleteErrorFirma,
    anularUnaFactura,
    listAllFacturasToReport
}