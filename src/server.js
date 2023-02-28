
const url = require('url'),
    http = require('http'),
    fs = require('fs');
/* Listens for request on port 8080.
Determine if the URL contains the word “documentation”. 
If it does, return the “documentation.html” file to the user; otherwise return the “index.html” file.*/
http.createServer((request, response)=> {
    let addr = request.url,
    q = url.parse(addr,true);
    filePath = '';
    // Add to log file
    fs.appendFile('log.txt', 'URL' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) =>{
        if (err){
            console.log(err);
        } else {
            console.log('Add to log.')
        }
    });
    if (q.pathname.includes('documentation')){
        filePath = (__dirname + '/documentation.html');
    } else {
        filePath = 'index.html';
    }
    fs.readFile(filePath, (err, data) =>{
        if(err){
            throw err;
        }
        // Create header with response
        response.writeHead(200, {'Content-type' :'text/plain'});
        response.write(data);
        response.end();  
    });
    
}).listen(8080);
console.log('Test Server is running successfully on port 8080.');
