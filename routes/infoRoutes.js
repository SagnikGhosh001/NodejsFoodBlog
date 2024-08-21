const { Router } = require("express");
const{getallinfo,getinfobyid,getinfobyparentid,addinfo,updateinfo,deletebyid,deleteall, uploadInfoImage}=require('../controllers/infoController');
const multer = require("multer");
const path = require('path');
const  validtoken= require('../middleware/validToken');
const router=Router()
const storage = multer.diskStorage({
    destination: (req, file, cb) => {        
        cb(null, path.join(__dirname, '../uploads/infoimages'));      
    },
    filename: (req, file, cb) => {                
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });
router.use(validtoken)
router.get('/allinfo',getallinfo)
router.get('/infobyid/:id',getinfobyid)
router.get('/infobyparentid/:id',getinfobyparentid)
router.post('/addinfo',addinfo)
router.put('/updateinfo/:id',updateinfo)
router.delete('/deletebyid/:id',deletebyid)
router.delete('/deleteall',deleteall)
router.put('/uploadinfoimage/:id', upload.single('infoImage'),uploadInfoImage)

module.exports=router