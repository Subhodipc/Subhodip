const express=require('express');

const {check,body}=require('express-validator');

const authRouter=express.Router();

const authController=require('../Controller/authController');

authRouter.get('/form',authController.getForm);

authRouter.post('/formdata',
[
    body('fname','Valid First name here').isLength({min:3,max:12}).matches('^(?=.*[A-Za-z]).{3,12}$'),
    body('lname','Valid Last name here').isLength({min:3,max:12}).matches('^(?=.*[A-Za-z]).{3,12}$'),
    check('email').isEmail().withMessage("input valid email"),
    body('password','wrong pattern').matches('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*-_]).{4,12}$')
],
authController.postFormData);

authRouter.get('/login_form',authController.getLogin);

authRouter.post('/logindata',authController.postLoginData);

authRouter.get('/mail_confirmation/:email/:token',authController.confirmation);

// authRouter.get('/verified',authController.verified);

// authRouter.get('/not_verified',authController.not_verified);

authRouter.get('/forgot',authController.getForgotPwd);

authRouter.post('/forgotdata',authController.postForgotPassword);

authRouter.get('/setnewpassword/:id',authController.getSetPwd);

authRouter.post('/newpassworddata',authController.postSetNewPassword);



module.exports=authRouter;