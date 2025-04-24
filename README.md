# users-app-backend
This is a Node.js backend application project, built with a variety of dependencies for handling server-side functionality.

This app provides a CRUD API for authenticated users. It utilizes dependencies such as: express, bcrypt, JWT, winston, google-auth-library, cors, mongoose, swagger and jest for testing. 

For the deployment of the app you will need to set up a MongoDB Atlas, create a .env file and provide the connection string via MONGODB_URI variable. A TOKEN_SECRET variable is also needed in the .env file for the JWT (JSON Web Token). If you want to check the Google Authentication OAuth 2.0 you will need to set up three more variables in the .env file GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and REDIRECT_URI.

