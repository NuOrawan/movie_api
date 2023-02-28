// Import http module and listens for request on port 8080
const http = require('http');
http.createServer((request, response)=> {
    // Create header with response
    response.writeHead(200, {'Content-type' :'text/plain'});
    response.end('Hello \n');  
}).listen(8080);
console.log('Server is running successfully.');
