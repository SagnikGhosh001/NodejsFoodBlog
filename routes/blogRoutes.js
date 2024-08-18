const { Router } = require("express");
const {getAllBlogs,getBlogsById,getBlogsByUserId,addBlogs,updateblog,deleteById} = require('../controllers/blogController');

const router=Router()

router.get('/allblog',getAllBlogs)
router.get('/blogbyid/:id',getBlogsById)
router.get('/blogbyuserid/:id',getBlogsByUserId)
router.post('/addblog',addBlogs)
router.put('/updateblog/:id',updateblog)
router.delete('/deletebyid/:id',deleteById)

module.exports=router