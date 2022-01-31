/* jshint node: true */
// "use strict"

var models = require('../models'),
    async = require('async');


module.exports = {
    newest: (callback)=>{  // The original statement in the book
    // newest: function callback (err, comments) {
        // Find any comments, Limit the found comments to five comments, Sort in descending order
        models.Comment.find({} , {}, { limit: 5, sort: { 'timestamp': -1 }  },
            (err, comments) => {        // Callback function for models.Comment.find
                console.log('Finding all comments ...');
                var attachImage = (comment, next) => {  // attach an image to each comment...
                    models.Image.findOne( { _id: comment.image_id}, // Find the image which its _id is stored in image_id of comment 
                        (err, image) => {
                            console.log('Finding the corresponding image for the comment. image_id: ', comment.image_id);
                            if (err) {
                                console.log('Error! The image for the comment can nott be found.');
                                throw err;
                            }
                            if (!err && image) {
                                console.log('Image found for comment and its id: ', comment.image_id);
                                comment.image = image;  // Assign the found image to comment.image
                            }  // End of if (!err && image)
                            next (err);
                        }); // End of models.Image.findOne
                }; // End of var attachImage = (comment, next) ...
            
                async.each(comments, attachImage, // Apply the attchImage function to each comment
                    (err) => {
                        if (err) { throw err;}
                        callback ( err, comments);
                    } );  // End of async.each(
            }  // End of (err, comments) => { ...
        );  // End of models.Comment.find
    }   // End of newest:
};