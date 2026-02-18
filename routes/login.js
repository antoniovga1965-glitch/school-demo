require('dotenv').config();
const express = require('express');
const z= require('zod');
const jwt = require('jsonwebtoken');
const {Pool}=require('pg');
const router = express.Router();
const bcrypt = require('bcrypt')
const cookieparser = require('cookie-parser');



const pool = new Pool({
    user:process.env.POSTGRES_USER,
    host:process.env.POSTGRES_HOST,
    database:process.env.POSTGRES_DB,
    password:process.env.POSTGRES_PASSWORD,
    port:process.env.POSTGRES_PORT,
    ssl:{ rejectUnauthorized: false }
});

const loginschemas = z.object({
    email:z.string().email(),
    password:z.string().min(1,'password required'),
})

const loginmiddleware = (req,res,next)=>{
    try {
        const results = loginschemas.safeParse(req.body);
        if(!results.success){
        return res.status(401).json({message:'validation failed'})
    }
    next();
    } catch (error) {
         if(error instanceof z.ZodError){
        return res.status(422).json({message:error.errors[0].message});
        }
         return res.status(422).json({message:'failed to validate login credentials'})
    }

}

router.post('/loginapi',loginmiddleware,async(req,res)=>{
 const  {email,password} = req.body;

 if(email===""|| password===""){
    return res.status(422).json({message:'validation failed'});
 }
 try {
    const match = await pool.query('SELECT * FROM  registered_users WHERE email=$1',[email]);


    if(match.rowCount===0){
        return res.status(404).json({message:'user not found'});
    }

    const user = match.rows[0];
    const hashedpassword= user.hashedpassword;




    const passwordmatch =await bcrypt.compare(password,hashedpassword);


    if(!passwordmatch){
        return res.status(401).json({message:'invalid login credentials'})
    }

    const token = jwt.sign({email,role:user.role},process.env.JWT_SECRET,{expiresIn:'1h'});
    res.cookie('token',token,{
    httpOnly:true,
    secure:false,
    sameSite:'lax'
      });
     

    return res.status(200).json({message:`Welcome..your logged in succesfuly`,role:user.role});

 } catch (error) {
    console.log(error);
    
      return res.status(500).json({message:`something wrong happened  try logging in with correct details`})
 }
})
module.exports = router