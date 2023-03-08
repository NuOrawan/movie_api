const express = require('express'),
        morgan = require('morgan');
let path = require('path');        
const app = express();
// Log requests ie. IP address, time, method, path and status code sent back as a response.
app.use(morgan('common'));
// List of top 10 movies
let top10Movies = [
    {   title : 'Harry Potter and the Sorcerer\'s Stone',
        type : 'Fantasy'
    },
    {   title : 'Lord of the Rings',
        type : 'Fantasy'
    },
    {   title : 'Black Hawk Down',
        type : 'Action'
    },
    {   title : 'Blended',
        type : 'Comedy'
    },
    {   title : 'Jumanji The Next Level',
        type : 'Fantasy'
    },
    {   title : 'Arrival',
        type : 'Science Fiction'
    },
    {   title : 'A Man Called Otto',
        type : 'Drama'
    },
    {   title : 'Open Water',
        type : 'Horror'
    },
    {   title : 'Us',
        type : 'Horror'
    },
    {   title : 'La La Land',
        type : 'Romance'
    }
]
// Get Request
app.get('/', (req, res) =>{
    console.log('dirname: ' + __dirname);

    res.send('Welcome to myFlix');
});
app.get('/movies', (req, res) => {
    res.json(top10Movies);
});
//Send static file ie. documentation.html 

app.use(express.static(path.join(__dirname, '../public')));
//app.get('/documentation.html', (req, res)=>{
//    res.sendFile('../public/documentation.html' , {root: __dirname});
//});
//Handle error and print error on console
app.use((err, req, res, next)=>{
    console.error(err.stack);
    res.status(500).send('Something broke!')
});
// Listen for request
app.listen(8080, () => {
    console.log('Your app is listening on port 8080');
});