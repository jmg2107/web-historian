var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var request = require('request');
var Promise = require('bluebird');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};


// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  // Read the file's contents and return
  // for other helper methods to use it
  fs.readFile(exports.paths.list, 'utf8', function(err, data){
    if(err) {
      callback(err);
      throw err;
    }
    // It will return an array of all the URLS
    data = data.split('\n');
    callback(data);
  });

};

exports.readListOfUrlsAsync = new Promise(function(resolve, reject){
  // Read the file's contents and return
  // for other helper methods to use it
  fs.readFile(exports.paths.list, 'utf8', function(err, data){
    if(err) {
      reject(err);
      throw err;
    }
    // It will return an array of all the URLS
    data = data.split('\n');
    resolve(data);
  });

});

exports.isUrlInList = function(url, success) {
  // We're getting the full array of urls
  // we need to check if the target url matches
  var match;
  exports.readListOfUrls(function(urls){
    if(urls.indexOf(url) !== -1){
      match = url;
    }
    success(match);
  });

};

exports.isUrlInListAsync = function(url){

return new Promise(function(resolve, reject){
  var match;
  exports.readListOfUrls(function(urls){
    if(urls.indexOf(url) !== -1){
      match = url;
    }
    resolve(match);
  });
})

};

exports.addUrlToList = function(url, callback) {
  // We check if the url is in the list
    // If not, we'll add it

  return new Promise(function(resolve, reject){
    if(exports.isUrlInList(url, function(found){
      if(!found){
        fs.appendFile(exports.paths.list, url, "utf8", function(err){
          if(err) { throw err; }
          // TODO: What is the callback here :)
          // It's probably sending back 'loading.html' as a response
          callback();
        });
      }
    })){}
  });



};


exports.isUrlArchived = function(url, callback) {

  // Look through path.archivedSites
  // Use fs.readdir(path, cb)
  // var inArchive = false;
  var match;
  fs.readdir(exports.paths.archivedSites, function(err,sites){

    if(err) {
      callback(err);
      throw err;
    }

    if(sites.indexOf(url) !== -1){
      match = url;
    }

    callback(null, match);

  });

};

exports.isUrlArchivedAsync = Promise.promisify(exports.isUrlArchived);


exports.downloadUrls = function(urls) {

  return new Promise(function(resolve, reject){
      // grab the contents of the website at url with http request
    _.each(urls, function(url){

      request("http://" + url, function(error, response, html){
        // open the file with FS in archivedSites with the name of the url
        // write into the file with contents
        fs.writeFile(exports.paths.archivedSites + "/" + url, html, "utf8", function(){
          console.log("wrote into file " + url);
        });

      });
    });

  });


};

