//Define basic HTTP authentication for login requests.

const passport = require('passport'), 
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

/*LocalStrategy takes a username and password from the request body and uses Mongoose to check database for a user with the same username.    
If there’s a match, the callback function will be executed.*/
passport.use(new LocalStrategy({
    usernameField: 'Username',
    passwordField: 'Password'},
    (username, password, callback)=> {
        console.log(username + ' ' + password);
        Users.findOne({Username : username}, (error,user) =>{
            if(error){
                console.log(error);
                return callback(error);
            }
            if(!user){
                console.log('incorrect username');
                return callback(null, false, {message : 'Incorrect username or password'});
            }
            console.log('finish');
            return callback(null, user);
        });
    }));    
    //The JWT is extracted from the header of the HTTP request
    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'your_jwt_secret'
    }, (jwtPayload,callback)=>{
        return Users.findById(jwtPayload._id)
            .then((user) => {
                return callback(null,user);
            })
            .catch((error) => {
                return callback(error);
            });
    }));