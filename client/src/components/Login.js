import React from 'react';
import "./Login.css"

const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=5a60cc1de5f246a0a58ec3c5a4dc74ae&response_type=code&redirect_uri=https://music-player-app-ml.herokuapp.com/&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"

export default function Login() {
    return (
        <div className="login-page">
            <h1 className="login-title"> Music Player</h1>
            <a className="login-button" href={AUTH_URL}>
                Login with Spotify
            </a>
        </div>
    )
}