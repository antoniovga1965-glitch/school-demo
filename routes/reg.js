require('dotenv').config();
const express = require('express');
const z= require('zod');
const jwt = require('jsonwebtoken');
const {Pool}=require('pg');
const router = express.Router();
const bcrypt = require('bcrypt')


const pool = new Pool({
    user:process.env.POSTGRES_USER,
    host:process.env.POSTGRES_HOST,
    database:process.env.POSTGRES_DB,
    password:process.env.POSTGRES_PASSWORD,
    port:process.env.POSTGRES_PORT,
    ssl:{ rejectUnauthorized: false }
});




const registerschemas=z.object({
FULLNAMES:z.string().min(2,'Register your full names'),
INSTITUTION:z.string().min(3,'Enter your user insitition name'),
EMAIL:z.string().email(),
COURSE:z.string().min(4,'Enter your course'),
STUDENTID:z.string().min(1,'student id required'),
PASSWORD:z.string().min(8,'password of atleast 8 characters expected'),

});

const regmiddelware = (req,res,next)=>{
    try {
        const results = registerschemas.safeParse(req.body);
        if(!results.success){
         return res.status(401).json({message:'validation failed'});
         }
         next();
        
    } catch (error) {
        console.error(error)
        if(error instanceof z.ZodError){
            return res.status(422).json({message:error.errors[0].message});
        }
        return res.status(422).json({message:'failed to validate registered credentials'})
    }
    
}

router.post('/register',regmiddelware,async(req,res)=>{
const {FULLNAMES,INSTITUTION,EMAIL,COURSE,STUDENTID,PASSWORD}=req.body;
try {
    const saltrounds=12;
    const hashedpassword=await bcrypt.hash(PASSWORD,saltrounds);


        const existing = await pool.query('SELECT * FROM registered_users WHERE EMAIL=$1',[EMAIL]);
        if(existing.rows>0){
            return res.status(400).json({message:'user already exist'});
        }


    const registereduser = await pool.query(
        `INSERT INTO registered_users(FULLNAMES,INSTITUTION,EMAIL,COURSE,STUDENTID,hashedpassword)VALUES($1,$2 ,$3, $4, $5 ,$6)`,
        [FULLNAMES,INSTITUTION,EMAIL,COURSE,STUDENTID,hashedpassword]);

          const token = jwt.sign(
            { email: EMAIL, fullnames: FULLNAMES },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
            
        );
    
            res.cookie('token', token, {
            httpOnly: true,
            secure:false,
            sameSite: 'strict'
        });

        return res.status(201).json({message:`Dear ${FULLNAMES} from ${INSTITUTION} you have been succesfully registered`,email:EMAIL});

} catch (error) {
    console.log(error)
      return res.status(422).json({message:'Registration unsuccesfully try again'});
}
})

module.exports = router;