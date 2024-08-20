const mongoose = require('mongoose');
const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const userSchema = require("../models/userModel.js");
const generateOtp = require('../otpHelper/generateOtp.js');
const path = require('path');
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await userSchema.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


const getUserById = asyncHandler(async (req, res) => {
    try {
        const user = await userSchema.findById(req.params.id);
        if (!user) {
            res.status(404);
            throw new Error(`User not found with id ${req.params.id}`);
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

const registerUser = asyncHandler(async (req, res) => {


    const { username, email, password, name, gender, role } = req.body
    if (!username || !email || !password || !name || !gender) {
        res.status(400)
        throw new Error("please enter all fiend")
    }

    const userByEmail = await userSchema.findOne({ email })

    const userByUsername = await userSchema.findOne({ username })

    if (userByEmail) {
        res.status(400)
        throw new Error(`user already available with ${email}`)
    }
    if (userByUsername) {
        res.status(400)
        throw new Error(`user already available with ${username}`)
    }



    const otpExpiryTime = await new Date(Date.now() + 15 * 60 * 1000);


    const hashedpassword = await bcrypt.hash(password, 10);
    

    const generatedotp = generateOtp()
    



    const createUser = await userSchema.create({
        username,
        email,
        password: hashedpassword,
        name,
        gender,
        otp: generatedotp,
        otpExpiry: otpExpiryTime,
        isEmailVerfied: false,
        isEmailOtpUsed: false
        
    })
    if (createUser) {
        res.status(201).json({
            __id: createUser.id,
            email: createUser.email,
            name: createUser.name,
            gender: createUser.gender,
        })
    }
    else {
        res.status(400)
        throw new Error("invalid data")
    }
    res.json({ message: "user register" })
})


const verifyuseremail = asyncHandler(async (req, res) => {
    try {

        const { email, otp } = req.body


        if (!email || !otp) {
            res.status(400)
            throw new Error("please give email and otp both")
        }
        const user = await userSchema.findOne({ email });
        if (!user) {
            res.status(404);
            throw new Error(`User not found with email ${email}`);
        }
        if (user.isEmailVerfied) {
            res.status(500)
            throw new Error("email already verified")
        }
        const currenttime = await new Date(Date.now());
        if (otp === user.otp && !user.isEmailOtpUsed && currenttime < user.otpExpiry) {
            user.isEmailVerfied = true
            user.isEmailOtpUsed = true
            await user.save()
        } else {
            throw new Error("invalid otp or used otp or otp expier")
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})
const sendotp = asyncHandler(async (req, res) => {
    try {

        const { email } = req.body


        if (!email) {
            res.status(400)
            throw new Error("enter your email ")
        }
        const user = await userSchema.findOne({ email });
        if (!user) {
            res.status(404);
            throw new Error(`User not found with email ${email}`);
        }
        const generatedotp = generateOtp()
        user.otp = generatedotp
        const otpExpiryTime = await new Date(Date.now() + 15 * 60 * 1000);
        user.otpExpiry = otpExpiryTime
        user.isEmailOtpUsed = false
        await user.save()
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

const registeradmin=asyncHandler(async(req,res)=>{
    const { username, email, password, name, gender } = req.body
    if (!username || !email || !password || !name || !gender) {
        res.status(400)
        throw new Error("please enter all fiend")
    }

    const userByEmail = await userSchema.findOne({ email })

    const userByUsername = await userSchema.findOne({ username })

    if (userByEmail) {
        res.status(400)
        throw new Error(`user already available with ${email}`)
    }
    if (userByUsername) {
        res.status(400)
        throw new Error(`user already available with ${username}`)
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    
    const createUser = await userSchema.create({
        username,
        email,
        password: hashedpassword,
        name,
        gender,
        isEmailVerfied: true,
        role:"admin"
        
    })
    if (createUser) {
        res.status(201).json({
            __id: createUser.id,
            email: createUser.email,
            name: createUser.name,
            gender: createUser.gender,
        })
    }
    else {
        res.status(400)
        throw new Error("invalid data")
    }
    res.json({ message: "user register" })
})


const updateuser = asyncHandler(async (req, res) => {
    const { name, gender, userid } = req.body
    if (!userid) {
        res.status(400)
        throw new Error("provide userid")
    }
    if (userid === req.params.id) {
        const user = await userSchema.findById(req.params.id)
        if (!user) {
            res.status(404)
            throw new Error(`user not found with id: ${req.params.id}`)
        }

        if (!name || !gender) {
            res.status(400)
            throw new Error("Enter name and gender both")
        }
        user.name = name
        user.gender = gender
        await user.save()
        res.status(200).json(user)
    } else {
        res.status(500)
        throw new Error("you are not allowed")
    }

})

const deleteUserById = asyncHandler(async (req, res) => {
    const { userid } = req.body
    if (!userid) {
        res.status(400)
        throw new Error("provide userid")
    }
    if (!mongoose.isValidObjectId(userid)) {
        res.status(400);
        throw new Error("Invalid user ID format,use valid id format");
    }

 
    
    const checkuserrole = await userSchema.findById(userid)

    if (!checkuserrole) {
        res.status(404);
        throw new Error(`User not found with id: ${userid}`);
    }

    if (userid === req.params.id || checkuserrole.role === 'admin') {
        const user = await userSchema.findById(req.params.id)

        if (!user) {
            res.status(404)
            throw new Error(`user not found with id: ${req.params.id}`)
        }
        await userSchema.findByIdAndDelete(req.params.id)
        res.status(200).json(user)
    } else {
        res.status(500)
        throw new Error("you are not allowed")
    }

})



const updateuseremail = asyncHandler(async (req, res) => {
    const { userid, email } = req.body
    if (!userid) {
        res.status(400)
        throw new Error("provide userid")
    }
    if (!email) {
        res.status(400)
        throw new Error("Enter your email")
    }
    if (req.params.id === userid) {
        const user = await userSchema.findById(req.params.id)
        if (!user) {
            res.status(404)
            throw new Error(`user not found with id: ${req.params.id}`)
        }

        const useremail = await userSchema.findOne({ email })
        if (useremail) {
            res.status(500)
            throw new Error(`${email} already register,try different email`)
        }



        user.email = email
        user.isEmailVerfied = false
        await user.save()
        res.status(200).json(user)
    } else {
        res.status(500)
        throw new Error("you are not allowed")
    }

})

const updateuserusername = asyncHandler(async (req, res) => {
    const { username, userid } = req.body
    if (!userid) {
        res.status(400)
        throw new Error("provide userid")
    }
    if (!username) {
        res.status(400)
        throw new Error("Enter change username")
    }
    if (req.params.id === userid) {
        const user = await userSchema.findById(req.params.id)
        if (!user) {
            res.status(404)
            throw new Error(`user not found with id: ${req.params.id}`)
        }



        const userByUsername = await userSchema.findOne({ username })
        if (userByUsername) {
            res.status(400)
            throw new Error(`${username} already register,try different user name`)
        }
        user.username = username
        await user.save()
        res.status(200).json(user)
    } else {
        res.status(500)
        throw new Error("you are not allowed")
    }

})

const updatepassword = asyncHandler(async (req, res) => {
    const { password, changepassword, userid } = req.body
    if (!password) {
        res.status(400)
        throw new Error("Enter your previous password")
    }

    if (!changepassword) {
        res.status(400)
        throw new Error("Enter your new password")
    }
    if (!userid) {
        res.status(400)
        throw new Error("provide userid")
    }
    if (req.params.id === userid) {
        const user = await userSchema.findById(req.params.id)
        if (!user) {
            res.status(404)
            throw new Error(`user not found with id: ${req.params.id}`)
        }


        if (user.password === password) {
            const hashedpassword = await bcrypt.hash(changepassword, 10);
            user.password = hashedpassword
            await user.save()
        } else {
            res.status(500)
            throw new Error("password not matched")
        }

        res.status(200).json(user)
    } else {
        res.status(500)
        throw new Error("you are not allowed")
    }

})

const forgetpassword = asyncHandler(async (req, res) => {
    const { email, otp } = req.body

    if (!email) {
        res.status(400)
        throw new Error("Enter your email")
    }

    if (!otp) {
        res.status(400)
        throw new Error("Enter your otp")
    }
    const user = await userSchema.findOne({ email })
    if (!user) {
        res.status(404)
        throw new Error(`user not found with id: ${req.params.id}`)
    }
    const currenttime = await new Date(Date.now());
    if (user.otp == otp && !user.isEmailOtpUsed && currenttime < user.otpExpiry) {
        const hashedpassword = await bcrypt.hash(password, 10);
        user.password = changepassword
        await user.save()
    } else {
        res.status(500)
        throw new Error("password not matched")
    }

    res.status(200).json(user)
})


const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    
    const loginUser = await userSchema.findOne({email: email });
    if(!loginUser.isEmailVerfied){
        res.status(500);
        throw new Error("verify your email first");
    }
    
    if (loginUser && (await bcrypt.compare(password, loginUser.password) && loginUser.isEmailVerfied)) {
        res.status(200).json(loginUser)
    } else {
        res.status(500);
        throw new Error("Email or password not valid");
    }
})


const uploadProfileImage =asyncHandler( async (req, res) => {
    
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }       
        const {userId} = req.body
        
        if(!userId){
            res.status(400)
            throw new Error("provide userId")
        }   
                
        if(userId!=req.params.id){
            res.status(400)
            throw new Error("you are not allowed")   
        }  
             
        const user = await userSchema.findById( req.params.id );
        
        if (!user) {
            res.status(404)
            throw new Error(`user not found with id ${req.params.id}`)
        }     
       
        user.prfileImageUrl = `/uploads/userimages/${req.file.filename}`;
        await user.save();
        res.status(200).json({
            message: 'Profile image uploaded successfully',
            profileImageUrl: user.prfileImageUrl
        });
    
});




module.exports = {
    registerUser,
    getUserById,
    getAllUsers,
    verifyuseremail,
    sendotp,
    updateuser,
    deleteUserById,
    updateuseremail,
    updateuserusername,
    updatepassword,
    forgetpassword,
    login,
    uploadProfileImage,
    registeradmin
}