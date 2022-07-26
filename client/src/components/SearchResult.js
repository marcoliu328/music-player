import React from "react"
import "./Dashboard.css"

export default function TrackSearchResult({ track, chooseTrack }) {
  function handlePlay() {
    chooseTrack(track)
  }

  console.log(track)

  return (
    <div
      className="search-result"
      style={{ cursor: "pointer" }}
      onClick={handlePlay}
    >
      <img src={track.albumImage} style={{ height: "64px", width: "64px" }} />
      <div className="ml-3" style={{ marginLeft: "10px"}}>
        <div className='track-title'>{track.trackName}</div>
        <div className="text-muted">{track.artistName}</div>
      </div>
    </div>
  )
}