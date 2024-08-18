const { mongoose, model } = require("mongoose");

const blogSchema=mongoose.Schema({
    description:{
        type: String,
        required: [true,'add description']
    },
    title:{
        type: String,
        required: [true,'add title']
    },
    image:{
        type:String
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required: [true,'add user']
    }
},{
    timestamps: true
})
module.exports=mongoose.model('blog',blogSchema)