const { Mongoose, default: mongoose } = require("mongoose")
const { createHmac, randomBytes } = require('crypto');
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "please add username"],
        unique: [true, "username address already taken"]
    },
    email: {
        type: String,
        required: [true, "please add email"],
        unique: [true, "Email address already taken"]
    },
    // salt: {
    //     type: String,
    //     required: true
    // },
    password: {
        type: String,
        required: [true, "please add password"],
    },
    name: {
        type: String,
        required: [true, "please add name"]
    },
    gender: {
        type: String,
        required: [true, "please add gender"]
    },
    otp: {
        type: String,
    },
    otpExpiry: {
        type: Date, 
    },
    isEmailVerfied: {
        type: Boolean,
    },
    isEmailOtpUsed: {
        type: Boolean,
    },
    prfileImageUrl: {
        type: String,
        default: '../public/images/pngtree-blue-default-avatar-png-image_2813123.jpg',
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
}, {
    timestamps: true
})

// userSchema.pre('save', function (next) {
//     const user = this;

//     if (!user.isModified('password')) return;

//     const salt = randomBytes(16).toString();
//     const hashedPassword = createHmac('sha256', salt).update(user.password).digest("hex")
//     this.salt=salt;
//     this.password=hashedPassword

//     next()
// })


module.exports = mongoose.model("user", userSchema)