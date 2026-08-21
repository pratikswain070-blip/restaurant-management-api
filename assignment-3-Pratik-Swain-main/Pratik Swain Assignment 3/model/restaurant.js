const mongoose=require('mongoose');

const restaurantSchema= new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        address:{
             type:String,
            required:true

        },
        cuisine:{
             type:String,
            required:true
        },
        rating:{
            type:Number,
            required:true
        }
    },
);

const menuSchema= new mongoose.Schema(
    {
        // Foreign Key / Reference to Restaurant
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true
        },
        
        name:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        isAvailable:{
            type:Boolean,
            required:true
        }
    },
);

const userSchema= new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
        },
        password:{
            type:String,
            required:true
        }

    },
);

const Restaurant=mongoose.model("Restaurant",restaurantSchema);
const Menu=mongoose.model("Menu",menuSchema);
const User=mongoose.model("User",userSchema);

module.exports={
    Restaurant,
    Menu,
    User
};