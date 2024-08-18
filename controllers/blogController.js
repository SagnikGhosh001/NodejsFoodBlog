const asyncHandler = require("express-async-handler");
const blogSchema = require("../models/blogModel.js")
const userSchema = require('../models/userModel')
const mongoose=require("mongoose")
const getAllBlogs = asyncHandler(async (req, res) => {
    try {
        const blogs = await blogSchema.find()
        res.status(200).json(blogs)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
const getBlogsById = asyncHandler(async (req, res) => {
    try {
        const blogs = await blogSchema.findById(req.params.id)
        if (!blogs) {
            res.status(404)
            throw new Error(`blog not found with id: ${req.params.id}`)
        }
        res.status(200).json(blogs)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
const getBlogsByUserId = asyncHandler(async (req, res) => {
    try {
        const user = await userSchema.findById(req.params.id)
        if (!user) {
            res.status(404)
            throw new Error(`user not found with id: ${req.params.id}`)
        }
        const blogs = await blogSchema.find({ userId: req.params.id })
        if (!blogs) {
            res.status(400)
            throw new Error(`blog not found with id: ${req.params.id}`)
        }
        res.status(200).json(blogs)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

const addBlogs = asyncHandler(async (req, res) => {
    const { description, title, userId } = req.body
    if (!title || !description || !userId) {
        res.status(500)
        throw new Error('please add all field')
    }
    const user = await userSchema.findById(userId)
    if (!user) {
        res.status(404)
        throw new Error(`user not found with id: ${userId}`)
    }
    const createBlog = await blogSchema.create({
        description,
        title,
        userId
    })
    res.status(201).json(createBlog);
})

const updateblog = asyncHandler(async (req, res) => {
    const { userId, title, description } = req.body
    if (!userId) {
        res.status(500)
        throw new Error("provide userid")
    }

    const blog = await blogSchema.findById(req.params.id)

    if (!blog) {
        res.status(404)
        throw new Error(`no blog find with id ${req.params.id}`)
    }
    if (userId == blog.userId) {
        blog.title = title
        blog.description = description
        await blog.save()
        res.status(200).json(blog)
    }else{
        res.status(400)
        throw new Error("you are not owner of this blog")
    }

})

const deleteById= asyncHandler(async(req,res)=>{
    const{userId}=req.body
    if(!userId){
        res.status(400)
        throw new Error("provide user id")
    }
    if (!mongoose.isValidObjectId(userId)) {
        res.status(400);
        throw new Error("Invalid user ID format,use valid id format");
    }
    const user=await userSchema.findById(userId)
   
    
    
    if(!user){
        res.status(404)
        throw new Error(`no user found with id: ${userId}`)
    }
    const blog=await blogSchema.findById(req.params.id)
    if(!blog){
        res.status(404)
        throw new Error(`no blog found with id: ${req.params.id}`)
    }
    if(user.role==="admin" || userId==blog.userId){
        await blogSchema.findByIdAndDelete(req.params.id)
        res.status(200).json(blog)
    }else{
        res.status(400)
        throw new Error("you are not allowed")
    }
})

module.exports = { getAllBlogs, getBlogsById, getBlogsByUserId, addBlogs, updateblog,deleteById }