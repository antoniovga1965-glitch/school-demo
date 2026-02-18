const express = require('express');
const router =express.Router();
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

router.get('/totalapplicants',async(req,res)=>{
try {
     const applicants = await pool.query('SELECT * FROM applicants');
    return res.status(200).json({message:applicants.rowCount})
} catch (error) {
    console.log(error);
    return res.status(500).json({message:'something went wrong try again'});
}
   
})
module.exports = router;