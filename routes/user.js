const express = require("express")
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const {savedRedirectUrl} = require("../middleware.js");


router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});
router.post("/signup",wrapAsync(async(req,res)=>{
    try {
        let {username,email,password}=req.body.user;
        const newUser = new User({email,username});
        let registeredUser = await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err)
            {
                next(err);
            }
            req.flash("success","Logged In Successfully!");
            res.redirect("/listing");
        });
        console.log(registeredUser);
    } catch (error) {
        req.flash("error",error.message);
        res.redirect("/signup");
    }
}));
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});
router.post("/login",
    savedRedirectUrl,
    passport.authenticate("local",{
        failureRedirect : "/login",
        failureFlash : true,
    }),
    async(req,res)=>{
        req.flash("success","Welcome to LUXESTAY");
        let redirecturl = res.locals.redirectUrl || "listing";
        res.redirect(redirecturl);
        
});
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err)
        {
            next(err);
        }
        req.flash("success","Account logged out!");
        res.redirect("/listing");
    });
});
module.exports = router;