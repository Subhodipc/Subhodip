const express=require('express');
const dbRouter=express.Router();
const dbController=require('../Controller/dbController');

dbRouter.get('/profile',dbController.viewProfile);

dbRouter.get('/formLogOut',dbController.getLogOut);

dbRouter.get('/EditProfile',dbController.getEditProfile);

module.exports=dbRouter;