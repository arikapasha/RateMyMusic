var express = require('express');
var app = express();
const port = 8000; 
app.listen (port, () => {
    console.log (`Server is running on http://localhost:${port}`);
});

var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi({
  clientId : "8e294139ce2a4a5dbd3cd4c57a2e87c4",
  clientSecret : "5659e76099be4fd1b3eb4fa39ea485ea",
});

spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);


    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err.message);
  });


app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/search", function (request, response) {
  let query = request.query.query;
  
  console.log(request)
  
  if(request.query.context) {
    if(request.query.context == 'artist') {
      query = 'artist:' + request.query.query;
    }
    if(request.query.context == 'track') {
      query = 'track:' + request.query.query;
    }
  }
  spotifyApi.searchTracks(query)
  .then(function(data) {
    console.log(data.body);
    response.send(data.body);
  }, function(err) {
    console.log(err)
  });
});


