const path = require('path');

const ProductModel = require("../Model/product");

const CartModel = require("../Model/cart");

exports.getProduct= (req,res) =>{
   ProductModel.find()
   .then(products=>{
       res.render('User/ViewProductUser',{
        titlePage:"Product details",
        data:products,
        path:"/user/product"
       })
   }).catch(err=>{
       console.log(err);
   })
}
exports.viewSingleProd=(req,res)=>{
    const prod_id=req.params.prodid;
    ProductModel.findById(prod_id).then(products=>{
        res.render('User/Productdetails',{
            titlePage:"Detail Product",
            data:products,
            path:"/userSideID"
        })
    }).catch(err=>{
        console.log("Product not found",err)
    })
}
exports.searchProducts=(req,res)=>{
    const searchText=req.body.searchproduct;
    ProductModel.find({pTitle:searchText})
    .then((products)=>{
        res.render('User/ViewProductUser',{
            titlePage:"Search Product",
            data:products,
            path:"/search/products"
        })
    }).catch((err)=>{
        console.log('Search Products Error',err);
    })
}
exports.postAddToCart=(req,res)=>{
    const pId=req.body.productId;
    const quantity=req.body.quantity;
    const userId=req.user._id;
    console.log("After add to cart: pId: ",pId,"Quantity:",quantity,"Id:",userId);

    const cartValue=[];
    CartModel.find({userId:userId,productId:pId})
    .then(cartData=>{
        console.log("cartdata:", cartData);
        if(cartData=='')
        {
            ProductModel.findById(pId)
            .then(productForCart=>{
                console.log("Product for cart:",productForCart);
                cartValue.push(productForCart);
                const cartProduct=new CartModel({productId:pId,quantity:quantity,userId:userId,cart:cartValue});
                cartProduct.save()
                .then(result=>{
                    console.log("product added into cart successfully");
                    res.redirect('/cartPage');
                    // res.end();
                }).catch(err=>{
                    console.log(err);
                })
            }).catch(err=>{
                console.log(err);
            })
        }
        else
        {
            cartData[0].quantity=cartData[0].quantity+1;
            cartData[0].save()
            .then(result=>{
                console.log("Product again added into cart successfully");
                res.redirect('/cartPage');
            }).cath(err=>{
                console.log(err);
            })
        }
    }).catch(err=>{
        console.log("Product can not be added",err);
    })
}

exports.getCartPage= (req,res)=>{
    const user_id=req.user._id;
    CartModel.find({userId:user_id})
    .then(viewProductsCart=>{
        res.render('User/cartPage',{
         titlePage:"Cart details",
         path:"/cartPage",
         data:viewProductsCart
        })
    }).catch(err=>{
        console.log(err);
    })
}
exports.getCartDelete=(req,res)=>{
    const deleteId=req.params.productId;
    CartModel.deleteOne({_id:deleteId}).then(results=>{
        console.log("Deleted Successfully",results);
        res.redirect('/cartPage');
    }).catch(err=>{
        console.log("Error to Delete",err);
    })
}
