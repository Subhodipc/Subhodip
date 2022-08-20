const express=require('express');
const appServer=express();
const cookieParser=require('cookie-parser');
const csurf=require('csurf');
const adminRouting=require('./Router/adminRouter');
const userRouting=require('./Router/userRouter');
const authRouting=require('./Router/authRouter');
const dbRouting=require('./Router/dbRouter');


const UserModel=require("./Model/reg_form");
const session=require('express-session');
const mongodb_session=require('connect-mongodb-session')(session);
const path=require('path');
const multer=require('multer');
const mongoose=require('mongoose');
const flash=require('connect-flash');
const csurfProtection=csurf();
const dbUrl='mongodb+srv://sdc_13:subhodip300@cluster0.8bj7gho.mongodb.net/MongooseProject?retryWrites=true&w=majority'

appServer.use(cookieParser());
appServer.use(express.json());
appServer.use(express.urlencoded({extended : false}));
//it handles the request from url by either POST or GET method and return the encoded one.

const store=new mongodb_session({
    uri: 'mongodb+srv://sdc_13:subhodip300@cluster0.8bj7gho.mongodb.net/MongooseProjectNew',
    collection:'user-session'
})

appServer.use(session({secret:'secret-key',resave:false,saveUninitialized:false,store:store}))

appServer.use('/Uploaded_images',express.static(path.join(__dirname,'Uploaded_images')))

const fileStorage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'Uploaded_images')
    },
    filename:(req,file,callback)=>{
        callback(null,file.originalname)
    }
});

const fileFilter=(req,file,callback)=>{
    if(file.mimetype.includes("png")||file.mimetype.includes("jpg")||file.mimetype.includes("jpeg") )
    {
        callback(null,true)
    }
    else
    {
        callback(null,false)
    }
}

appServer.use(multer({storage:fileStorage,fileFilter:fileFilter,limits:{fieldSize:1024*1024*5}}).single('pimage'))

appServer.set('view engine' , 'ejs');
appServer.set('views', 'View');
appServer.use(flash());
appServer.use((req,res,next)=>{
    if(!req.session.user)
    {
        return next();
    }
    UserModel.findById(req.session.user._id)
    .then(userValue=>{
        req.user=userValue;
        console.log('User details:',req.user)
        next();
    }).catch(err=>{
        console.log("User not found",err)
    });
});
appServer.use(express.static(path.join(__dirname, 'Public')));
appServer.use((req,res,next)=>{
    res.locals.isAuthenticated=req.session.isLoggedIn;
    next();
})
appServer.use(csurfProtection);
// always use after cookie parser and session

appServer.use((req,res,next)=>{
    res.locals.isAuthenticated=req.session.isLoggedIn;
    res.locals.csrf_token=req.csrfToken();
    next();
})

appServer.use(adminRouting);
appServer.use(userRouting);
appServer.use(authRouting);
appServer.use(dbRouting);

// appServer.use((req,res)=>{
//     res.send('<h2>Page not found! Please reload</h2>')
// })

appServer.use(function(req,res,next){
    res.render('Admin/PNF',{
        titlePage:"error",
        status:404,
        url:req.url,
        path:''});
});


mongoose.connect(dbUrl,{useNewUrlParser:true,useUnifiedTopology:true})
.then(result=>{
    console.log("Database Connected");
    appServer.listen(1000,()=>{
        console.log("Server is connected at localhost:1000")
        })
})
.catch(err=>{
    console.log("Database is not Connected");
})
