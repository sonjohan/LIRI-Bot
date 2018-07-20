require("dotenv").config();

var keys = require("./keys.js");

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var selection = process.argv[2];
// var searchQuery = process.argv[3];

var liriBot = {
    commands: ['my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says'],

    callTwitter: function () {
        console.log('\nYour tweets:\n')
        var params = { screen_name: 'Johan Bermeo' };
        client.get('statuses/user_timeline', params, function (error, tweets, response) {
            if (!error) {
                for (i = 0; i < 20; i++) {
                    console.log((i + 1) + '. ' + tweets[i].text);
                };
            };
        });
    },

    callSpotify: function(argv3){
        if (argv3 === undefined) {
            argv3 = 'The Sign, Ace of Base';
        };
        spotify.search({ type: 'track', query: argv3 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            };
            console.log('Artist: ' + data.tracks.items[0].artists[0].name + '\n' +
                'Song: ' + data.tracks.items[0].name + '\n' +
                'Preview: ' + data.tracks.items[0].external_urls.spotify + '\n' +
                'Album: ' + data.tracks.items[0].album.name);
        });
    },

    callImdb: function(argv3){
        request("http://www.omdbapi.com/?t=" + argv3 + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

            if (!error && response.statusCode === 200) {
                console.log("\nTitle: " + JSON.parse(body).Title +
                    "\nYear: " + JSON.parse(body).Year +
                    "\nIMDB rating: " + JSON.parse(body).imdbRating +
                    "\nRotten Tomatoes rating: " + JSON.parse(body).Ratings[1].Value +
                    "\nProduced in: " + JSON.parse(body).Country +
                    "\nLanguage: " + JSON.parse(body).Language +
                    "\nPlot: " + JSON.parse(body).Plot +
                    "\nActors: " + JSON.parse(body).Actors);
            };
        });
    },

    readFromFile: function(){
        fs.readFile("random.txt", "utf8", function (error, data) {
            if (error) {
                return console.log(error);
            }
            var dataArr = data.split(",");
            console.log('\nReading from text file \n\nexecuting "' + dataArr[0] + '" command with the following parameter: ' + dataArr[1]+'\n');
            liriBot.callSpotify(dataArr[1]);
        });
    }
};

switch (selection) {
    case 'my-tweets':
        liriBot.callTwitter();
        break;
    case 'spotify-this-song':
        liriBot.callSpotify(process.argv[3]);
        break;
    case 'movie-this':
        liriBot.callImdb(process.argv[3]);
        break;
    case 'do-what-it-says':
        liriBot.readFromFile();
        break;
    default:
        console.log("\nI didn't understand your command\nHere is a list of valid commands:\n");
        for (i=0; i < liriBot.commands.length; i++){
            console.log((i+1) + '. '+liriBot.commands[i]);
        };
};