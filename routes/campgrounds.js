var express = require('express');
var router = express.Router();
var Campground = require('../models/campgrounds');
var middleware = require('../middleware');

// index - display all the data
router.get("/",function(req,res){
    // Get all the campgrounds from DB
    Campground.find({},function(error,campgrounds){
        if(error){
            console.log(err);
        }else{
            res.render("campgrounds/index",{campgrounds:campgrounds});
        }
    })
});
// create - add new data 
router.post("/",middleware.isLoggedIn,function(req,res){
     // get data from form and add to campgrounda array
    var name= req.body.name;
    var image= req.body.image;
    var desc = req.body.description;
    var price = req.body.price;

    var author ={
        id: req.user._id,
        username: req.user.username   
    }
    var newCampground = {name: name,price:price,image: image,description: desc,author:author};
    // create new campground and save it to the database
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            req.flash("error","Error creating Campground");
            console.log(err);
        }else{
            req.flash("success","Campground created successfully");
            // redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
    
});
// new route -- show form to create new component
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});

// show route -- shows more info about a campground
router.get("/:id",function(req,res){
    // find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }else{        
            // render show template with that campground
            res.render("campgrounds/show",{campground:foundCampground});
        }
    });
});

// edit campground route
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    // is user loggedin
    Campground.findById(req.params.id,function(error,foundCampground){
        if(error){
            req.flash("error","Campground not found");
        }
        res.render("campgrounds/edit",{campground:foundCampground});
    });
    
});
// update campground route
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(error, updatedCampground){
        if(error){
            req.flash("error","Updating Campground");
            res.redirect("/campgrounds");
        }else{
            // redirect somewhere(show page)
            req.flash("success","Campground updated Successfully");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
    
})

// destroy campground route
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(error){
        if(error){
            req.flash("error","Error deleteing Campground");
            res.redirect("/campgrounds");
        }else{
            req.flash("success","Campground deleted Successfully");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;


