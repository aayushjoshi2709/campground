var mongoose = require('mongoose');
var Campground = require('./models/campgrounds');
var Comment = require('./models/comment');
var data = [
                {
                     name: "Cloud's Rest",
                     image: "https://pixabay.com/get/g5b477d240ee85575e0eabaf3634f183f11535a5cb3afda7226a627eaa094cfce0ec5a9f83d0850b49f28368d93e5d863_340.jpg",
                     description: "Pariatur occaecat qui duis laboris. Labore nisi aliqua esse cupidatat mollit exercitation labore nostrud adipisicing. Reprehenderit elit ad aliqua labore. Occaecat excepteur excepteur non velit eu sint aliqua ullamco aliqua proident in ipsum enim tempor. Ex qui nulla elit sit Lorem ex magna sint enim ipsum esse. Quis reprehenderit amet enim elit ea."   
                },
                {
                    name: "Desert Mesa",
                    image: "https://pixabay.com/get/g8eb533b987076539dab551f534bf8f05ef3a3af34c0bec8773d665b8d172b7ccbe49926b3baec4e302c4087b2a5a8d3c_340.jpg",
                    description: "Ut officia ex commodo nisi anim ad eu aliqua laboris non laboris dolore cupidatat. Esse nisi velit amet minim est Lorem commodo nisi pariatur ut magna ut esse quis. Veniam et pariatur duis nisi quis eiusmod dolor elit. Velit id cupidatat magna tempor quis est tempor fugiat aliquip qui sunt culpa magna. Lorem nulla nisi consectetur amet aute sunt id adipisicing esse aliqua sunt elit Lorem mollit. Labore aliquip incididunt officia nulla quis velit elit et dolore fugiat sunt nulla cupidatat."   
                },
                {
                    name: "Canyon Floor",
                    image: "https://pixabay.com/get/g49d7b9e7f502fc3f8e793c4c1a8d2a6f8a88d31f2ec9347fcb9eb2070cc291791ae3c7800d4d87e77732c865a7e9ce87_340.jpg",
                    description: "Pariatur culpa do duis excepteur deserunt ea aute dolor consequat. Minim nostrud amet non mollit nisi aliqua pariatur aliquip laboris sunt reprehenderit in. Ex anim minim quis tempor nostrud amet officia commodo labore mollit tempor officia. Cupidatat Lorem magna do sunt officia ad non magna ipsum laborum duis voluptate nostrud quis. Cillum eu nulla amet dolore veniam. Fugiat in est aliquip exercitation incididunt commodo laboris amet aliqua consequat cupidatat pariatur duis. Officia labore duis aliqua pariatur culpa proident occaecat quis sunt deserunt."   
                }
            ];
function seedDB(){
    // remove all campgrounds
    Campground.remove({},function(error){
        if(error){
            console.log(error);
        }else{
            console.log("removed campgrounds !!!");
            // add few campgrounds
            data.forEach(function(seed){
                Campground.create(seed,function(err,campground){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("added a campground");
                        // create a comment on each campground
                        Comment.create(
                            {
                                text: "This place is great, but I wish that I had Internet",
                                author: "Homer"
                            },function(error,comment){
                                if(error){
                                    console.log(error);
                                }else{
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("created new comment");
                                }
                            });
                    }
                });
            });
        } 
    });
}
module.exports = seedDB;