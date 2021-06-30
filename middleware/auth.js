const jwt=require("jsonwebtoken");
const Ragister=require("../models/user");

 async function auth(req,res,next) {
    try {
        const token=req.cookies.jwt;
        const verifyuser=jwt.verify(token, process.env.SECRET_KEY);

        const userdata=await Ragister.findOne({id:verifyuser._id});

      //  console.log(await Ragister.findOne({_id:verifyuser._id}));
        req.userdata=userdata;
        req.token=token;
        console.log(req.token);
        console.log(req.userdata);
        next();

    } catch (error) {
        res.send(error);
    }
}

module.exports=auth;