require('dotenv').config();
const express = require('express');
const z= require('zod');
const jwt = require('jsonwebtoken');
const {Pool}=require('pg');
const router = express.Router();
const bcrypt = require('bcrypt')
const cookieparser = require('cookie-parser');
const limitor = require('express-rate-limit');
const verifiedjwt = require('../middlewaretkn');
const winstonlogin= require('../winston');



const limit = limitor({
    windowMs:30*60*1000,
    max:30,
    message:{message:'TOO MANY LOGIN ATTEMPTS TRY AGAIN LATER'},
})


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



router.post('/loginapi',loginmiddleware,limit,async(req,res)=>{
 const  {email,password} = req.body;

 if(email===""|| password===""){
    
    winstonlogin.warn('verification failed :empty password and email');
    
    return res.status(422).json({message:'validation failed'});
 }
 try {
    const match = await pool.query('SELECT * FROM  registered_users WHERE email=$1',[email]);


    if(match.rowCount===0){
        winstonlogin.info('login attempt failed:no user found')
        return res.status(404).json({message:'user not found'});
    }

    const user = match.rows[0];
    const hashedpassword= user.hashedpassword;




    const passwordmatch =await bcrypt.compare(password,hashedpassword);


    if(!passwordmatch){
        winstonlogin.warn(`Invalid login attempt for user: ${email}`);
        return res.status(401).json({message:'invalid login credentials'})
    }

    const token = jwt.sign({id:user.id,email,role:user.role},process.env.JWT_SECRET,{expiresIn:'1h'});
    res.cookie('token',token,{
    httpOnly:true,
    secure:false,
    sameSite:'lax'
      });
     
      winstonlogin.info(`User logged in successfully: ${email} (${user.role})`);
    return res.status(200).json({message:`Welcome..your logged in succesfuly`,role:user.role});

 } catch (error) {
    console.log(error);
    winstonlogin.error(`Login error for user ${email}: ${error.message}`);
      return res.status(500).json({message:`something wrong happened  try logging in with correct details`})
 }
})



winstonlogin.info('User attempted login');
winstonlogin.warn('User entered wrong password');
winstonlogin.error('Unexpected DB error');
module.exports = router;
