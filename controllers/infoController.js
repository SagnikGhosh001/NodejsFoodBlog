const asynchandler = require('express-async-handler');
const infoSchema = require('../models/infoModel')
const userSchema = require('../models/userModel')
const getallinfo = asynchandler(async (req, res) => {
    try {
        const info = await infoSchema.find()
        res.status(200).json(info)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

const getinfobyid = asynchandler(async (req, res) => {
    try {
        const info = await infoSchema.findById(req.params.id)
        res.status(200).json(info)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

const getinfobyparentid = asynchandler(async (req, res) => {
    try {
        const info = await infoSchema.find({ parentinfo: req.params.id })
        res.status(200).json(info)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

const addinfo = asynchandler(async (req, res) => {
    const { title, description, parentinfo, userid } = req.body
    if (!title || !description || !userid) {
        res.status(400)
        throw new Error("please provide all field")
    }
    const titleinfo = await infoSchema.findOne({ title })
    if (titleinfo) {
        res.status(400)
        throw new Error("Already title taken use different title")
    }
    const user = await userSchema.findById(userid)
    if (!user) {
        res.status(400)
        throw new Error(`no user find with id: ${userid}`)
    }

    if (user.role !== "admin") {


        res.status(400)
        throw new Error("your role is not admin")
    }
    if (parentinfo) {

        const parentinfoinfo = await infoSchema.findById(parentinfo)
        if (!parentinfoinfo) {
            res.status(400)
            throw new Error(`no parent info find with id: ${parentinfo}`)
        }


        const createinfo = await infoSchema.create({
            title,
            description,
            parentinfo
        })
        res.status(201).json(createinfo)
    } else {
        const createinfo = await infoSchema.create({
            title,
            description
        })
        res.status(201).json(createinfo)
    }

})

const updateinfo = asynchandler(async (req, res) => {
    const { title, description, userid } = req.body
    const titleinfo = await infoSchema.findOne({ title })
    if (!userid) {
        res.status(500)
        throw new Error("provide userid")
    }
    if (titleinfo) {
        res.status(500)
        throw new Error("Already title taken use different title")
    }
    const user = await userSchema.findById(userid)
    if (!user) {
        res.status(404)
        throw new Error(`no user found with id: ${userid}`)
    }
    if (user.role !== "admin") {
        res.status(500)
        throw new Error(`your role should be admin`)
    }
    const info = await infoSchema.findById(req.params.id)
    if (!info) {
        res.status(404)
        throw new Error(`no info found with id ${req.params.id}`)
    }
    if (title) {
        info.title = title

    }
    if (description) {
        info.description = description
    }


    await info.save()
    res.status(200).json(info)
})


const deletebyid=asynchandler(async(req,res)=>{
    const {userid}=req.body
    if (!userid) {
        res.status(500)
        throw new Error("provide userid")
    }
    const user = await userSchema.findById(userid)
    if (!user) {
        res.status(404)
        throw new Error(`no user found with id: ${userid}`)
    }
    console.log("enter");
    if (user.role !== "admin") {
        res.status(500)
        throw new Error("your role should be admin")
    }
    
    
    const info=await infoSchema.findById(req.params.id)
    if(!info){
        res.status(500)
        throw new Error(`info not found with id ${req.params.id}`)
    }
    await infoSchema.findByIdAndDelete(req.params.id)
    res.status(200).json(info)
})
const deleteall=asynchandler(async(req,res)=>{
    const {userid}=req.body
    if (!userid) {
        res.status(500)
        throw new Error("provide userid")
    }
    const user = await userSchema.findById(userid)
    if (!user) {
        res.status(404)
        throw new Error(`no user found with id: ${userid}`)
    }
    console.log("enter");
    if (user.role !== "admin") {
        res.status(500)
        throw new Error("your role should be admin")
    }
    
    const result=await infoSchema.deleteMany({})
    res.status(200).json({
        message: "All documents deleted successfully."
    });
})
const uploadInfoImage =asynchandler( async (req, res) => {
    
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {           
        const infoId = req.params.id       
        const info = await infoSchema.findById(infoId);
        if (!info) {
            res.status(404)
            throw new Error(`info not found with id${infoId}`)
        }     
        info.image = `/uploads/infoimages/${req.file.filename}`;
        await info.save();
        res.status(200).json({
            message: 'info image uploaded successfully',
            image: info.image
        });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
});
module.exports = { getallinfo, getinfobyid, getinfobyparentid, addinfo,updateinfo,deletebyid ,deleteall,uploadInfoImage}