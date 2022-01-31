const path=require('path'),
	routes=require('./routes'),
	express=require('express'),
	morgan=require('morgan'),
	expressHbrs=require('express-handlebars'),
	methodOverride=require('method-override'),
	bodyParser=require('body-parser'),
	cookieParser=require('cookie-parser'),
	errorHandler=require('errorhandler'),
	moment=require('moment'),
	multer=require('multer'),
	
	// Added to access virtual properties, before usage run the following command:
	// npm install @handlebars/allow-prototype-access --save
	{allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access'),
	Handlebars = require('handlebars');
	
module.exports = function (app) {
	app.use(morgan('dev'));
	app.use(bodyParser.urlencoded({'extended':true}));
	//app.use(bogyParser.json());
	
	// The following line can not be used for multipart form submissions in file upload
	// app.use(bodyParser.json({uploadDir:path.join(__dirname,'public/upload/temp')}));
	// So replaced with next line
	app.use(multer({dest:path.join(__dirname,'../public/upload/temp')}).any());
	console.log('dest:' + path.join(__dirname,'../public/upload/temp'));
	app.use(methodOverride());
	app.use(cookieParser('some-secret-value-here'));
	routes(app);  // Add the routes to routes folder
	app.use('/public/',express.static(path.join(__dirname,'../public')));
	if ('development'===app.get('env')) {
		app.use(errorHandler());
	}
	app.engine('handlebars',expressHbrs.create({ // Create an engine for handlebars based on express-handlebars 
		defaultLayout: 'main',  // Set the default layout
		layoutsDir: app.get('views')+'/layouts',
		partialsDir: [app.get('views')+'/partials'],  // partialsDir can have more than one item
		helpers: {
			timeago: (timestamp) => {
				return moment(timestamp).startOf('minute').fromNow();
			}
		},
		handlebars: allowInsecurePrototypeAccess(Handlebars)  // Added to access virtual properties */
	}).engine);
	app.set('view engine', 'handlebars'); // Set the Handlebars as a view engine for app
	return(app);
};  