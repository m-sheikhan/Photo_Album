const models = require('../models'),
    async = require('async');
module.exports = function(callback) {
    async.parallel([
        (next) => {  // Calculate number of images 
            models.Image.countDocuments({}, next);
        },
        (next) => { // Calculate number of comments
            models.Comment.countDocuments({}, next);
        },
        (next) => { // Calculte number of views
            models.Image.aggregate([{
                $group: {
                    _id: '1',
                    viewsTotal: { $sum: '$views' }  // Store sum of views for each image in views
                    }
                }],
                function (err, result) {
                    var viewsTotal =0;
                    if (result.length>0) {
                        viewsTotal += result[0].viewsTotal;  // Add the result of sum to viewsTotal
                    }   // End of if (result.length>0)
                    next(null, viewsTotal);
                }   // End of function (err, result)
            );  // End of model.Image.aggregate({
        },
        (next) => { // Calculate number of likes
            models.Image.aggregate([{
                $group: {
                    _id: '1',
                    likesTotal: { $sum: '$likes' }  // Store sum of likes for each image in likes
                    }
                }],  function (err, result) {
                    var likesTotal =0;
                    if (result.length>0) {
                        likesTotal += result[0].likesTotal;  // Add the result of sum to viewsTotal
                    }   // End of if (result.length>0)
                    next(null, likesTotal);
                }   // End of function (err, result)
            );  // End of model.Image.aggregate([{
        }
        ],
        function (err, results){
            callback(null, {
            images: results[0],
            comments: results[1],
            views: results[2],
            likes: results[3]
            }); // End of callback(null, {...
        } // End of function (err, results)
    );  // End of async.parallel( ...
}; // End of function(callback)