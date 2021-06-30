const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const validator=require("validator");
const bcrypt=require("bcryptjs");
mongoose.connect(process.env.conn, {useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false})
.then(()=> console.log("connection sucessfull"))
.catch((error)=>console.log(error));

const conn=mongoose.connection;

// user Schema
const userSchema=mongoose.Schema({
    name:
    {
        type:String,
        required:true,
        minLength:3
    },

    email:
    {
        type:String,
        required:true,
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error("Invalid Email Id");
            }
        }
    },

    phone:
    {
        type:Number,
        required:true,
        min:10
    },


    gender:
    {
        type:String,
        required:true
    },

    password:
    {
        type:String,
        required:true,
        minLength:[8,"length should be 8"]
    },


    confirmpassword:
    {
        type:String,
        required:true,
        minLength:[8,"length should be 8"]
    },

    tokens:
    [{
        token:
        {
            type:String,
            required:true
        }
    }]
})

userSchema.methods.generteToken=async function() 
{
    try {
        const token=jwt.sign({id:this._id.toString()}, process.env.SECRET_KEY);

        this.tokens=this.tokens.concat({token:token});

        await this.save();
        return token;
    } catch (error) {
        res.send("the eror", error);
    }
}

userSchema.pre("save", async function(next) {
    
    if(this.isModified("password"))
    {
        console.log(this.password);
        this.password=await bcrypt.hash(this.password, 10);
        this.confirmpassword=await bcrypt.hash(this.password, 10);
        console.log(this.password);
    }

    next();
})

//user Collection
const ragister=mongoose.model("ragister", userSchema);

module.exports = ragister;
