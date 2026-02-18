const jwt = require('jsonwebtoken');

const verifyjwt = (req,res,next)=>{
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(422).json({message:'no token found'});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();
        
    } catch (error) {
          return res.status(401).json({message:'invalid token'});
    }
}
module.exports=verifyjwt;