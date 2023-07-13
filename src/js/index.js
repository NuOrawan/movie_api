// Integrate mongoose with API
const mongoose = require('mongoose');
const Models = require('./models.js');

// Define model names
const Movies = Models.Movie;
const Genres = Models.Genre;
const Directors = Models.Director;
const Users = Models.User;

const express = require('express'),
    bodyParser = require('body-parser'),
   uuid    = require('uuid');      
let path = require('path');        
const app = express();
const { check , validationResult} = require('express-validator');



// Connect to database
//mongoose.connect('mongodb://localhost:27017/myFlixDB', {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connect( process.env.CONNECTION_URI, {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyParser.json());
// CORS
const cors = require('cors');
// Creates a list of allowed domains 
let allowedOrigins = ['http://localhost:8080','http://testsite.com'];
app.use(cors({
    origin: (origin, callback) =>{
      if(!origin) return callback(null, true);
      if(allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
          let message = 'The CORS policy for this application doesn’t allow access from origin' + origin;
          return callback(new Error(message), false);
      }
    return callback(null, true);  
    }
}));


//Import auth.js file into project. Must place it AFTER bodyParser middleware
let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

// Return welcome message
app.get('/', (req, res) =>{
    res.send('Welcome to myFlix');
});
// Get all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});


// Get description, genre, director, image URL of a single movie by title.
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req,res) => {
  Movies.findOne({Title : req.params.Title})
  .then((movie) => {
    if(!movie){
      res.status(400).send('Sorry ' + req.params.Title + ' does not exist.');
    } else {
      res.status(201).json(movie);
    }
  })
  .catch((error) =>{
    console.error(error);
    res.status(500).send('Error' + error);
  });
});

// Return data about a genre (description) by name (e.g., “Thriller”)
app.get('/genres/:Name', passport.authenticate('jwt', { session: false }), (req,res) => {
  Movies.findOne({ 'Genre.Name' : req.params.Name})
  .then((movie) =>{
    if(!movie){
      res.status(400).send('Sorry ' + req.params.Name + ' does not exist.');
    } else {
      res.status(200).json(movie.Genre.Description);
    }
  })
  .catch((error) =>{
    console.error(error);
    res.status(500).send('Error' + error);
  });
});

//Return data about a director (bio, birth year, death year) by name
app.get('/directors/:Name', passport.authenticate('jwt', { session: false }), (req,res) => {
    Movies.findOne({ 'Director.Name' : req.params.Name})
    .then((movie) => {
      if(!movie){
        res.status(400).send('Sorry ' + req.params.Name + ' does not exist.' )
      } else{
        res.status(200).json(movie.Director);
      }
    }).catch((error) => {
        console.error(error);
        res.status(500).send('Error' + error);
    });
});

// Allow new users to register. Successful POST request returning data of the new user and a message that the user was sucessfully added.
/* Expected JSON format in a request
{
  
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', 
  [
    check('Username', 'Username is required.').isLength(),
    check('Username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required.').not().isEmpty(),
    check('Email', 'Email does not appear to be valid.').isEmail()

  ] , (req,res) =>{
  // Check the validation object for errors  
  let errors = validationResult(req);
  if (!errors.isEmpty()){
    return res.status(422).json({errors : errors.array()}); // Sent errors to the user in JSON object as an HTTP response
  }
  // Hash password before storing it.
  let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({Username : req.body.Username})
    .then((user) => {
        // If user already exists.
        if(user){
            return res.status(400).send(req.body.Username + 'already exists.');
        } else {
            Users
                .create({
                    Username : req.body.Username,
                    Password : hashedPassword,
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
// Get a user info by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req,res) =>{
    Users.findOne({Username : req.params.Username})
    .then((user)=>{
        res.status(201).json(user);
    }).catch((error) => {
        console.error(error);
        res.status(500).send('Error :' + error);
    });
});

// Update a user's info (username, password, email, date of birth), by username 
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
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, 
    { $set:
      {
         Username: req.body.Username,
         Password: req.body.Password,
         Email: req.body.Email,
         Birthday: req.body.Birthday
       }
    },
    { new: true }) // This line makes sure that the updated document is returned
  .then((updatedUser) => {
       if(!updatedUser) {
          res.status(404).send('User is not found.');         
         
        } else {
         res.json(updatedUser);
        }
        })
  .catch((error) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });         
});  
 
// Add a movie to user's list of favorite movies
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $addToSet: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }) // This line makes sure that the updated document is returned
  .then((updatedUser) => {
      if(!updatedUser){
        return res.status(404).send('User is not found.');
      } else {
        res.send(req.params.MovieID + ' is successfully added to your favorite list.');
      }
  })
  .catch((error) => {
      console.error(error);
      res.status(500).send('Error' + error);
  }); 
});
// Remove a movie to user's list of favorite movies
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  try {
    // OPTION 1 
    // This works in mongosh
    // would need to figure out how to get nModified count here by making this async
    const user = Users.findOne({Username: req.params.Username});
    if (!user) {
      return res.status(404).send('User is not found');  
    }
    Users.updateOne(
      {Username: req.params.Username}, 
      {$pull: {FavoriteMovies: {_id: req.params.MovieID}}}
    );
      
    // OPTION 2
    // const user = Users.findOne({Username: req.params.Username});
    // if (!user) {
    //   return res.status(404).send('User is not found');  
    // }
    // const movie = user.FavoriteMovies.findOne({_id: ObjectId(req.params.MovieID)});
    // if (!movie) {d
    //   return res.status(404).send('Movie is not found');  
    // } 
    // @todo delete movie and log here

  } catch(error) {
    console.error(error);
    res.status(500).send('Error' + error);
  }

//   Users.findOneAndUpdate({Username: req.params.Username, FavoriteMovies: req.params.MovieID},
//     {
//       $pull: { FavoriteMovies : req.params.MovieID }
    
//   },
//  {new : true} )
//   .then((updatedUser)=>{
//       if(!updatedUser){
//         return res.status(404).send('User is not found');  
//       } else {
//         res.send(req.params.MovieID + ' is successfully removed from your favorite list.');

//       }
//   })
//   .catch((error) =>{
//       console.error(error);
//       res.status(500).send('Error' + error);
//   });
});

// Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) =>{
  Users.findOneAndRemove({Username: req.params.Username})
  .then((user) => {
      if(!user){
        return res.status(404).send('User is not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
  })
  .catch((error) => {
      console.error(error);
      res.status(500).send('Error' + error);
  });
});

// Send static file ie. public/documentation.html Currently __dirname is movie_api/src/js
app.use(express.static(path.join(__dirname, '../public')));
/* Listen for request
app.listen(8080, () => {
    console.log('Your app is listening on port 8080');
});*/
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on port ' + port);
});