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
    login,
    uploadProfileImage,
    registeradmin
} = require('../controllers/userController');
const multer = require('multer');
const  validtoken= require('../middleware/validToken');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {        
        cb(null, path.join(__dirname, '../uploads/userimages'));      
    },
    filename: (req, file, cb) => {                
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });




const router=express.Router()
router.get("/home",(req,res)=>{
    return res.json("ok...routes are working");
})
router.post("/registerUser",registerUser)
router.post("/registerAdmin",registeradmin)
router.get("/getall",validtoken,getAllUsers)
router.get("/getbyid/:id",validtoken,getUserById)
router.post("/verifyemail",verifyuseremail)
router.post("/sendotptoemail",sendotp)
router.put("/updateuserdetails/:id",validtoken,updateuser)
router.delete("/deleteuserbyid/:id",validtoken,deleteUserById)
router.put("/updateemail/:id",validtoken,updateuseremail)
router.put("/updateusername/:id",validtoken,updateuserusername)
router.put("/updatepassword/:id",validtoken,updatepassword)
router.post("/forgetpassword",forgetpassword)
router.post("/login",login)
router.put('/uploadprofileimage/:id', upload.single('profileImage'),validtoken,uploadProfileImage)

module.exports=router
