import React, { useState, useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import axios from "axios";
import useAudioPlayer from "../hooks/useAudioPlayer";
import Footer from "../components/layout/Footer";
import SideMenu from "../components/layout/SideMenu";
import MainArea from "../components/layout/MainArea";
import Modal from "../components/common/Modal";
import EditProfile from "../components/auth/EditProfile";
import "../css/pages/HomePage.css";
import { setUser,updateFavourites } from "../redux/slices/authSlice";

const Homepage = () => {
  const [view, setView] = useState("home");
const [songs, setSongs] = useState([]);
const [searchSongs, setSearchSongs] = useState([]);
const [openEditProfile, setOpenEditProfile] = useState(false);
const auth = useSelector((state) => state.auth);

const songsToDisplay = view === "search" ? searchSongs : songs;
const {
    audioRef,
    currentIndex,
    currentSong,
    isPlaying,
    currentTime,
    duration,
    isMuted,
    loopEnabled,
    shuffleEnabled,
    playbackSpeed,
    volume,
    isLoading,
    playSongAtIndex,
    handleTogglePlay,
    handleNext,
    handlePrev,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
    handleToggleMute,
    handleToggleLoop,
    handleToggleShuffle,
    handleChangeSpeed,
    handleSeek,
    handleChangeVolume,
} = useAudioPlayer(songsToDisplay);

const playerState = {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    isMuted,
    loopEnabled,
    shuffleEnabled,
    playbackSpeed,
    volume,
    isLoading,
};

const playerControls = {
    playSongAtIndex,
    handleTogglePlay,
    handleNext,
    handlePrev,
    handleSeek,
    
};
const playerFeatures = {
    onToggleMute: handleToggleMute,
    onToggleLoop: handleToggleLoop,
    onToggleShuffle: handleToggleShuffle,
    onChangeSpeed: handleChangeSpeed,
    onChangeVolume: handleChangeVolume,
};

useEffect(() => {
  const fetchInitialSongs = async () => {
   
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/songs`
      );
      setSongs(res.data.results || []);
    } catch (error) {
      console.error("Error while fetching the songs", error);
      setSongs([]);
    }
  };

  fetchInitialSongs();
}, []);

const loadPlaylist = async (tag) => {
  if (!tag) {
    console.warn("No tag is provided");
    return;
  }

  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/songs/playlistByTag/${tag}`
    );

    setSongs(res.data.results || []);
  } catch (error) {
    console.error("Failed to load playlist", error);
    setSongs([]);
  }
};


// When user clicks on a song in a table
const handleSelectSong = (index) => {
    playSongAtIndex(index);
};

const handlePlayFavourite = (song) => {
    const favourites = auth.user?.favourites || [];
    if (!favourites.length) return;

    const index = auth.user.favourites.findIndex((fav) => fav.
    id === song.id);
    setSongs(auth.user.favourites);
    setView("home");

    setTimeout(() => {
        if (index !== -1) {
            playSongAtIndex(index);
        }
    }, 0);
};
const dispatch = useDispatch();



const handleToggleFavourite = async (song) => {
  try {
    // 1. Use the token directly from your Redux state
    const token = auth.token; 

    if (!token) {
      alert("Please login to add favourites!");
      return;
    }

    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/songs/favourite`,
      { song },
      {
        headers: {
          // 2. Ensure the Bearer token is sent exactly like this
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    // 3. Use your specific updateFavourites reducer to update the list
    dispatch(updateFavourites(res.data));
    
    console.log("Favourite list updated!");
  } catch (error) {
    // 4. Detailed error logging to see WHY the 401 is happening
    console.error("Auth Error Detail:", error.response?.data);
    if (error.response?.status === 401) {
       alert("Session expired. Please log in again.");
    }
  }
};
  return (
    <div className="homepage-root">
      {currentSong && (
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        src={currentSong?.audio}
      />
    )}
   
      <div className="homepage-main-wrapper">
        {/* Sidebar */}
        <div className="homepage-sidebar">
          <SideMenu setView={setView}
           view={view} 
           onOpenEditProfile={() => setOpenEditProfile(true)} />
        </div>
        {/* Main Content */}
        <div className="homepage-content">
          <MainArea view={view} currentIndex={currentIndex}
          onSelectSong={handleSelectSong}
          onSelectFavourite={handlePlayFavourite}
          onSelectTag={loadPlaylist}
          songsToDisplay={songsToDisplay}
          setSearchSongs={setSearchSongs}/>
        </div>
      </div>
      {/* Footer Player */}
      <Footer playerState={playerState}
playerControls={playerControls}
playerFeatures={playerFeatures} />

{openEditProfile && (
  <Modal onClose={() => setOpenEditProfile(false)}>
    <EditProfile onClose={() => setOpenEditProfile(false)} />
  </Modal>
)}

    </div>
  );
};

export default Homepage;
