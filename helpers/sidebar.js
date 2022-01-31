const   Stats=require('./stats'),
        Images=require('./images'),
        Comments=require('./comments'),
        async = require('async');
module.exports = function(ViewModel, callback){
        async.parallel([
            (next) => {
                Stats(next);
            },
            (next) => {
                Images.popular(next, callback);
            },
            (next) => {
                Comments.newest(next);
            }
        ],
        (err, results) => {
            ViewModel.sidebar = {
                stats:  results[0],
                popular: results[1],
                comments:   results[2]
            };  // End of ViewModel.sidebar
            callback (ViewModel);
        }  // End of (err, results) =>
        ); // End of async.parallel(    
    }; // End of function(ViewModel, callback)