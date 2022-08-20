const path = require('path');

const RegFormModel=require('../Model/reg_form');

const UserModel=require('../Model/reg_form');

const TokenModel=require('../Model/TokenModel');

const jwt=require('jsonwebtoken');

const bcrypt=require("bcryptjs");

const { validationResult } = require("express-validator");

const nodemailer=require('nodemailer');
const { info } = require('console');

const transporter=nodemailer.createTransport({
    host:"smpt",
    port:1000,
    secure:false,
    requireTLS:true,
    service:"gmail",
    auth:{
        user:'subhodipc42@gmail.com',
        pass:'sswarzccnkexwzja'
    }
})

exports.getForm=(req,res)=>{
    let message = req.flash("error");
    if (message.length>0)
    {
        message=message[0];
    }
    else
    {
        message=null;
    }
    res.render("Auth/form" ,{ 
        titlePage: "Registration Form",
        path:"/form",
        errorMsg: message,
        error: [],
    });
}

exports.postFormData=(req,res)=>{
    const ufName=req.body.fname;
    const ulName=req.body.lname;
    const uEmail=req.body.email;
    const uPwd=req.body.password;
    // console.log("Collected data from registration form",ufName,ulName,uEmail,uPwd);

    let error = validationResult(req);
    if (!error.isEmpty())
    {
    errorResponse=validationResult(req).array();
    res.render("Auth/form" ,{ 
        titlePage: "Registration Form",
        path:"/form",
        errorMsg: "",
        error: errorResponse,
    });
}
    else
    {
    RegFormModel.findOne({$or:[{email:uEmail},{fname:ufName},{lname:ulName}]})
    RegFormModel.findOne({email:uEmail})
    .then(userValue=>{
        if(userValue)
        {
          console.log(userValue, "Email already exist");
          req.flash("error","Email already exist");
          return res.redirect('/form'); 
        }
        return bcrypt.hash(uPwd,12)
        .then(hashPassword=>{
            const userData=new RegFormModel({fname:ufName,lname:ulName,email:uEmail,password:hashPassword})
            return userData.save((err,user)=>{
                if(!err)
                {
                  const token_jwt=jwt.sign({email:uEmail},"secretkey123456789@secretkey123456789",{expiresIn:'1h'});
                  const Token_data=new TokenModel({
                    token:token_jwt,
                    _userId:user._id
                  })
                  Token_data.save()
                .then(result=>{
            let mailOptions={
                from:'subhodipc42@gmail.com',
                to: user.email,
                subject:"Email Verification",
                text:'Hello' +user.fname+ ',\n\n'+ 
                'You have succesfully submitted your data to be registered.Please verify your account by clicking the link: \nhttp:\/\/'
                +req.headers.host+'\/mail_confirmation\/'+user.email+'\/'+ token_jwt +'\n\nThank you!\n'
            };
            transporter.sendMail(mailOptions,function(error,successInfo)
            {
                if(error)
                {
                    console.log("Error to send mail",error)
                }
                else{
                     console.log("Email sent",successInfo);
                     res.redirect('/form')
                }
            })
        })
        .catch(err=>{
            console.log("Error to save registered data",err);
        })
    }
    else
    {
        console.log("Error to add user",err)
    }
})
})
})
.catch(err=>{
        console.log("Error in find user",err);
    })
}
}

exports.confirmation=(req,res)=>{
    let email=req.params.email;
    let token=req.params.token;
    TokenModel.findOne({token:req.params.token})
    .then(result=>{
        console.log("Result of Token findone",result)
        if(!result)
        {
            console.log("Verification link may be expired :(");
        }
        else
        {
            UserModel.findOne({_id:result._userId,email:req.params.email})
            .then(userData=>{
                if(userData.isVerified)
                {
                  console.log("User already Verified")
                  res.redirect('/login_form');
                }
                else
                {
                    userData.isVerified=true;
                    userData.save()
                    .then(result=>{
                        console.log("Your account successfully verified")
                        res.redirect('/login_form');
                    })
                    .catch(err=>{
                        console.log("Something went wrong",err);
                    })
                }
            })
            .catch(err=>{
                console.log("User not Found",err);
                res.redirect('/form');
            })
        }
    })
    .catch(err=>{
        console.log("Error to find token in Database",err);
    })
}

// exports.verified=(req,res)=>{
//     let message = req.flash("msg");
//     if (message.length>0){
//         message=message[0];
//     }
//     else
//     {
//         message=null;
//     }
//     res.render("Auth/Verified" ,{ 
//         titlePage: "Verified Page",
//         path:"/Verified"
//     })
// }
// exports.not_verified=(req,res)=>{
//     let message = req.flash("msg");
//     if (message.length>0){
//         message=message[0];
//     }
//     else
//     {
//         message=null;
//     }
//     res.render("Auth/Not_Verified" ,{ 
//         titlePage: "Not Verified Page",
//         path:"/Not_Verified"
//     })
// }

exports.getLogin=(req,res)=>{
    let message = req.flash("error");
    if (message.length>0){
        message=message[0];
    }
    else
    {
        message=null;
    }
    res.render("Auth/login_form" ,{ 
        titlePage: "Login Form",
        path:"/login_form",
        errorMsg: message
    })
}

exports.postLoginData=(req,res)=>{
    const uemail=req.body.email;
    const upassword=req.body.password;
    console.log("Collected value from login form",uemail,upassword);
    RegFormModel.findOne({email:uemail})
    .then((userValue)=>{
        if(userValue)
        {
            if(!userValue.isVerified)
            {
              console.log("User is not verified");
              req.flash('error','User is not verified')
              res.redirect('/login_form');
            }
           else
           {
             bcrypt
                 .compare(upassword,userValue.password)
                 .then((result)=>{
                 if(!result)
               {
                 req.flash("error","Invalid Password");
                 console.log("Invalid Password");
                 res.redirect("/login_form");
               }
               else
               {
                   console.log("Logged In",result);
                   req.session.isLoggedIn=true;
                   req.session.user=userValue;
                   return req.session.save((err)=>{
                      if(err)
                     {
                        console.log("Error to Login",err);
                     }
                       else
                     {
                        console.log("Logged in");
                        return res.redirect("/user/product");
                     }
                       })
                }
                 })
                   .catch((err)=>{
                    console.log("Error in Comparison",err);
                    res.redirect("/login_form");
                 });
            } 
        }    
        else
        {
            console.log("Invalid Email address");
            req.flash('error','Invalid Email address');
            res.redirect('/login_form');
        }            
    })
    .catch((err)=>{
        console.log("Error to find Email",err);
    });
}

exports.getForgotPwd=(req,res)=>{
    res.render('Auth/forgot',{
        titlePage:"Forgot Password",
        path:"/forgot"
    })
    
}

exports.postForgotPassword= (req,res) =>{
    const forgot_email=req.body.email;
    // console.log("Collected Email id",forgot_email);
    RegFormModel.findOne({email:forgot_email})
    .then(userValue=>{
        if(!userValue)
        {
            console.log("Invalid Email");
            res.redirect('/forgot')
        }
        else
        {
            const user_id=userValue._id;
            // console.log("User Id:",user_Id);
            const url = "http://localhost:1000/setnewpassword/" + user_id;
            const textForGet="Click here-->";

            let mailOptions={
                from:'subhodipc42@gmail.com',
                to: forgot_email,
                subject:"Forget Password",
                text:'Set New Password',
                html:textForGet.concat(url)
            };
            transporter.sendMail(mailOptions,function(error,successInfo){
                if(error)
                {
                    console.log("Error to send mail:",error);
                }
                else
                {
                    console.log('Email Sent Successfully:' +info.responce);
                }
            });
            res.end();
        }        
    }).catch(err=>{
        console.log("Forgot Password error",err)
    });
}

exports.getSetPwd=(req,res)=>{
    const user_id=req.params.id;
    console.log("Collected id to change password:",user_id);
    res.render("Auth/setnewpassword",
    {
        titlePage:"Set New Password",
        userId:user_id,
        path:"/setnewpassword/:id"
    });
}

exports.postSetNewPassword=(req,res)=>{
    const user_id=req.body.user_id;
    const pwd=req.body.pwd;
    const cpwd=req.body.cpwd;

    RegFormModel.findById(user_id)
    .then(user=>{
        console.log("User in Setpassword",user);
        let user_email=user.email;
        console.log("Set New Password : ",user_id,pwd,cpwd,user_email);
        return bcrypt.hash(pwd,12)
        .then((hashPassword)=>{
            user.email=user_email,
            user.password=hashPassword
            return user.save()
            .then((result)=>{
                console.log("Password changed");
                return res.redirect("/login_form");
            }).catch((err)=>{
                console.log(err);
            })
        }).catch((err)=>{
            console.log("Hashing error",err);
        })
    }).catch((err)=>{
        console.log("No user found",err);
    })
}
