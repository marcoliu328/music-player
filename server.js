require('dotenv').config();
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require("cors")
const lyricsFinder = require("lyrics-finder")

const app = express();
app.use(cors());
app.use(express.json())

/* API endpoint to connect to Spotify by providing login code and receiving an accessToken */
app.post("/login", (req, res) => {
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
      redirectUri: process.env.REDIRECT_URI,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    })
  
    spotifyApi
      .authorizationCodeGrant(code)
      .then(data => {
        console.log(data.body)
        res.json({
          accessToken: data.body.access_token,
          refreshToken: data.body.refresh_token,
          expiresIn: data.body.expires_in,
        })
      })
      .catch(err => {
        console.log(err)
        res.sendStatus(400)
      })
  })

/* endpoint to refresh the accessToken */
app.post("/refresh", (req, res) => {

  console.log("test")
  const refreshToken = req.body.refreshToken
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: refreshToken,
  })

  spotifyApi
    .refreshAccessToken()
    .then(data => {
      console.log(data)
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      })
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(400)
    })


  })

app.get("/lyrics", async (req, res) => {
  const lyrics = await lyricsFinder(req.query.artist, req.query.track) || "No lyrics found"
  res.json({lyrics})
})

if (process.env.NODE_ENV === "production") {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  })
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

