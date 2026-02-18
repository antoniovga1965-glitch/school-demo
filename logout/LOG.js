const express = require('express');
const router  =express.Router();

router.post('/logout',(req,res)=>{
    res.clearCookie('token',{
        httpOnly:true,
        secure:false,
        sameSite:'strict'
    })
    return res.status(200).json({message:'logged out succesfully'})
})
module.exports=router;