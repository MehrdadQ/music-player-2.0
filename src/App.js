import React, { useState, useRef, useEffect } from "react";

import "./styles/app.scss";

import Player from "./components/Player";
import Song from "./components/Song";
import Library from "./components/Library";
import Nav from "./components/Nav";
import { db } from "./utils/firebase.js";
import { ref, onValue } from "firebase/database"
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { default_songs } from './util.js'
import { Modal, Button } from "react-bootstrap";

require('dotenv').config();

const NewUserModal = ({ show, onHide }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <h4>Welcome to the Music player app!</h4>
      </Modal.Header>
      <Modal.Body>
        Hey there! You can just play around with the player and listen to some pre-existing songs, or
        you can sign up and start creating your own playlists!
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={onHide}>Got it!
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

function App() {
  const audioRef = useRef(null);
  const [showNewUserModal, setShowNewUserModal] = useState(localStorage.getItem("first_visit") !== "false")
  const [songs, setSongs] = useState([]);
  const [songNum, setSongNum] = useState(0)
  const [currentSong, setCurrentSong] = useState({
    title: "Please Wait",
    artist: "",
    cover: "https://i1.sndcdn.com/artworks-000175930618-pg6ffe-t500x500.jpg",
    colors: ["white", "white", "white"],
    audio: "",
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
  });
  const [libraryStatus, setLibraryStatus] = useState(false);
  const [currentUser, setCurrentUser] = useState(null)

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

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user)
        onValue(ref(db, `${user.uid}/songs`), snapshot => {
          setSongs([])
          const data = snapshot.val()
          if (data !== null) {
            setSongNum(Object.values(data).length)
            Object.values(data).forEach(song => {
              setSongs(old => [...old, song])
            })
          }
        })
      } else {
        setSongNum(default_songs.length)
        setSongs(default_songs)
      }
    });
  }, [currentUser])
  
  useEffect(() => {
    const setInitialSong = async (e) => {
      await setCurrentSong(e)
    }
    if (songs.length === songNum && songNum !== 0) {
      setInitialSong(songs[0])
    }
  }, [songs.length])

  return (
    <div
      className="biggest"
      style={{
        backgroundColor: currentSong.colors[0],
        transition: "all 0.5s ease",
      }}
    >
      <div
        className={`App ${libraryStatus ? "library-active" : ""}`}
        style={{
          backgroundColor: currentSong.colors[0],
        }}
      >
        <Nav
          libraryStatus={libraryStatus}
          setLibraryStatus={setLibraryStatus}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
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
          backgroundColor: currentSong.colors[0],
        }}
      ></div>
      <NewUserModal
        show={showNewUserModal}
        onHide={() => {setShowNewUserModal(false); localStorage.setItem("first_visit", "false")}}
      />
    </div>
  );
}

export default App;
