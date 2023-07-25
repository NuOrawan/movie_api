# myFlix Application
MyFlix Application is a server  side web application that store and retrieve movie and registered user data.

## Publish API
https://myflix-movie-member-only-c275ba23a94d.herokuapp.com/

## Key Features 
* The app handles interaction and responds to data requests about movies or users.
* Return a list of all movies to a user.
* Return a single movie data (title, description, genre, director and director.
* Return data about a genre (description) by name/title (e.g. “Thriller”).
* Return data about a director ( bio, birth year, death year) by name.
* Allow new users to register with password hashing feature.
* Allow users to update their user info by username.
* Allow users to add a movie to their favorites list showing only a text that a movie has been added.
* Allow users to remove a movie from their favorites list (showing only a text that a movie has been removed).
* Allow existing users to deregister showing only a text that a user email has been removed.

## Other technical features
* The app is deployed to a publicly accessible platform like GitHub Pages, Heroku and MongoDB Atlas.
* The app handles errors and input validation in order to show user-friendly error messages.
* Only registered users can “READ” data about movies, “UPDATE” their profile, or “DELETE” their profile, but any anonymous client can “CREATE” a new user.
* The app uses basic HTTP authentication via username and password and JWT for user authentication.

## Technologies 
* MongoDB
* Express(.js) Framework
* Node(.js)
* Passport (Middleware)
* JSON



