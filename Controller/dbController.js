const path = require('path');
const AuthModel=require('../Model/reg_form');

exports.viewProfile=(req,res)=>{
    const user_id=req.user._id;
    console.log("Collected id",user_id);
    AuthModel.findById(user_id)
    .then(result=>{
        res.render('Auth/dashboard',{
            titlePage:"details",
            data:result,
            path:"/profile"
        })
    }).catch(err=>{
        console.log("Dashboard error",err)
    })
}

exports.getLogOut=(req,res)=>{
    req.session.destroy();
    res.redirect("/login_form");
}

exports.getEditProfile= (req,res) =>{
    const user_id=req.user._id;
    console.log("Collected Profile id",user_id);
    AuthModel.findById(user_id)
    .then(result=>{
        res.render('Admin/EditProfile',{
            titlePage:"EditProfile",
            data:result,
            path:"/EditProfile"
        })
    }).catch(err=>{
        console.log("EditProfile error",err)
    })
 }


 