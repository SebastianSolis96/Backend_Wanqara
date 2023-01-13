const { response } = require('express');

const pool = require('../database/db');

const listProducts = async ( req, res = response ) => {

    try {
        const result = await pool.query(
            `select p.id, p.name, price, size, promotion, c.name as category 
            from public.product as p 
            inner join category_product ON id = product_id 
            inner join category as c on category_id = c.id 
            order by p.id asc`);

        res.json({
            ok: true,
            msg: result.rows,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'An error has occurred',
            // error: error
        });
    }
}

const updateProduct = async ( req, res = response ) => {  
    const { price } = req.body;
    const { id } = req.params;

    try {

        const result = await pool.query(
            `UPDATE public.product SET price=$1 
            WHERE id=$2 RETURNING *`, [ price, id ]);
            
        res.json({
            ok: true,
            msg: result.rows[0]
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'An error has occurred',
            // error: error
        });
    }
    
}

module.exports = {
    listProducts,
    updateProduct,
}