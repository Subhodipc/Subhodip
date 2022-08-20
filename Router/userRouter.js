const express=require('express');
const userRouter=express.Router();
const userController=require('../Controller/userController');
const Auth_check=require('../middle-ware/isAuth');


userRouter.get('/user/product',userController.getProduct);

userRouter.get('/userSideID/:prodid',userController.viewSingleProd);

userRouter.post('/search/products',userController.searchProducts);

userRouter.post('/addToCart',Auth_check,userController.postAddToCart);

userRouter.get('/cartPage',userController.getCartPage);

userRouter.get('/cartDelete/:productId',userController.getCartDelete);


module.exports=userRouter;