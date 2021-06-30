const mongoose=require("mongoose");
const validator=require("validator");
mongoose.connect(process.env.conn, {useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false})
.then(()=> console.log("connection sucessfull"))
.catch((error)=>console.log(error));

const conn=mongoose.connection;
//const mongoose=require("mongoose");

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

    message:
    {
        type:String,
        required:true,
        minLength:3
    }

   
})

//user Collection
const User=mongoose.model("User", userSchema);

module.exports = User;
