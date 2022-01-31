const { Console } = require('console');
const 	fs = require('fs'),
		path = require('path'),
		sidebar = require('../helpers/sidebar'),
		Models = require('../models'),
		md5 = require('md5');
// const { models } = require('mongoose');


// var image = new Models.Image;
module.exports = {
	index: function(request,response){
		var viewModel={
			image:{},
			comments:[]
		};  
		Models.Image.findOne( {'filename': { $regex: request.params.image_id}} ,
			function(err, image) {
				if (err) {
					console.log('Error in finding image!');
					throw err;}
				if (!err && image) {  // if the specified image found
					console.log('Image found and it will be displayed. filename: ', image.filename);
					console.log('image.uniqueId get from virtual property: ',image.uniqueId);
					console.log('image.uniqueId get from filename: ', image.filename.substring(0,image.filename.indexOf('.')));
					image.views = image.views +1;  	// Update views counter of the image
					console.log('image.views: ',image.views);
					viewModel.image = image;		// Attach the found image to the viewModel
					image.save();
					
					Models.Comment.find( {'image_id': image._id} , {},
						{sort: {'timestamp':1}},
						function(err, comments) {
							//if (err) {throw err;}
							viewModel.comments= comments;   // Attch the array of found comments to viewModel
							sidebar(viewModel, function(viewModel){		// Render the page using sidebar, passing the viewModel and callback function
								response.render('image', viewModel);
							});  // End of function(err, comments)
						}).lean(); // Models.Comment.find  // Add .lean() for lean find
				} // End of if (image)
				else {  // If Image not found
					console.log('The specified image was not found!');
					response.redirect('/');
				}
			});  // End of FindOne // Add .lean() for lean find
	},    // End of index
	
	create: function(request, response){
			
		var saveImage = function() {
			// To do ...
			var possible='abcdefghijklmnopqrstuvwxyz0123456789',
				imgUrl='';
				for (var i=0; i<6; i+=1) { // Generate a random 6-digit alphanumeric string for image identifier
					imgUrl += possible.charAt(Math.floor(Math.random()*possible.length));
				}
			console.log("imgUrl: "+ imgUrl);
			//console.log("Request: "+ request);
			// Search for an image with the same filename by performing a find:
			Models.Image.find({'filename': imgUrl}, function(err, images){
				if ( images.length>0 ) {  // If an image with the same filename found
					console.log('Duplicate imgUrl! So try again.\n');
					saveImage();  // Try again to build another imgUrl
				}
				else { // If the imgUrl is unique, then use it for filename 
					// const tempPath = request.files.file.path, // Temporary location of uploaded file (original in the book which is incorrect)
					const tempPath = request.files[0].path,  // Temporary location of uploaded file (the correct one)
					//	ext = path.extname(request.files.file.name).toLowerCase(), // Get file extension of the uploaded file (original in the book which is incorrect)
					ext = path.extname(request.files[0].originalname).toLowerCase(),  // Get file extension of the uploaded file (the correct one)
					targetPath = path.resolve('./public/upload/'+imgUrl+ext);  // The final path for the image file
					// 	targetPath = path.resolve(`./public/upload/${imgUrl}${ ext}`); // The above line in 3rd edition of the book
					console.log("tempPath: " + tempPath);
					console.log("ext: " + ext);
					console.log("targetPath: " + targetPath);
					// If the file extension is suitable for an image file
					if (ext==='.png' || ext==='.jpg' || ext==='.jpeg' || ext==='.gif' || ext==='.tiff' || ext==='.bmp') {
						// Rename the temp file name to the final path
						fs.rename(tempPath, targetPath, function(err) {  
							if (err) throw err;
						
							var newImg = new  Models.Image({ // Create a new Image model and populate its values
								title: request.body.title,
								description: request.body.description,
								filename: imgUrl + ext
							});
							// and save the new image
							newImg.save(function(err, image){
								console.log('Successfully inserted image: ' + image.filename);
								console.log('Image_id: ', image.uniqueId);
								response.redirect(`/images/${image.uniqueId}`);
							});	//End of image.save
						});  // fs.rename(temp...
					}
					else { // When the file has not the suitable image file extension
						// Unlink the temp file from fs
						fs.unlink(tempPath, function(){ 
							if (err) throw err;
							// Send an error as a JSON object
							console.log('Error: Only image files are allowed.');
							response.status(500).json({error: 'Only image files are allowed.'});
						});
					}  // else { // When the file has not the suitable image file extension
				} // else { // If the imgUrl is unique, then use it for filename
			});  // End of Models.Image.find(	// Add .lean() for lean find		
		};  // End of saveImage function definition
		saveImage();  // Call SaveImage function		
	},	// End of create
	
	like: function(request,response){
		console.log('request.params: ', request.params);
		console.log('filename: ',  request.params.image_id);
		Models.Image.findOne( {'filename': { $regex: request.params.image_id}} ,
			function(err, image){						
				if (err) {
					console.log('An Error occurred during finding file!\n');
					throw err;
				}
				if (!err && image) {	// If the specified image is found without any error
					//console.log('Image found. image_id:', filename);		
					image.likes = image.likes+1;  // Update the like number
					console.log('Like couner is updated for the image.');
					image.save( function(err) {	// Save the updated image
						if (err){   	// If an error occured
							console.log('An error occurred during updating image!');
							response.json(err);  // Send the error to response
							throw err;
						}
						else {     		// When there is no error
							console.log('Image is saved with new Likes counter.');
							response.json({likes: image.likes}); // Send the updated likes in response
						}
					});  // End of image.save( function(err)
				}  // End of if (!err && image)
			}	 // End of function(err, image)	
			); // End of Models.Image.findOne(  // Add .lean() for lean find
		},	// End of like
	
	comment: function(request,response){
		//response.send("The image:comment POST Controller");  // This commmand has not useful output, so it can be deleted
		Models.Image.findOne(
			{'filename': {$regex: request.params.image_id}} ,
			function(err, image) {
				if (!err && image) {  // If an image found without any errors
					console.log('Image found and comment will be added.');
					var newComment = new Models.Comment(request.body);
					newComment.gravatar = md5(newComment.email);
					newComment.image_id = image._id;
					console.log('Image Id for this comment: ', image._id);
					newComment.save( function(err, comment) {
						if (err) {throw err;}
						console.log('Comment accepted.');
						response.redirect(`/images/${image.uniqueId}#${comment._id}`);

					}); // End of newComment.save()
				} // End of if (!err && image)
				else {
					response.redirect('/');
				}
			} // End of function(err, image)
		);  // End of Models.Image.findOne(  // Add .lean() for lean find
	},  // End of comment: function(request,response)

	remove: function (request,response) {
		Models.Image.findOne( {filename: {$regex: request.params.image_id}}, // Find the image, specified by image_id
			function(err, image) { //Callback function when the specified image found for deletion
				if (err) { throw err;}
				fs.unlink(path.resolve(`./public/upload/${image.filename}`),  // Delete the image file from File System
					function(err) {  // Callback function when file deletion completed
						if (err) { throw err;}
						console.log(`The image file ${image.filename} removed from File System.`);
						Models.Comment.deleteMany( {image_id: image._id},  // Remove the corresponding comments of the image from DB
							function(err) {   // Callback function when comment removal completed
								console.log('All Comments removed from DB.');
								Models.Image.deleteOne( {filename: image.filename}, function(err){ // Delete the image from DB after comments removal
									if (!err) {
										console.log('The Image successfully removed from DB.');
										response.json(true); // This line was in original file but generaates error
									}
									else {
										response.json(false); // This line was in original file but generaates error
									}
								}); // End of Models.Image.deleteOne( {

							} // End of function(err) {   // Callback function when comment removal completed

						);  //End of models.Comment.remove(
 
					} // End of function(err) {  // Callback function when file deletion completed
				);
				// response.redirect('/');
			} // End of function(err, image) { ...
		); // End of models.Image.findOne(
	}  // End of remove: function (request,response)
	
};