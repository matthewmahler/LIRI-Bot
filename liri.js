require("dotenv").config();
var request = require("request");
var keys = require("./keys.js");
var fs = require("fs");

//============//
//Conditionals//
//============//

if (process.argv[2] === "my-tweets") {
  getMyTweets();
} else if (process.argv[2] === "spotify-this-song") {
  spotifyThis();
} else if (process.argv[2] === "movie-this") {
  searchMovie();
} else if (process.argv[2] === "do-stuff") {
  doStuff();
};

//========//
//Do Stuff//
//========//

function doStuff() {
  fs.readFile("random.txt", "utf8", function (error, data) {
    var dataArr = data.split(",");
    console.log(dataArr[0])
    if (error) {
      return console.log(error);
    }
    if (dataArr[0] === "my-tweets") {
      getMyTweets(process.argv[3] = dataArr[1]);
    } else if (dataArr[0] === "spotify-this-song") {
      spotifyThis(process.argv[3] = dataArr[1]);
    } else if (dataArr[0] === "movie-this") {
      searchMovie(process.argv[3] = dataArr[1]);
    }
  });
}

//===============//
// Movie Requests//
//===============//

function searchMovie() {
  var nodeArgs = process.argv;
  var movieName = "";
  for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
      movieName = movieName + "+" + nodeArgs[i];
    } else {
      movieName += nodeArgs[i];
    }
  }
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
  console.log(queryUrl);
  request(queryUrl, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log(JSON.parse(body));
      fs.appendFile("log.txt",
        "============================================================================================================"
        + "\n" +
        "MOVIE REQUEST: " + movieName
        + "\n" +
        body
        + "\n" +
        "============================================================================================================"
        + "\n",
        function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Logged");
          }
        });
    }
  });
};

//==============//
//Twitter Things//
//==============//

function getMyTweets() {
  var Twitter = require('twitter');
  var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });
  var name = process.argv[3]
  fs.appendFile("log.txt", "============================================================================================================" + "\n" +
    "TWEET REQUEST: " + name
    + "\n",
    function (err) {
      if (err) {
        console.log(err);
      }
    });
  console.log(name)
  var params = {
    screen_name: name
  };
  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        console.log(tweets[i].created_at)
        console.log(" ")
        console.log(tweets[i].text)
        console.log("==================================================================")
        fs.appendFile("log.txt", tweets[i].text + "\n" + "\n", function (err) {
          if (err) {
            console.log(err);
          }
        });
      }
      fs.appendFile("log.txt", "============================================================================================================" + "\n", function (err) {
        if (err) {
          console.log(err);
        }
      });
    }

  });

}




//==============//
//Spotify Things//
//==============//

function spotifyThis() {
  var Spotify = require('node-spotify-api');

  var spotify = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
  });
  var trackName = process.argv[3]
  spotify.search({
    type: 'track',
    query: trackName
  }, function (err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
      return;
    } else {
      var songInfo = data.tracks.items[0];
      console.log(" ");
      console.log(songInfo.artists[0].name);
      console.log(" ");
      console.log(songInfo.name);
      console.log(" ");
      console.log(songInfo.preview_url);
      console.log(" ");
      console.log(songInfo.album.name);
      console.log(" ");
      console.log("==================================================================");
      fs.appendFile("log.txt",
        "============================================================================================================"
        + "\n" +
        "SPOTIFY SEARCH: " + trackName
        + "\n" +
        "Artist: " + songInfo.artists[0].name
        + "\n" +
        "Song: " + songInfo.name
        + "\n" +
        "============================================================================================================"
        + "\n",
        function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Logged");
          }
        });
    };
  });

}