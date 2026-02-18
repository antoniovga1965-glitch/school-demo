const express = require('express');
const router = express.Router();
const {Pool} = require('pg');
require('dotenv').config();


const pool = new Pool({
    user:process.env.POSTGRES_USER,
    host:process.env.POSTGRES_HOST,
    database:process.env.POSTGRES_DB,
    password:process.env.POSTGRES_PASSWORD,
    port:process.env.POSTGRES_PORT,
    ssl:{ rejectUnauthorized: false }
});


router.get('/table',async(req,res)=>{
    try {
        const users = await pool.query('SELECT * FROM registered_users');
        return res.status(200).json({message:users.rows});
    } catch (error) {
          return res.status(500).json({message:'Something went wrong try again later'});
    }
    
})
module.exports = router