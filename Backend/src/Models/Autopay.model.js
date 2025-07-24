import mongoose, { Schema } from "mongoose";

const autoPaySchema = new Schema({
    name : {
        type : String,
        required :true
    },
    amount : {
        type : Number,
        required : true
    },
    duration : {
        type : String,
        enum : ['Weekly', 'Monthly', 'Yearly', 'Daily']
    },
    category : {
        type : String,
        enum : ['Entertainment', 'Health', 'Food', 'Utilities', 'Transportation', 'Shopping', 'Other']
    },
    nextDate : {
        type : Date,
        default : Date.now()
    },
    status : {
        type : String
    },
    owner : {
        type : mongoose.Schema.ObjectId,
        ref : 'User'
    }
}, {timeseries : true});

export const Autopay = mongoose.model('Autopay', autoPaySchema);