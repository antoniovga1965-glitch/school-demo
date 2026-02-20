const express = require('express');
const multer = require('multer');
const fs = require('fs');
const router  =express.Router();
const {Pool}=require('pg');
require('dotenv').config();
const z = require('zod');
const verifiedjwt = require('../middlewaretkn');
const pdfparse =require('pdf-parse');
const pdf = require('pdf-parse');





if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
    }
});

const uploads = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') cb(null, true);
        else cb(new Error('only accepts images and pdfs'));
    }
});


const pool = new Pool({
    user:process.env.POSTGRES_USER,
    host:process.env.POSTGRES_HOST,
    database:process.env.POSTGRES_DB,
    password:process.env.POSTGRES_PASSWORD,
    port:process.env.POSTGRES_PORT,
    ssl:{ rejectUnauthorized: false }
});

const applicantSchemas=z.object({
    FULLNAMES:z.string().min(1,'Enter your full names'),
    PHONENO:z.string().regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
    BIRTHDATE:z.string().refine((date) => !isNaN(new Date(date).getTime()), 'Invalid date')
    .refine((date) => {
        const year = new Date(date).getFullYear();
        return year < 2008;
    }, 'You must be born before 2008 to apply'),
    STUDENTSID: z.string()
    .regex(/^[a-zA-Z0-9]+$/, 'Student ID must be letters and numbers only')
    .min(4, 'Student ID too short')
    .max(15, 'Student ID too long'),
COURSE:z.string().min(1,'Course required'),
REASON:z.string().min(20, 'Reason must be at least 20 characters')
    .max(120, 'Reason must be under 120 characters')
    .regex(/^[a-zA-Z\s.,!?'-]+$/, 'Reason must contain letters only'),
});

// const applicantmiddleware = (req,res,next)=>{
//     const results = applicantSchemas.safeParse(req.body);
//     if(!results.success){
//         return  res.status(422).json({message:'failed to verify your applicants input try with the correct fields and submit'});
//     }
//     next();
// }
const applicantmiddleware = (req, res, next) => {
    console.log('req.body:', req.body);
    const results = applicantSchemas.safeParse(req.body);
    if (!results.success) {
        const message = results.error?.issues[0]?.message;
        const field = results.error?.issues[0]?.path[0];
        console.log('zod error:', message, 'field:', field);
        return res.status(422).json({ message: `${field}: ${message}` });
    }
    next();
};
router.post('/applicantscredentials',verifiedjwt,applicantmiddleware,async(req,res)=>{
    const  { FULLNAMES, APPLICANTID, BIRTHDATE, SELECTGENDER, PHONENO, LOCATION,
    INSTITUTION, STUDENTSID, COURSE, YEAROFSTUDY, MONTHLYINCOME, DEPENDANTS, EMPLOYED, REASON } = req.body;


    try {
         const existing = await pool.query(
            'SELECT id FROM applicants WHERE applicantid = $1', [APPLICANTID]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({ message: 'You have already submitted an application.' });
        }

        const saveapplicant = await pool.query(`INSERT INTO applicants (FULLNAMES, APPLICANTID, BIRTHDATE, SELECTGENDER, PHONENO, LOCATION,
             INSTITUTION, STUDENTSID, COURSE, YEAROFSTUDY, MONTHLYINCOME, DEPENDANTS, EMPLOYED, REASON,user_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,$14,$15)`,[FULLNAMES, APPLICANTID, BIRTHDATE, SELECTGENDER, PHONENO, LOCATION,
               INSTITUTION, STUDENTSID, COURSE, YEAROFSTUDY, MONTHLYINCOME, DEPENDANTS, EMPLOYED, REASON,req.user.id]);


               return res.status(200).json({message:`Dear ${FULLNAMES} your application has been submitted wait for processing`});
        
    } catch (error) {
        console.log(error);
        
          return res.status(500).json({message:`Something went wrong try again`});
    }


})


router.post('/uploadfiles',verifiedjwt,uploads.fields([
    { name: 'IDCOPY' },
    { name: 'SUPPORTINGDOC' },
    { name: 'RESULTSCORE' },
]), async (req, res) => {
    try {

    const IDCOPY = req.files.IDCOPY ?req.files.IDCOPY[0].path:null;
    const SUPPORTINGDOC = req.files.SUPPORTINGDOC ? req.files.SUPPORTINGDOC[0].path:null;
    const RESULTSCORE = req.files.RESULTSCORE ?req.files.RESULTSCORE[0].path:null;




     const results= await pool.query(`
            INSERT INTO files (idcopy , supportingdoc , resultscore )
            VALUES ($1, $2, $3)`,
            [
            IDCOPY,
               SUPPORTINGDOC, 
            RESULTSCORE,
            ]
        );
        if(SUPPORTINGDOC){
          const response = await fs.readFileSync(SUPPORTINGDOC);
            const parseddata = await pdf(response);
     
             await fs.writeFileSync('data.txt',parseddata.text);
        }else if(RESULTSCORE){
            const response = await fs.readFileSync(RESULTSCORE);
            const parseddata = await pdf(response);
     
             await fs.writeFileSync('data.txt',parseddata.text);
        }else{
            return res.json({message:'failed to write data'})
        }

        

        return res.status(200).json({ message: 'Files uploaded successfully and application is succesful wait for processing' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'File upload failed' });
    }

})

    router.get('/documents',verifiedjwt,async(req,res)=>{
        try {
      const results = await pool.query('SELECT * FROM files');
      return res.status(200).json({message:results.rows})
        } catch (error) {
             return res.status(404).json({message:'something went wrong page not found'})
        }
    
});

router.get('/searched',verifiedjwt,async(req,res)=>{
    try {
  const {searchedvalue} = req.query
  console.log(searchedvalue);
  
   const searched = await pool.query('SELECT * FROM applicants WHERE fullnames ILIKE $1',[`%${searchedvalue}%`]);
   return res.status(200).json({message:searched.rows});
    } catch (error) {
        console.error(error)
    }
 
});
router.get('/viewstatus',verifiedjwt,async(req,res)=>{
    console.log(req.user.email);
    
    try {
        const getstatus = await pool.query(`SELECT  fullnames, status  FROM applicants  WHERE  user_id=$1`,[req.user.id]);
        
        return res.json({message:getstatus.rows[0]});
    } catch (error) {
        console.error(error);
        
    }
})




module.exports = router;
