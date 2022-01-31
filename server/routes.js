const express = require('express'),
	router = express.Router(),
	home = require('../controllers/home'),
	image = require('../controllers/image');
	
module.exports = function (app) {
	router.get('/', home.index); // Render the home page of the website
	router.get('/images/:image_id', image.index);  // Render the page of a specific image
	router.post('/images', image.create);  // When a user submits and upload a new image
	router.post('/images/:image_id/like', image.like);  // When a user press the Like button for a specific image
	router.post('/images/:image_id/comment', image.comment); // When a user post a comment for a specific image
	router.delete('/images/:image_id', image.remove); // When a user wants to delete a specific image
	app.use(router);
};