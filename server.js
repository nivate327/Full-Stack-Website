require('dotenv').config()
const express=require("express")
const PORT=process.env.PORT || 3040
const app=express()
const ejs=require("ejs")
const path=require("path")
const User=require("./models/portfolio")
const ragister=require("./models/user")
const expressLayout=require("express-ejs-layouts")
const staticpath=path.join(__dirname,"./public"); 
app.use(express.static(staticpath));
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const auth=require("./middleware/auth");
const cookieParser = require('cookie-parser')

app.use(express.json());
app.use(cookieParser());

app.get("/", (req,res,next)=>
{
    res.render("home");
})

app.get("/logout", auth, async(req, res)=>
{
    try {

        //logout in all devices

        req.userdata.tokens=[];

      /*  req.userdata.tokens=req.userdata.tokens.filter((val)=>
        {
            return val.token!==req.token;
        });
*/
        console.log(req.userdata);
       res.clearCookie("jwt");
       console.log("logout");
      //  console.log(req.user);
        await req.userdata.save();
        res.render("login")

    } catch (error) {
        res.status(404).send(error);
    }
});


app.get("/project", auth , (req,res,next)=>
{
    res.render("project");
    console.log(` Awesome MERN ${req.cookies.jwt}`);
})



app.get("/ragister", (req,res,next)=>
{
    res.render("ragister");
})

app.use(express.urlencoded({extended:false}));

app.post("/contact", async(req, res)=>
{
    try
    {
       
        const userdata=new User(req.body);
        await userdata.save();
        res.status(201).render("home");
    }catch(error)
    {
        res.status(500).send(error);
    }

})


app.post("/ragister", async(req,res)=>
{
    try {
        let password=req.body.password;
        let confirmpassword=req.body.confirmpassword;

        if(password===confirmpassword)
        {
            let ragisterdata=new ragister(
                {
                    name:req.body.name,
                    phone:req.body.phone,
                    email:req.body.email,
                    password:password,
                    gender:req.body.gender,
                    confirmpassword:req.body.confirmpassword,
                });

                
            
                const token=await ragisterdata.generteToken();
                res.cookie("jwt", token, {expire:new Date(Date.now() + 60000), httpOnly:true});

                let data=await ragisterdata.save();

               // console.log(ragisterdata);
           //     console.log(name);
              res.status(201).redirect("/");



        }else{
            res.send("Invalid Details");
        }
    } catch (error) {
        res.status(400).send(error);
    }
})

app.get("/login", (req,res)=>
{
    res.render("login");
})

app.post("/login", async(req,res)=>
{
    try {
        let email=req.body.email;
        let password=req.body.password;
      //  console.log(password);

        let data=await ragister.findOne({email:email});
       // console.log(data);

        let isMatch=await bcrypt.compare(password, data.password);
        const token=await data.generteToken();
       // console.log(token);

        
        
        res.cookie("jwt", token, {expire:new Date(Date.now() + 60000), httpOnly:true});

        if(isMatch)
        {
            res.redirect("/");
        }
        else
        {
            res.send("Invalid Login Details")
        }

    } catch (error) {
        res.send("Invalid Login Details")
    }
})

//console.log(process.env.SECRET_KEY);

// set template engines
app.use(expressLayout)
app.set("views", path.join(__dirname, "./resources/views"))
app.set("view engine", "ejs")


// server running
app.listen(PORT, ()=>
{
    console.log(`server is running on ${PORT}`);
})

