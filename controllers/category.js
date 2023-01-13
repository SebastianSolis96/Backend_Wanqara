const { response } = require('express');

const pool = require('../database/db');

const listCategoriesWithPromotion = async ( req, res = response ) => {

    try {
        const result = await pool.query(
            `select name, promotion 
            from public.category 
            inner join category_product ON id = category_id 
            where promotion = true 
            group by name, promotion`);

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

module.exports = listCategoriesWithPromotion;