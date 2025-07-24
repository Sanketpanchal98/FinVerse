import mongoose, { Schema } from "mongoose";


const goalsSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    targetAmount : {
        type: Number,
        required : true
    },
    category: {
        type : String,
        enum : ['savings', 'emergency', 'food', 'entertainment', 'investment']
    },
    deadline: {
        type : Date,
        required : true
    },
    priority: {
        type : String,
        enum : ['low', 'medium', 'high']
    },
    status : {
        type : String,
        enum : ['active', 'paused', 'expired', 'achieved']
    },
    currentAmount : {
        type : Number
    },
    owner : {
        type : mongoose.Schema.ObjectId,
        ref : 'User'
    }
}, {
    timestamps : true
});


export const Goal = mongoose.model('Goal', goalsSchema);