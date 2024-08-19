const { Router } = require("express");
const {getallfeedback,getfeedbackbyid,getfeedbackbyuseremail,addfeedback, updatefeedback, deletefeedbackbyid, deleteall}=require('../controllers/feedbackController')
const router=Router()

router.get('/allfeedback',getallfeedback)
router.get('/feedbackbyid/:id',getfeedbackbyid)
router.get('/feedbackbyemail/:email',getfeedbackbyuseremail)
router.post('/addfeedback',addfeedback)
router.put('/updatefeedback/:id',updatefeedback)
router.delete('/deletefeedbackbyid/:id',deletefeedbackbyid)
router.delete('/deleteall',deleteall)


module.exports=router