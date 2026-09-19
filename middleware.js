const wrapAsync = require("./utils/wrapAsync");
const Listing=require("./models/listing.js")
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated())
    {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","Login Your Acccount!")
        return res.redirect("/login");
    }
    next();
};
module.exports.savedRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};
module.exports.isOwner = wrapAsync(async(req,res,next)=>{
    let {id}=req.params;
    let listing_data = await Listing.findById(id);
    if(!listing_data.owner._id.equals(res.locals.currUser))
    {
        req.flash("error","You don't have authority to update!");
        return res.redirect(`/listing/${id}`);
    }
    next();
});