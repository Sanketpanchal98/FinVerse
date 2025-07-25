import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const UserSchema = new Schema({

    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : function(){
            return !this.googleId
        }
    },
    googleId : {
        type : String,
        sparse : true
    },
    isEmailVerified : {
        type : Boolean,
        default : false
    },
    authProvider : {
        type : String,
        enum : ['local', 'google', 'both'],
        default : 'local'
    },
    refreshToken : {
        type : String
    },
    avatar : {
        type : String
    },
    gender : {
        type : String,
        enum : ['Male', 'Female', 'Others']
    },
    dob: {
        type : Date,
    },
    phoneNo : {
        type : Number
    },
    address : {
        type : String
    }

},{
    timestamps : true
});

UserSchema.pre('save' ,async function (next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8);
        next()
    }

    return next();
    
});

UserSchema.methods.passwordVerification = async function(password){

    return await bcrypt.compare(password, this.password);
    
}

UserSchema.methods.refreshTokenGen = async function () {
    return await jwt.sign({
        id : this._id,
        name : this.name
    }, 
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

UserSchema.methods.accessTokenGen = async function () {
    const token = await jwt.sign({
        id : this._id,
        name : this.name
    }, 
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
    return token
}

export const User = mongoose.model('User' , UserSchema);