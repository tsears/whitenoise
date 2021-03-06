var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");
var basePort = 12000; // each server will be started on sucessive ports
var log = require('./modules/logging');
var config = require('/etc/whitenoise/config.json');

log.write('Starting Servers...', 'init');

var i = 0;

for (var site in config.sites) {
  log.write('Starting ' + site, 'initinfo');
  var handler = getHandler(config.sites[site]);

  var port = basePort + i;

  http.createServer(handler).listen(port);

  log.write("Static file server running at http://localhost:" + port + "/", 'initinfo');
  ++i;
}

function getHandler(site) {
  return function(request, response) {
    var root = site.root;

    log.write('Request for [' + request.url + ']', 'info', request);

    var uri = url.parse(request.url).pathname;
    var filename = path.join(root, uri);

    fs.exists(filename, function(exists) {
      if(exists) {
        // file does exist
        if (fs.statSync(filename).isDirectory()) {
          filename += '/index.html';
        } 

        fs.readFile(filename, "binary", function(err, file) {
          if(err) {        
            log.write('Error: ' + err, 'error', request);
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write("500 Internal Server Error");
            return response.end();
          } else {
            var extension = path.extname(filename);
            var contentType = contentTypes[extension];
            
            log.write('Serving [' + request.url + '] as [' + contentType + ']', 'info', request);

            response.writeHead(200, { "Content-Type" : contentType });
            response.write(file, "binary");
            return response.end();
          }
        });
      } else {
        // nothing at this location
        log.write('Not Found', 'error', request);

        if (site.notfound) {
          // load custom 404 page if specified in config
          response.writeHead(404, {"Content-Type": "text/html"});
          var notFoundPage = path.join(root, site.notfound);
          console.log(notFoundPage);
          
          fs.readFile(notFoundPage, "binary", function(err, file) {
            console.log(file);
            response.write(file, "binary");
            return response.end();
          });

        } else {
          // generic 404
          response.writeHead(404, {"Content-Type": "text/plain"});
          response.write("404 Not Found\n");
          return response.end();
        }
        
      }
    });
    
  };
}

var contentTypes = {
  '.html' : 'text/html',
  '.png' : 'image/png',
  '.css' : 'text/css',
  '.js' : 'application/javascript',
  '.ico' : 'image/x-icon',
  '.woff' : 'application/x-font-woff',
  '.eot' : 'application/vnd.ms-fontobject',
  '.svg' : 'image/svg+xml',
  '.ttf' : 'application/x-font-ttf'
};