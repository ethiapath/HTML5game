var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    shell = require("shelljs");
    port = process.argv[2] || 8888;

const scriptNames = [
  'setup.js',
  'helper.js',
  'classes.js',
  'levels.js',
  'gameloop.js'
];
const scrdir = 'scripts/';
let scriptPaths = scriptNames.map( s => scrdir + s);
let scriptPayload = shell.cat(scriptPaths).stdout;
// write scriptPayload to disk as script.js
fs.writeFile('script.js', scriptPayload, (err) => {
  if (err) throw err;
  console.log('scripts concatenated.');
});
console.log(typeof scriptPayload);
http.createServer(function(request, response) {
  var uri = url.parse(request.url).pathname,
    filename = path.join(process.cwd(), uri);
  console.log(uri, filename);
  
  if (uri === '/script.js') {
      
      response.writeHead(200, {"Content-Type": "text/javascript"});
      response.write(scriptPayload);
      console.log(response);
      response.end(); 
  } else {
    fs.exists(filename, function(exists) {
      if(!exists) {
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not Found\n");
        response.end();
        return;
      }

      if (fs.statSync(filename).isDirectory()) filename += '/index.html';

      fs.readFile(filename, "binary", function(err, file) {
        if(err) {        
          response.writeHead(500, {"Content-Type": "text/plain"});
          response.write(err + "\n");
          response.end();
          return;
        }

        response.writeHead(200);
        response.write(file, "binary");
        response.end();
      });
    });
  }
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");