var express = require('express');
const { route } = require('express/lib/application');
var router = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middleware = require('../middleware');
// new nested route for adding comments
router.get("/new",middleware.isLoggedIn,function(req,res){
    // find campground by id
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            req.flash("error","Some error occoured while creating the comment");
            console.log(err);
        }else{
            res.render("comments/new",{campground:campground});
        }
    })
});
// create nested route to create new comment
router.post("/",middleware.isLoggedIn,function(req,res){
    // lookup campground using id
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            req.flash("error","Some error occoured while creating the comment");
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            // create new comment
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    req.flash("error","Something went wrong");
                    console.log(err);
                }else{
                    // add username and id to the comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save() ;
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","Successfully added comment");
                    // redirect campground show page
                    res.redirect('/campgrounds/'+campground._id);
                }
            });
        }
    });
})
// edit comments route
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(error,foundComment){
        if(error){
            req.flash("error","Some error occoured while editing the comment");
            res.redirect("back");
        }else{
             res.render("comments/edit",{campground_id:req.params.id,comment:foundComment});
        }
    });
})
// update comment route
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(error,updatedComment){
        if(error){
            req.flash("error","Some error occoured while updating the comment");
            res.redirect("back");
        }else{
            req.flash("success","Comment updated successfully");
            res.redirect("/campgrounds/" +req.params.id);
        }
    })
});
// delete comment route
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(error){
        if(error){
            req.flash("error","Some error occoured while deleting the comment");
            res.redirect("back");
        }else{
            req.flash("success","Comment Removed Successfully");
            res.redirect("/campgrounds/" + req.params.id);

        }
    });
});

module.exports = router;
