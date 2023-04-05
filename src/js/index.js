// Integrate mongoose with API
const mongoose = require('mongoose');
const Models = require('./models.js');
// Define model names
const Movies = Models.Movie;
const Users = Models.User;
// Connect to database
mongoose.connect('mongodb://localhost:27017/myFlixDB', {useNewUrlParser: true, useUnifiedTopology: true});

const express = require('express'),
    bodyParser = require('body-parser'),
   uuid    = require('uuid');      
let path = require('path');        
const app = express();

app.use(bodyParser.json());

// Return welcome message
app.get('/', (req, res) =>{
    res.send('Welcome to myFlix');
});
// Return a list of ALL movies to the user
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});
//Return data of a single movie ie. description, genre, director and image URL. 
app.get('/movies/:title', (req,res)=>{
    const { title } = req.params;
    const movie = movies.find( movie => movie.title === title);
    
    if(movie){
        res.status(200).json(movie);
    } else {
        res.status(400).send('No such movie.')

    }
});
// Return data about a movie's genre ie. name and description by genre name.
app.get('/movies/genre/:genreName', (req,res)=>{
    const { genreName } = req.params;
    const genre = movies.find( movie => movie.genre.name === genreName).genre; //Only display genre name
    
    if(genre){
        return res.status(200).json(genre);
    } else {
        res.status(400).send('No such genre.')

    }
});
//Return data about a director (bio, date of birth and death year) by name.
app.get('/movies/directors/:directorName', (req,res)=>{
    const { directorName } = req.params;
    const director = movies.find( movie => movie.director.name === directorName).director; //Only display genre name
    
    if(director){
        return res.status(200).json(director);
    } else {
        res.status(400).send('No such director.')

    }
});
// Add a new user. Successful POST request returning data of the new user and a message that the user was sucessfully added.
/* Expected JSON format in a request
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users',(req,res) =>{
    Users.findOne({Username : req.body.Username})
    .then((user) => {
        // If user already exists.
        if(user){
            return res.status(400).send(req.body.Username + 'already exists.');
        } else {
            Users
                .create({
                    Username : req.body.Username,
                    Password : req.body.Password,
                    Email : req.body.Email,
                    Birthday : req.body.Birthday
                }).then((user) => {res.status(201).json(user)})
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error : ' + error);
                })
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error : ' + error );
    });
    
});

// Update their user info (username).
app.put('/users/:userName', (req, res) => {
    res.send('Successful PUT request returning a message indicating the username was sucessfully updated.');
    
});

// Add a movie to user's list of favorites showing only a response with text that a movie has been added.
app.post('/users/:id/:movieTitle', (req, res) => {
    res.send('MovieTitle has been added to this user\'s id.');
});

// Remove a movie from their list of favorites showing only a text that a movie has been removed.
app.delete('/users/:id/:movieTitle', (req, res) => {
    res.send('MovieTitle has been removed from this user\'s id.');
});

// Deregister a user showing only a text that a user email has been removed.
app.delete('users/:id', (req, res) =>{
    res.send('User\'s email has been removed from this user\'s id.');
});
// Send static file ie. public/documentation.html Currently __dirname is movie_api/src/js
app.use(express.static(path.join(__dirname, '../public')));
// Listen for request
app.listen(8080, () => {
    console.log('Your app is listening on port 8080');
});