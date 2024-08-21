const { Router } = require("express");
const {getAllBlogs,getBlogsById,getBlogsByUserId,addBlogs,updateblog,deleteById, uploadBlogImage} = require('../controllers/blogController');
const  validtoken= require('../middleware/validToken');
const router=Router()
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {        
        cb(null, path.join(__dirname, '../uploads/blogimages'));      
    },
    filename: (req, file, cb) => {                
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.use(validtoken)
router.get('/allblog',getAllBlogs)
router.get('/blogbyid/:id',getBlogsById)
router.get('/blogbyuserid/:id',getBlogsByUserId)
router.post('/addblog',addBlogs)
router.put('/updateblog/:id',updateblog)
router.delete('/deletebyid/:id',deleteById)
router.put('/uploadblogimage/:id', upload.single('blogImage'),uploadBlogImage)

module.exports=router