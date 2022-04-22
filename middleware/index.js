const { rawListeners } = require('../models/campgrounds');
var Campground = require('../models/campgrounds');
var Comment = require('../models/comment');
// all the middleware goes here
var middlewareObj ={};

// middleware to check campground ownership
middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(error,foundCampground){
            if(error){
                req.flash("error","Campgrounds not found");
                res.redirect("back");
            }else{
                // does user own this campground
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    // otherwise also redirect
                    req.flash("error","You don't have permission to do that")
                    res.redirect('back');
                }
            }
        });
    }else{
        // if not redirect to previous page 
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
}

// middleware to check comment ownership
middlewareObj.checkCommentOwnership= function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(error,foundComment){
            if(error){
                res.redirect("back");
            }else{
                // does user own this comment
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    // otherwise also redirect
                    req.flash("error","You don't have permission to do that");
                    res.redirect('back');
                }
            }
        });
    }else{
        // if not redirect to previous page 
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
}
// middleware to check if user is logged in or not
middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error","You need to be logged in to do that");
        res.redirect("/login");
    }
}
module.exports = middlewareObj;