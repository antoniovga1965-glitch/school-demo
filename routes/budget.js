require('dotenv').config();
const express = require('express');
const router = express.Router();
const {Pool} = require('pg');



const pool = new Pool({
    user:process.env.POSTGRES_USER,
    host:process.env.POSTGRES_HOST,
    database:process.env.POSTGRES_DB,
    password:process.env.POSTGRES_PASSWORD,
    port:process.env.POSTGRES_PORT,
    ssl:{ rejectUnauthorized: false }
});


router.post('/totalbudget',async(req,res)=>{
    const {money} = req.body;
    try {
        const budget = await pool.query('INSERT INTO money (money) VALUES($1) RETURNING money',[money]);
        return res.status(200).json({message:budget.rows[0].money})
         
    } catch (error) {
        return res.status(401).json({message:'something went wrong try again'});
    }
})



// router.get('/documentlist',async(req,res)=>{
//     try {
//         const files = await pool.query('SELECT * FROM files');
//         return res.status(200).json({message:files.rows});
        
//     } catch (error) {
//          return res.status(200).json({message:'failed to read the files'});
//     }
// })
module.exports =router;