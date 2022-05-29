import React, { useState, useRef } from "react";

import "./styles/app.scss";

import Player from "./components/Player";
import Song from "./components/Song";
import Library from "./components/Library";
import Nav from "./components/Nav";

import data from "./util";

import 'bootstrap/dist/css/bootstrap.min.css';

require('dotenv').config();


function App() {
  const audioRef = useRef(null);
  const [songs, setSongs] = useState(data());
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
  });
  const [libraryStatus, setLibraryStatus] = useState(false);

  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime;
    const duration = e.target.duration;
    const roundedCurrent = Math.round(current);
    const roundedDuration = Math.round(duration);
    const animationPercentage2 = Math.round(
      (100 * roundedCurrent) / roundedDuration
    );
    setSongInfo({
      ...songInfo,
      currentTime: current,
      duration: duration,
      animationPercentage: animationPercentage2,
    });
  };

  const songEndHandler = async () => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
    if (isPlaying) {
      audioRef.current.play();
    }
  };

  return (
    <div
      className="biggest"
      style={{
        backgroundColor: currentSong.color[0],
        transition: "all 0.5s ease",
      }}
    >
      <div
        className={`App ${libraryStatus ? "library-active" : ""}`}
        style={{
          backgroundColor: currentSong.color[0],
        }}
      >
        <Nav
          libraryStatus={libraryStatus}
          setLibraryStatus={setLibraryStatus}
        />
        <Song currentSong={currentSong} />
        <Player
          audioRef={audioRef}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          currentSong={currentSong}
          setSongInfo={setSongInfo}
          songInfo={songInfo}
          songs={songs}
          setCurrentSong={setCurrentSong}
          setSongs={setSongs}
        />
        <Library
          audioRef={audioRef}
          isPlaying={isPlaying}
          songs={songs}
          setCurrentSong={setCurrentSong}
          setSongs={setSongs}
          libraryStatus={libraryStatus}
          currentSong={currentSong}
        />
        <audio
          onTimeUpdate={timeUpdateHandler}
          onLoadedMetadata={timeUpdateHandler}
          ref={audioRef}
          src={currentSong.audio}
          onEnded={songEndHandler}
        ></audio>
      </div>
      <div
        className="filler"
        style={{
          backgroundColor: currentSong.color[0],
        }}
      ></div>
    </div>
  );
}

export default App;
