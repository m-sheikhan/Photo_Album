# Photo_Album
A Web Application to store and display photos
This is a public Photo Album that each user can:
 - Upload a new photo, write a title and description for it.
 - Watch an existing photo, like it and write comments for it. 
 - Delete a photo after user confirmation.
 - See statistics of views, likes and comments for each photo and overall.
 - Watch the thumbnails of the most popular photos.
 - Read the last comments for photos.
 
This app is based on MVC design pattern, which consists of Data Model, Views and Control. The infrastructure for Data Model is MongoDB, to have a flexible schema for further development. Views in frontend, are combination of HTML, CSS and JavaScript. Control in backend is Node.js
Project files are also organized based on MVC:
  Model: “models” folder consist of files needed for Data Model:
- Index.js says that our data model has two schema: image and comment
- Image.js is schema for image info and comment.js is schema for a user comment. This schema has a virtual property, image that specifies the image which this comment is written for it.
View:  The “view” folder contains all templates providing View of project and show photos and info to user. It has a layout subfolder with main.handlebars which is the main layout for Web page. It has a sidebar in which statistics, popular images and comments are inserted. The {{body}} part is where one of two other handlebars inserted:

- Index handlebar used for uploading an image and shows the latest images at the bottom.
- Image handlebar shows an image and its statistics. The user can write and post a comment for that image. Previous comments for that image are displayed in the lower part.
- In partial folder, there are handlebars for sidebar display. Stats shows the statistics. Popular dge.js displays thumbnails of photos with most likes and comments shows the latest comments.
Control: Control is like a glue and relates View to Data Model. 
In “controllers” folder, two files exist:
-Home.js is used to fetch newest photos from database and used for home page.
-Image.js includes functions used for each image such as fetching an image from database, saving a new image to database, managing likes and comments for an image and deleting an image from database.
- In “helpers’ folder, there are JavaScripts to handle data displayed on sidebar.
In “server” folder:
-configure.js includes all required settings for app
-routes.js assign each route to its corresponding function in the controllers.
In “public folder”, we have two subdirectory, “js” and “upload’:
-In “js”, there is scripts.js file to handle clicks on buttons such as Post Comment, Like and Delete.
-“upload” folder is used for saving image files and has a temp subdirectory as a temporary storage for image that currently is being added to Album.
Server.js is the main file to run the App.
This app is running on PC by using the following commands:
$mongod
$node server

The Docker image file is made by workflow and also exists on Docker hub: sheikhan/photoalbum:latest.

In order to run the project from docker image stored in Docker hub:
1) Run the following command to pull the Docker image from Docker hub: 
	$docker pull sheikhan/photoalbum:latest
2) From the project directory, start your application by running:
  	$docker-compose up
   
You can also make a Docker image for you. Before making a Docker image, please note to the following hints:
- Dockerfile is included and can be used for image creation
- please rename the dockerignorefile to .dockerignorefile
- This project uses the official mongo image from docker hub in the docker compose file: docker-compose.yml

