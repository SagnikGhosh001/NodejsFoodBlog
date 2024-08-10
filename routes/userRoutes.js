const express = require('express');
const {
    registerUser,
    getUserById,
    getAllUsers,
    verifyuseremail,
    sendotp,updateuser,
    deleteUserById,
    updateuseremail, 
    updateuserusername,
    updatepassword,
    forgetpassword,
    login
} = require('../controllers/userController');


const router=express.Router()
router.get("/home",(req,res)=>{
    return res.json("ok...routes are working");
})
router.post("/registerUser",registerUser)
router.get("/getall",getAllUsers)
router.get("/getbyid/:id",getUserById)
router.post("/verifyemail",verifyuseremail)
router.post("/sendotptoemail",sendotp)
router.put("/updateuserdetails/:id",updateuser)
router.delete("/deleteuserbyid/:id",deleteUserById)
router.put("/updateemail/:id",updateuseremail)
router.put("/updateusername/:id",updateuserusername)
router.put("/updatepassword/:id",updatepassword)
router.post("/forgetpassword",forgetpassword)
router.post("/login",login)


module.exports=router
