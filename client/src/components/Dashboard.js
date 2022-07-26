import { React, useEffect, useState } from 'react';
import useAuth from './useAuth';
import "./Dashboard.css"
import SearchResult from './SearchResult';
import Player from './Player';
import axios from 'axios';

const SpotifyWebApi = require('spotify-web-api-node');

// connect to spotify API 

const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REACT_APP_REDIRECT_URI,
    clientId: process.env.REACT_APP_CLIENT_ID,
    clientSecret: process.env.REACT_APP_CLIENT_SECRET,
  })

export default function DashBoard({code}) {

    const accessToken = useAuth(code)

    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [currentTrack, setCurrentTrack] = useState()
    const [lyrics, setLyrics] = useState("")

    function chooseTrack(track) {
        setCurrentTrack(track)
        setSearch('')
        setLyrics('')
    }

    // set our accessToken once aquired/modified
    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

    // query spotify with current search state value
    useEffect(() => {
        if (!accessToken) return 
        if (!search) return setSearchResults([])

        // Check if we can override the previous query (doesn't really cancel the search but prevents ones from previous renders that haven't started)
        let override = false

        // query 
        spotifyApi.searchTracks(search)
        .then(res => {
            if (override) return
            // add the results to state, we only need the image, titlename, artistname and uri
            setSearchResults(res.body.tracks.items.map(track => {
                return {
                    trackName: track.name,
                    artistName: track.artists[0].name,
                    uri: track.uri,
                    albumImage: track.album.images[2].url
                }
            })
            )
        })

        return () => override = true
    }, [search, accessToken])

    useEffect(() => {
        if (!currentTrack) return 

        axios.get("http://localhost:3001/lyrics", {
            params: {
                track: currentTrack.trackName,
                artist: currentTrack.artistName
            }
        }).then(res => {
            setLyrics(res.data.lyrics);
        })

    }, [currentTrack]);

    // update our state variable when search bar input changes
    function handleChange(event) {
        const { value } = event.target
        setSearch(value)
    }

    const mappedResults = searchResults.map(track => (
        <SearchResult key={track.uri} track={track} chooseTrack={chooseTrack}/>
    ))

    return (
        <div className="dashboard">
            <form className="search-form">
                <input 
                    className="input-field"
                    type="text"
                    placeholder="Search for Tracks/Artists"
                    name="search"
                    value={search}
                    onChange={handleChange}
                    />
            </form>
            <div className="songResults">
                {mappedResults}
                {searchResults.length === 0 && (
                <div className="lyrics" style={{ whiteSpace: "pre" }}>
                    {lyrics}
                </div>
                )}
            </div>
            <div className="player">
                <Player accessToken={accessToken} trackUri={currentTrack?.uri}/>
            </div>
        </div>
    )
}