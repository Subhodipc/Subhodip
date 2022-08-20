const express=require('express');
const adminRouter=express.Router();

const adminController=require('../Controller/adminController');

adminRouter.get('/add_product' , adminController.getAddProduct);

adminRouter.post('/productdata' , adminController.postProductData);

adminRouter.get('/viewproduct' , adminController.getViewProduct);

adminRouter.get('/adminEditProduct/:prodid',adminController.editFormAdmin);

adminRouter.post('/postNewData',adminController.postEditFormData);

adminRouter.get('/deleteProductAdmin/:prodid',adminController.deleteProductAdmin);

adminRouter.get('/',adminController.getViewHome);

module.exports=adminRouter;

