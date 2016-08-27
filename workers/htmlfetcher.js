// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

var CronJob = require('cron').CronJob;
var archive = require('../helpers/archive-helpers');
var _ = require('underscore');

// Check if the url is archived, if so, don't download anything
new CronJob('1 * * * * *', function() {


  //  Check the list of urls (array)
  //  Check whether any of the items is already in the archive
    // If yes, just display a "No Thank you" notice
    // If no, download the URL




  // console.log('You will see this message every minute');
  // // archive.downloadUrls(archive.readListOfUrls);
  archive.readListOfUrls(function(urlsArray){

    var results = [];
    _.each(urlsArray, function(url){
      archive.isUrlArchived(url, function(match){
        if(!match){
          results.push(url);
          archive.downloadUrls(results);
          results.pop();
        } else {
          console.log("We already have a copy, thank you!");
        }
      });
    });



  });


  }, null, true, 'America/Los_Angeles');


