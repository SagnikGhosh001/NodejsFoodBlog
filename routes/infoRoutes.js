const { Router } = require("express");
const{getallinfo,getinfobyid,getinfobyparentid,addinfo,updateinfo,deletebyid,deleteall}=require('../controllers/infoController')
const router=Router()

router.get('/allinfo',getallinfo)
router.get('/infobyid/:id',getinfobyid)
router.get('/infobyparentid/:id',getinfobyparentid)
router.post('/addinfo',addinfo)
router.put('/updateinfo/:id',updateinfo)
router.delete('/deletebyid/:id',deletebyid)
router.delete('/deleteall',deleteall)

module.exports=router