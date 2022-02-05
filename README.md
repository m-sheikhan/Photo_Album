# Photo_Album
A Web Application to store and display photos
This is a public Photo Album that each user can:
 - Upload a new photo
 - Watch previous photos
 - Like a photo
 - Write comment for a Photo
 - See statistics of views, likes and comments for each photo and overall
 
The Docker image file is made by workflow and also exist on Docker hub: sheikhan/photoalbum:latest
In order to run the project from docker image stored in Docker hub:
1) Run the following command to pull the Docker image from Docker hub: 
	$docker pull sheikhan/photoalbum:latest
2) From the project directory, start your application by running:
  	$docker-compose up
   
You can also make a Docker image for you. Before making a Docker image, please note to the following hints:
- Dockerfile is included and can be used for image creation
- please rename the dockerignorefile to .dockerignorefile
- This project uses the official mongo image from docker hub in the docker compose file: docker-compose.yml

