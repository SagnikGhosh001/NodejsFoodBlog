const { default: mongoose } = require("mongoose");

const feedbackSchema=mongoose.Schema({
    email:{
        type:String,
        required: [true,'add user email']
    },
    message:{
        type:String,
        required:[true,'add feedback message']
    },
    star:{
        type:Number,
        required:[true,'add star'],
        min: [1, 'Star rating must be at least 1'],
        max: [5, 'Star rating cannot exceed 5']
    }
},{
    timestamps:true
})

module.exports=mongoose.model('feedback',feedbackSchema)