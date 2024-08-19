const feedbackSchema=require('../models/feedbackModel')
const userSchema=require('../models/userModel')
const asynchandler=require('express-async-handler')

const getallfeedback=asynchandler(async(req,res)=>{
    try {
        const feedback=await feedbackSchema.find()
        res.status(200).json(feedback)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})
const getfeedbackbyid=asynchandler(async(req,res)=>{
    try {
        const feedback=await feedbackSchema.findById(req.params.id)
        res.status(200).json(feedback)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})
const getfeedbackbyuseremail=asynchandler(async(req,res)=>{
    try {
        const feedback=await feedbackSchema.find({email:req.params.email})
        if(!feedback){
            res.status(404)
            throw new Error(`no feedback found with email ${req.params.email}`)
        }
        res.status(200).json(feedback)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

const addfeedback=asynchandler(async(req,res)=>{
    const{email,message,star}=req.body
    if(!email||!message||!star){
        res.status(400)
        throw new Error("provide all field")
    }
  
    
    const userdetails = await userSchema.findOne({ email: email });

    if (!userdetails) {
        res.status(404);
        throw new Error(`User not found with email ${email}`);
    }
  
    
    const createfeedback = await feedbackSchema.create({
        email,
        message,
        star
    });
    res.status(201).json(createfeedback)
})
const updatefeedback=asynchandler(async(req,res)=>{
    const{email,message,star}=req.body
    if(!email){
        res.status(400)
        throw new Error("provide email")
    }
    const userdetails=await userSchema.findOne({email:email})  
    if(!userdetails){
        res.status(404)
        throw new Error(`user not found with email ${email}`)
    }
    const feedback=await feedbackSchema.findById(req.params.id)
    if(feedback.email!==email){
        res.status(404)
        throw new Error("you are not allwed")
    }
    if(message){
        feedback.message=message
    }
    if(star){
        feedback.star=star
    }
    await feedback.save()
    res.status(200).json(feedback)
})
const deletefeedbackbyid=asynchandler(async(req,res)=>{
    const{email}=req.body
    if(!email){
        res.status(400)
        throw new Error("provide email")
    }
    const userdetails=await userSchema.findOne({email:email})  
    if(!userdetails){
        res.status(404)
        throw new Error(`user not found with email ${email}`)
    }
    const feedback=await feedbackSchema.findById(req.params.id)
    if(userdetails.role==="admin"||feedback.email==email){
        await feedbackSchema.findByIdAndDelete(req.params.id)
        res.status(200).json(feedback)
    }else{
        res.status(500)
        throw new Error("illigal action")
    }
    
})
const deleteall=asynchandler(async(req,res)=>{
    const{email}=req.body
    if(!email){
        res.status(400)
        throw new Error("provide email")
    }
    const userdetails=await userSchema.findOne({email:email})  
    if(!userdetails){
        res.status(404)
        throw new Error(`user not found with email ${email}`)
    }
    if(userdetails.role==="admin"){
        await feedbackSchema.deleteMany({})
        res.status(200).json({message:"all feedback deleted"})
    }else{
        res.status(500)
        throw new Error("illigal action")
    }
    
})



module.exports={getallfeedback,getfeedbackbyid,getfeedbackbyuseremail,addfeedback,updatefeedback,deletefeedbackbyid,deleteall}