const path = require('path');

const ProductModel=require('../Model/product');


exports.getAddProduct=(req,res)=>{
    res.render('Admin/Add_Product' ,{ 
        titlePage: "Product page",
        path:'/Add_product'
    })
}

exports.postProductData=(req,res)=>{
    console.log("Collected value from Product" , req.body);
   const p_Title=req.body.ptitle;
   const p_Price=req.body.price;
   const p_Desc=req.body.pdesc;

   const product_image=req.file;
   const pImage_url=product_image.path;

// key value come from model section(pTitle),others is from let p_Title
   const product=new ProductModel({pTitle:p_Title,pPrice:p_Price,pDesc:p_Desc,pImage:pImage_url});
         product.save()
         .then(result=>{
             console.log('Created product',result);
         })
             .catch(err=>{
                 console.log('product creation error',err);
             });
           res.redirect('/viewproduct');
}

exports.getViewProduct=(req,res)=>{
    ProductModel.find().then(products=>{
         console.log("Fetched product:",products)
        res.render('Admin/ViewProductAdmin',{
                 titlePage:"Products" ,
                 data:products,
                 path:'/viewproduct'
        })
    }).catch(err=>{
        console.log('Data fetching error in controller',err)
    })
}

exports.editFormAdmin=(req,res)=>{
    const prod_id=req.params.prodid;
    ProductModel.findById(prod_id).then(product=>{
        res.render('Admin/EditProduct',{
            titlePage:"edit page",
            data:product,
            path:"/adminEditProduct"
        })
    }).catch(err=>{
        console.log("Product not found to edit",err)
    })
}
exports.postEditFormData=(req,res)=>{
    const updatedpTitle=req.body.p_title;
    const updatedpPrice=req.body.p_price;
    const updatedpDesc=req.body.p_desc;
    const _prodId=req.body.prod_id;
    // console.log('update value',updatedpTitle,updatedpPrice,updatedpDesc,_prodId);
    ProductModel.findById(_prodId).then(productsData=>{
        productsData.pTitle=updatedpTitle;
        productsData.pPrice=updatedpPrice;
        productsData.pDesc=updatedpDesc;
    const new_Url=req.file;
    const old_Url=req.body.oldUrl;
    let pimageUrl;
if(new_Url === undefined)
{
    pimageUrl = old_Url;
}
else
{
 pimageUrl = new_Url.path;   
}
    return productsData.save()
           .then(results=>{
            console.log("Data Updated");
            res.redirect('/viewproduct');
           })
    }).catch(err=>{
        console.log(err);
    })
}
exports.deleteProductAdmin=(req,res)=>{
    const deleteId=req.params.prodid;
    ProductModel.deleteOne({_id:deleteId}).then(results=>{
        console.log("Deleted Successfully",results);
        res.redirect('/viewproduct');
    }).catch(err=>{
        console.log("Error to Delete",err);
    })
}

exports.getViewHome=(req,res)=>{
    res.render('Admin/Home' ,{ 
        titlePage: "Home page",
        path:'/'
    })
}

