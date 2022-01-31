const sidebar=require('../helpers/sidebar'),
	ImageModel = require('../models').Image;
module.exports = {
	index: function(request, response){
		
		var viewModel={
			images: []

		};   // End of viewModel
		ImageModel.find( {}, {}, { sort: { timestamp: -1 } }, function ( err, images) {
			if (err) { throw err; }
			viewModel.images = images;
			console.log('Images are fetched from DB and displayed on Home Page.\n');
			sidebar(viewModel, function (viewModel) {
				response.render('index', viewModel);
			});
		});  // End of ImageModel.find( // Add .lean() for lean find)
	}
};