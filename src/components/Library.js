import React from "react";
import LibrarySong from "./LibrarySong";

const Library = ({
  songs,
  currentUser,
  setCurrentSong,
  isPlaying,
  audioRef,
  setSongs,
  libraryStatus,
  currentSong,
}) => {
  return (
    <div
      className={`library ${libraryStatus ? "active-library" : ""}`}
      style={{
        backgroundColor: currentSong.colors[2],
      }}
    >
      <h2>Library</h2>
      <div className="library-songs">
        {songs.map((song) => (
          <LibrarySong
            songs={songs}
            song={song}
            currentUser={currentUser}
            setCurrentSong={setCurrentSong}
            id={song.id}
            key={song.id}
            audioRef={audioRef}
            isPlaying={isPlaying}
            setSongs={setSongs}
          />
        ))}
      </div>
    </div>
  );
};

export default Library;
