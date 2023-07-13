const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// Define schemas
let movieSchema = mongoose.Schema({
    Title : {type : String, required : true},
    Description : {type : String, required : true},
    Genre : {
        Name : String,
        Description : String
    },
    Director : {
        Name : String,
        Bio : String

    },
    
    ImagePath : String,
    Featured : Boolean

});
let userSchema = mongoose.Schema({
    
    Username : {type : String, required : true},
    Password : {type : String, required : true},
    Email : {type : String, required : true},
    Birthday : Date,
    FavoriteMovies : [{type : mongoose.Schema.Types.ObjectId, ref : 'Movie'}]

});
// Hashing password
userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};
userSchema.methods.validatePassword = function(password) {
    console.debug("password: " + password + ", this.Password: " + this.Password);
    return bcrypt.compareSync(password, this.Password);
};

// Create models with its Schema
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

// Export modules
module.exports.Movie = Movie;
module.exports.User = User;