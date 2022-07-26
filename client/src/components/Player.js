import React, { useEffect, useState } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';

export default function Player({ accessToken, trackUri }) {

    const [play, setPlay] = useState(false);

    useEffect(() => setPlay(true), [trackUri])

    if (!accessToken) return null;

    return (
        <SpotifyPlayer 
            styles={{
                bgColor: "#141414",
                sliderHandleColor: "#1DB954",
                color: "white",
                trackNameColor: "white",
                sliderTrackColor: "#383838",
                sliderColor: "white"
            }}
            token={accessToken}
            showsaveIcon
            uris={trackUri ? [trackUri] : []}
            play={play}
            callback = {state => {
                if (!state.isPlaying) setPlay(false)
            }}
        />
    )
}