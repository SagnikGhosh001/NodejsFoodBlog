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
    uploadProfileImage
} = require('../controllers/userController');
const multer = require('multer');
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
router.put('/uploadprofileimage/:id', upload.single('profileImage'),uploadProfileImage)

module.exports=router
