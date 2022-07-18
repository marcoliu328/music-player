const express = require('express');
const spotifyWebApi = require('spotify-web-api-node');
const app = express();

app.post('/login', (req, res) => {
    const spotifyApi = new spotifyWebApi(
        {
            redirectUri: "http://localhost:3000",
            clientId: '5a60cc1de5f246a0a58ec3c5a4dc74ae',
            clientSecret: '662b569a086d4f67a9d147ea8c23df0c'
        }
    )

    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in,
        })
    })
    .catch(() => {
        res.sendStatus(400).send("Authorization Error")
    })
})

