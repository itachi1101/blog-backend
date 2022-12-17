 const { Router } = require("express");
const activityController =require('../controllers/activityController')
const router=Router()

// create
router.post("/api/activity/create",activityController.createActivity)

// update
router.put("/api/activity/update",activityController.updateActivity)

// delete 
router.post("/api/activity/delete",activityController.deleteActivity)

// get 
router.get("/api/activity/trending",activityController.getActivity)


module.exports=router