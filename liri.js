require("dotenv").config();

var keys = require("./keys.js");
var fs = require("fs");
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');
var request = require('request');

function omdbSearch(movieTitle) {

    if (!movieTitle) {
        movieTitle = "Mr Nobody";
    } else {

        var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=trilogy";

        request(queryUrl, function (err, _res, body) {
            if (err) {
                console.log('Error occurred: ' + err);
                return;
            } else {
                let jsonData = JSON.parse(body);

                output = "\n------------------------------------------" + '\n' +
                    '\nTitle: ' + jsonData.Title + '\n' +
                    '\nYear: ' + jsonData.Year + '\n' +
                    '\nRated: ' + jsonData.Rated + '\n' +
                    '\nIMDB Rating: ' + jsonData.imdbRating + '\n' +
                    '\nRotten Tomatoes Rating: ' + jsonData.Ratings[1].Value + '\n' +
                    '\nCountry: ' + jsonData.Country + '\n' +
                    '\nLanguage: ' + jsonData.Language + '\n' +
                    '\nPlot: ' + jsonData.Plot + '\n' +
                    '\nActors: ' + jsonData.Actors + "\n\n\n";

                console.log(output);
            }
        });
    }
}

function spotifySearch(songName) {
    var spotify = new Spotify(keys.spotify);

    if (!songName) {
        songName = "The Sign";
    } else {

        spotify.search({ type: 'track', query: songName }, function (err, data) {
            if (err) {
                console.log('Error: ' + err);
                return;
            } else {
                output = "\n------------------------------------------" +
                    "\nSong Name: " + "" + songName.toUpperCase() + '\n' +
                    "\nAlbum Name: " + data.tracks.items[0].album.name + '\n' +
                    "\nArtist Name: " + data.tracks.items[0].album.artists[0].name + '\n'
                "\nURL: " + data.tracks.items[0].album.external_urls.spotify + "\n\n\n";
                console.log(output);
            };
        });
    }
}

function recentTweets() {
    var client = new Twitter(keys.twitter);
    var params = { name: 'Hooch', count: 20 };

    client.get('statuses/user_timeline', params, function (err, tweets, _response) {

        if (!err) {
            var data = [];
            for (var i = 0; i < tweets.length; i++) {
                data.push({
                    'Created: ': tweets[i].created_at,
                    'Tweet: ': tweets[i].text,
                });
            }
            console.log(data);
        }
    });
};

function tweetThis(tweetContent) {

    if (!tweetContent) {
        tweetContent = "";
    } else {

        var client = new Twitter(keys.twitter);

        client.post('statuses/update', { status: tweetContent }, function (error, tweet, _response) {
            if (error) throw error;
            console.log(tweet);
        });
    }
}


function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            console.log(error);
        } else {
            console.log(data);
            var dataArr = data.split(',')

            if (dataArr.length == 2) {
                choice(dataArr[0], dataArr[1]);
            } else if (dataArr.length == 1) {
                (dataArr[0]);
            }
        }
    });
}

function choice(caseData, functionData) {
    switch (caseData) {
        case 'spotify-this-song':
            spotifySearch(functionData);
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        case 'my-tweets':
            recentTweets();
            break;
        case 'tweet-this':
            tweetThis(functionData);
            break;
        case 'movie-this':
            omdbSearch(functionData);
            break;
        default:
            console.log('No results found');
    }
}

function appStart(arg0, arg1) {
    choice(arg0, arg1);
};

appStart(process.argv[2], process.argv.slice(3).join(" "));
