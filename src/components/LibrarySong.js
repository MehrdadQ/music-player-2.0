import React from "react";
import { playAudio } from "../Promise";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { db } from "../utils/firebase.js";
import { ref, remove } from "firebase/database"

const LibrarySong = ({
  song,
  songs,
  currentUser,
  setCurrentSong,
  id,
  audioRef,
  isPlaying,
  setSongs,
}) => {
  const songSelectHandler = () => {
    setCurrentSong(song);

    const newSongs = songs.map((song) => {
      if (song.id === id) {
        return { ...song, active: true };
      } else {
        return { ...song, active: false };
      }
    });

    setSongs(newSongs);
    playAudio(isPlaying, audioRef);
  };

  const handleDeleteSong = () => {
    console.log(`deleting song ${song.id}`)
    remove(ref(db, `${currentUser.uid}/songs/${song.id}`))
  }

  return (
    <div
      className={`library-song ${song.active ? "selected" : ""}`}
      onClick={songSelectHandler}
    >
      <img src={song.cover} alt="song cover"></img>
      <div className="song-description">
        <h3>{song.title}</h3>
        <h4>{song.artist}</h4>
      </div>
      {currentUser === null ? <></> :
      <div className="song-delete-button" onClick={(e) => {e.stopPropagation(); handleDeleteSong()}}>
        <FontAwesomeIcon icon={faTrash} />
      </div>
      }
    </div>
  );
};

export default LibrarySong;
