const { Router } = require("express");
const {getallfeedback,getfeedbackbyid,getfeedbackbyuseremail,addfeedback, updatefeedback, deletefeedbackbyid, deleteall}=require('../controllers/feedbackController')
const  validtoken= require('../middleware/validToken');
const router=Router()

router.get('/allfeedback',getallfeedback)
router.get('/feedbackbyid/:id',getfeedbackbyid)
router.get('/feedbackbyemail/:email',getfeedbackbyuseremail)
router.post('/addfeedback',validtoken,addfeedback)
router.put('/updatefeedback/:id',validtoken,updatefeedback)
router.delete('/deletefeedbackbyid/:id',validtoken,deletefeedbackbyid)
router.delete('/deleteall',validtoken,deleteall)


module.exports=router