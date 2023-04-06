// Integrate mongoose with API
const mongoose = require('mongoose');
const Models = require('./models.js');
// Define model names
const Movies = Models.Movie;
const Users = Models.User;
// Connect to database
mongoose.connect('mongodb://localhost:27017/cfDB', {useNewUrlParser: true, useUnifiedTopology: true});

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
                }).then((user) => {res.status(201).json(user)}) //New document named user
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


// Send static file ie. public/documentation.html Currently __dirname is movie_api/src/js
app.use(express.static(path.join(__dirname, '../public')));
// Listen for request
app.listen(8080, () => {
    console.log('Your app is listening on port 8080');
});