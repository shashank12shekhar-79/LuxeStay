const express = require("express")
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const expressError=require("../utils/expressError.js");
const {listingSchema}=require("../schema.js");
const Listing=require("../models/listing.js")
const {isLoggedIn} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        console.log(error)
        const errMsg = error.details
            .map((el) => el.message)
            .join(", ");

        return next(new expressError(400, errMsg));
    }

    next();
};
//index route
router.get("/",wrapAsync(async(req,res)=>{
const allListing = await Listing.find({});
res.render("index.ejs",{allListing});
}));
//New Route
router.get("/new",isLoggedIn,wrapAsync(async(req,res)=>{
    console.log(req.user);
    res.render("new.ejs")
}));
//Add route
router.post("/",validateListing,wrapAsync(async(req,res)=>{
    let data=req.body;
    const newListing=new Listing(data.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    console.log(data);
    req.flash("success","New Listing Added!");
    res.redirect("/listing");
    }));
//show route
router.get("/:id",wrapAsync(async(req,res)=>{
let data=req.params;
let property=await Listing.findById(data.id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
if(!property)
{
    req.flash("error","Property Doesn't Exist!");
    res.redirect("/");
}
else
{
    console.log(property.reviews)
    res.render("show.ejs",{property});
}
}));
//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
let data=await Listing.findById(req.params.id);
if(!data)
{
    req.flash("error","Property Doesn't Exist!");
    res.redirect("/");
}
else{
res.render("edit.ejs",{data});
}
}));
//Update route
router.put("/:id",validateListing,isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
let {id}=req.params;
await Listing.findByIdAndUpdate(id,req.body.listing);
req.flash("success","Updated Successfully!");
res.redirect(`/listing/${id}`);
}));
//Delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
let {id}=req.params;
await Listing.findByIdAndDelete(id);
req.flash("success","Deleted Successfully!");
res.redirect("/");
}))
module.exports=router;