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

// Add a new user. Successful POST request returning data of the new user and a message that the user was sucessfully added.
/* Expected JSON format in a request
{
  
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
// Get a user by username
app.get('/users/:Username', (req,res) =>{
    Users.findOne({Username : req.params.Username})
    .then((user)=>{
        res.json(user);
    }).catch((error) => {
        console.error(error);
        res.status(500).send('Error :' + error);
    });
});

//Update a user's info, by username using promise method
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username })
  .then((user)=>{
      user.Username = req.body.Username;
      user.Password = req.body.Password;
      user.Email = req.body.Email;
      user.Birthday = req.body.Birthday;
      res.json(user);
  }).catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
  });
});

// Update a user's info, by username using call back function
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
// app.put('/users/:Username', (req, res) => {
//     Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
//       {
//         Username: req.body.Username,
//         Password: req.body.Password,
//         Email: req.body.Email,
//         Birthday: req.body.Birthday
//       }
//     },
//     { new: true }, // This line makes sure that the updated document is returned
//     (err, updatedUser) => {
//       if(err) {
//         console.error(err);
//         res.status(500).send('Error: ' + err);
//       } else {
//         res.json(updatedUser);
//       }
//     });
    
  // });
 /* Add a movie to a user's list of favorites using Promise
app.post('/users/:Username/Movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username })
  .then((user)=>{
    if(!user){
      res.status(400).send(req.params.Username + "does not exist.");
    } else {
      user.updateOne(
        { $push: { FavoriteMovies : req.params.MovieID } },
        {new : true}
      )
      console.log("User's favorite movie was Updated");
      res.json(user);
      }
  }).catch((error)=>{
      console.error(error);
      res.status(500).send('Error' + error);
  }); 
});*/ 
// Add a movie to user's list of favorites using call back
app.post('/users/:Username/Movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err){
      console.error(err);
      res.status(500).send('Error : ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});
// Send static file ie. public/documentation.html Currently __dirname is movie_api/src/js
app.use(express.static(path.join(__dirname, '../public')));
// Listen for request
app.listen(8080, () => {
    console.log('Your app is listening on port 8080');
});