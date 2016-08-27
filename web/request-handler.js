var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelp = require('./http-helpers.js');
var fs = require('fs');

// require more modules/folders here!

//methods object

function readContents(res, path){
  // Return the index.html

   fs.readFile(path, 'utf-8', function(err, data){
      res.writeHead(200, httpHelp.headers);
      res.end(data);
    });
}

var methods = {
  GET: function(req, res){
    // TODO: Router

    var testUrl = req.url.slice(1);

    // Resolve based on our req.url
    // Using helper function readContents()
    if(req.url === '/'){
      readContents(res, './web/public/index.html');
    }

    // Check if the URL is already archived
    else {
      archive.isUrlArchivedAsync(testUrl)
       .then(function(exists){
          if(exists){
            // 200
            // return the content of the website from the archive
            var archivePath = archive.paths.archivedSites + "/" + testUrl;
            console.log("passed into the URL archive case");
            readContents(res, archivePath);
          } else {
            // 404 if the address is not found
            res.writeHead(404, httpHelp.headers);
            res.end("Womp womp! Nothing found!");
          }
        })
        .catch(function(err){
            // we hit Error: www.google.com with isUrlArchivedAsync
            console.log("we hit " + err + " with isUrlArchivedAsync");
        });

    } // end of if statement


  },
  POST: function(req,res){
    var all = "";
    req.on('data', function(chunk){
      all += chunk;

    })


    req.on('end', function(){
      all = all.slice(4) + "\n";
      archive.addUrlToList(all, function(){
        console.log("All is " + all);
        // TODO: Send loading.html
        console.log("We're loading the page now.");
        res.writeHead(302, httpHelp.headers);
        res.end("Goodbye!");
      });
    });


  },
  OPTIONS: function(){

  },
  ERROR: function(){

  }
};

//GET

//POST

//OPTIONS

exports.handleRequest = function (req, res) {
  methods[req.method](req, res);
  // res.end(archive.paths.list);
};
