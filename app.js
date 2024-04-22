const express=require("express"),
    mongoose=require("mongoose"),
    passport=require("passport"),
    bodyParser=require("body-parser"),
    LocalStrategy=require("passport-local"),
    passportLocalMongoose=require("passport-local-mongoose")
    const User=require("./model/user");

    let app=express();

    mongoose.connect("mongodb://127.0.0.1/27017");


    app.set('view engine','ejs');
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(require("express-session")({
        secret:"Once again Rusty wins cutest dog!",
        resave:false,
        saveUninitialized:false
    }));
    
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());




//Routessssssssssssssssssssssss

app.get("/",function(req,res){
    res.render("home");
});



app.get("/secret",isLoggedIn,function(req,res){
    res.render("secret");
});

app.get("/register",function(req,res){
res.render("register");
});

app.post("/register",async(req,res)=>{
    const user=await User.create({
    username:req.body.username,
    password:req.body.password
    });
return res.status(200).json(user);
});

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login", async function(req,res){
try{
const user=await User.findOne({username:req.body.username});
if(user){
const result=req.body.password === user.password;
if(result){
    res.render("secret");
}else{
    res.status(400).json({error:"Password doesnt match"});
}
}
else{
    res.status(400).json({error:"User doesnt exist"});
}
}
catch(error){
res.status(400).json({error});
}
});


app.get("/logout", function(req,res){
req.logout(function(err){
    if(err){
        return next(err);
    }
    res.redirect("/");
});
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
        return next();
    res.redirect("/login");
}

let port=process.env.PORT || 3000;
app.listen(port,function(){
    console.log("Server is running on port 3000");
});

































