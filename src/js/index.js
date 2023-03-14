const express = require('express'),
    bodyParser = require('body-parser'),
   uuid    = require('uuid');      
//let path = require('path');        
const app = express();

app.use(bodyParser.json());
// List of movies including description, genre, director, image URL
let movies = [
    {   
        "title" : "Harry Potter and the Sorcerer\'s Stone",
        "description" : "An orphaned boy enrolls in a school of wizardry, where he learns the truth about himself, his family and the terrible evil that haunts the magical world",
        "genre" : { 
            "name" : "fantasy adventure",
            "description" : "Fantasy adventure are films with fantastic themes, usually involving magic, supernatural events, make-believe creatures, or exotic fantasy worlds."
            
        },
        "director" : {
            "name" : "Chris Columbus",
            "bio" : "Chris Columbus is an American filmmaker. Born in Spangler, Pennsylvania, Columbus studied film at Tisch School of the Arts",
            "bornyear" : 1958,
            "month" : 9,
            "date" : 10,
            "deathyear" : ''
        },
        "imageURL" : "/img/harry_potter_and_the_philosopher_stone.jpeg"
    },
    {   
        "title" : "Lord of the Rings:The Return of the King",
        "description" : "is a 2003 epic fantasy adventure film directed by Peter Jackson from a screenplay by Fran Walsh.",
        "genre" : {
            "name" : "fantasy adventure",
            "description" : "Fantasy adventure are films with fantastic themes, usually involving magic, supernatural events, make-believe creatures, or exotic fantasy worlds."
        },
        "director" : {
            "name" : "Peter Jackson",
            "bio" : "Peter Jackson, in full Sir Peter Robert Jackson, (born October 31, 1961, Pukerua Bay, North Island, New Zealand), New Zealand director,",
            "bornyear" : 1961,
            "month" : 10,
            "date" : 31,
            "deathyear" : ''
        },
        "imageURL" : "/img/the_Lord_of_the_rings_the_return_of_the_king.jpeg"
    },
    {  
        "title" : 'Black Hawk Down',
        "description" : "Black Hawk Down is a 2001 war film directed and produced by Ridley Scott, and co-produced by Jerry Bruckheimer, from a screenplay by Ken Nolan.",
        "genre" : {
            "name" : "action",
            "description" : "fast-paced and include a lot of action like fight scenes, chase scenes, and slow-motion shots. They can feature superheroes, martial arts, or exciting stunts. These high-octane films are more about the execution of the plot rather than the plot itself."
        },  
        "director" : {
            "name" : "Ridley Scott",
            "bio" : "Sir Ridley Scott (born 30 November 1937) is an English film director and producer. Best known for directing films in the science fiction and historical",
            "bornyear" : 1937,
            "month" : 11,
            "date" : 30,
            "deathyear" : ''
        },  
        "imageURL" : "/img/black_hawk_down.jpeg"
    },
    {   
        "title" : "Blended",
        "description" : "After a bad blind date, a man and woman find themselves stuck together at a resort for families, where their attraction grows as their respective kids.",
        "genre" : {
            "name" : "romantic comedy",
            "description" : "a subgenre of comedy and slice of life fiction, focusing on lighthearted, humorous plot lines centered on romantic ideas, such as how true love is able to surmount most obstacles."
        },
        "director" : {
            "name" : "Frank Coraci",
            "bio" : "Frank Coraci (born February 3, 1966) is an American film director and screenwriter best known for his work with actor Adam Sandler.",
            "bornyear" : 1966,
            "month" : 2,
            "date" : 3,
            "deathyear" : ''
        },
        "imageURL" : "/img/blended.jpeg"
    },
    {   
        "title" : "Arrival",
        "description" : "A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecrafts appear around the world.",
        "genre" : {
            "name" :"science fiction",
            "description" : "A genre characterized by stories involving conflicts between science and technology, human nature, and social organization in futuristic or fantastical settings, created in cinema through distinctive iconographies, images, and sounds often produced by means of special effects technology."
        },    
        "director" : {
            "name" : "Denis Villeneuve",
            "bio" : "Denis Villeneuve is a Canadian filmmaker. He is a four-time recipient of the Canadian Screen Award (formerly Genie Award) for Best Direction",
            "bornyear" : 1967,
            "month" : 10,
            "date" : 3,
            "deathyear" : ''
        },
        "imageURL" : "/img/arrival.jpeg"
    }
]
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
// Listen for request
app.listen(8080, () => {
    console.log('Your app is listening on port 8080');
});