const mongoose = require('mongoose');

const infoSchema=mongoose.Schema({
    title:{
        type:String,
        required:[true,"provide an title"],
        unique: [true, "title already taken"]
    },
    description:{
        type:String,
        required:[true,"provide an desscription"]
    },
    parentinfo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'info',
    },
    image:{
        type:String
    }
},{
    timestamps:true
})

module.exports=mongoose.model('info',infoSchema)