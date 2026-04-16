import { useReducer, useState, useRef, useEffect } from "react";

const initialAudioState = {
  isPlaying: false,
  isLoading: false,
  isMuted: false,
  volume: 50,
  loopEnabled: false,
  shuffleEnabled: false,
  playbackSpeed: 1,
  currentIndex: null,
  currentSong: null,
  currentTime: 0,
};

// Reducer

function audioReducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return { ...state, isLoading: true };

    case "PLAY":
      return { ...state, isPlaying: true, isLoading:false};

      case "PAUSE":
  return { ...state, isPlaying: false };

case "MUTE":
  return { ...state, isMuted: true };

case "UNMUTE":
  return { ...state, isMuted: false };

case "SET_VOLUME":
  return { ...state, volume: action.payload };

case "TOGGLE_LOOP":
  return {
    ...state,
    loopEnabled: !state.loopEnabled,
    shuffleEnabled: false,
  };

case "TOGGLE_SHUFFLE":
  return {
    ...state,
    shuffleEnabled: !state.loopEnabled,
    loopEnabled: false,
  };

case "SET_PLAYBACK_SPEED":
  return { ...state, playbackSpeed: action.payload };

case "SET_CURRENT_TRACK":
  return {
    ...state,
    currentIndex: action.payload.index,
    currentSong: action.payload.song,
    isLoading: true,
  };

case "SET_CURRENT_TIME":
  return { ...state, currentTime: action.payload };

default:
  return state;
}
}
const useAudioPlayer = (songs) => {
  const [audioState, dispatch] = useReducer(audioReducer, initialAudioState);

  const [duration, setDuration] = useState(0);
  const previousVolumeRef = useRef(50);
  const audioRef = useRef(null);

  // Play a song at a specific index value
  const playSongAtIndex = async (index) => {
    if (!songs || songs.length === 0) {
      console.warn("No song available to play");
      return;
    }

    if (index < 0 || index >= songs.length) return;

    const song = songs[index];
    dispatch({
      type: "SET_CURRENT_TRACK",
      payload: {
        index,
        song,
      },
      
    });

dispatch({ type: "SET_CURRENT_TIME", payload: 0 });

  };

  useEffect(() => {
    if (!audioState.currentSong) return;

    const audio = audioRef.current;
    if (!audio) return;

    dispatch({ type: "LOADING" });
    audio.src = audioState.currentSong.audio || "";
    audio.load();
    audio.playbackRate = audioState.playbackSpeed;
    audio.volume = Math.max(0, Math.min(1, audioState.volume / 100));
    audio.muted = audioState.isMuted;

    audio
      .play()
      .then(() => dispatch({ type: "PLAY" }))
      .catch((error) => {
        if (error?.name === "AbortError") return;
        console.error("Play Error", error);
      });
  }, [audioState.currentSong, audioState.playbackSpeed, audioState.volume, audioState.isMuted]);
  
const handleTogglePlay = async () => {
  const audio = audioRef.current;
  if (!audio) return;

  if (audio.paused) {
    try {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise; // Wait for the play request to succeed
        dispatch({ type: "PLAY" });
      }
    } catch (error) {
      console.error("Playback was interrupted:", error);
    }
  } else {
    audio.pause();
    dispatch({ type: "PAUSE" });
  }
};
// Next Song
const handleNext = () => {
  if (!songs.length) return;

  if (audioState.currentIndex === null) {
    playSongAtIndex(0);
    return;
  }

  // If Shuffle is Enabled
  if (audioState.shuffleEnabled && songs.length > 1) {
    let randomIndex = audioState.currentIndex;
    while (randomIndex === audioState.currentIndex) {
      randomIndex = Math.floor(Math.random() * songs.length);
    }
    playSongAtIndex(randomIndex);
    return;
  }

  // Next without shuffle
  const nextIndex = (audioState.currentIndex + 1) % songs.length;
  playSongAtIndex(nextIndex);
};

const handlePrev = () => {
  if (!songs.length) return;
  if (audioState.currentIndex === null) {
    playSongAtIndex(0);
    return;
  }

  const prevIndex =
    (audioState.currentIndex - 1 + songs.length) % songs.length;
  playSongAtIndex(prevIndex);
};

// Audio event handler
const handleTimeUpdate = () => {
  const audio = audioRef.current;
  if (!audio) return;

  dispatch({
    type: "SET_CURRENT_TIME",
    payload: audio.currentTime || 0,
  });
};
const handleLoadedMetadata = () => {
  const audio = audioRef.current;
  if (!audio) return;

  setDuration(audio.duration || 0);
  audio.playbackRate = audioState.playbackSpeed;
  audio.volume = Math.max(0, Math.min(1, audioState.volume / 100));
  audio.muted = audioState.isMuted;

  dispatch({ type: "PLAY" });
};

const handleEnded = () => {
  const audio = audioRef.current;
  if (!audio) return;

  if (audioState.loopEnabled) {
    audio.currentTime = 0;
    audio
      .play()
      .then(() => {
        dispatch({ type: "PLAY" });
        dispatch({type:"SET_CURRENT_TIME",payload:0});
      })
      .catch(e=>console.error("Replay error",e));
}else{
handleNext();
}
};

const handleToggleMute = () => {
  const audio = audioRef.current;
  if (!audio) return;

  if (audioState.isMuted) {
    const restoreVolume = previousVolumeRef.current || 50;

    audio.muted = false;
    audio.volume = Math.max(0, Math.min(1, restoreVolume / 100));

    dispatch({ type: "UNMUTE" });
    dispatch({ type: "SET_VOLUME", payload: restoreVolume });
  } else {
    previousVolumeRef.current = audioState.volume || 50;
    audio.muted = true;
    audio.volume = 0;

    dispatch({ type: "MUTE" });
    dispatch({ type: "SET_VOLUME", payload: 0 });
  }
};

const handleToggleLoop = () => {
    dispatch({ type: "TOGGLE_LOOP" });
};

const handleToggleShuffle = () => {
    dispatch({ type: "TOGGLE_SHUFFLE" });
};

const handleChangeSpeed = (newSpeed) => {
    const audio = audioRef.current;
    dispatch({ type: "SET_PLAYBACK_SPEED", payload: newSpeed });
    if (audio) {
        audio.playbackRate = newSpeed;
    }
};
const handleSeek=(newTime)=>{
    const audio = audioRef.current;
if (!audio) return;
audio.currentTime = newTime;
dispatch({
  type: "SET_CURRENT_TIME",
  payload: newTime,
});

}
const handleChangeVolume = (newVolume) => {
  const audio = audioRef.current;

  if (newVolume > 0) {
    previousVolumeRef.current = newVolume;
  }

  dispatch({ type: "SET_VOLUME", payload: newVolume });
  if (!audio) return;
  audio.volume = Math.max(0, Math.min(1, newVolume / 100));

  if (newVolume === 0) {
    audio.muted = true;
    dispatch({ type: "MUTE" });
  } else if (audioState.isMuted) {
    audio.muted = false;
    dispatch({ type: "UNMUTE" });
  }
};
return {
  // Audio Ref
  audioRef,

  // Current song state
  currentIndex: audioState.currentIndex,
  currentSong: audioState.currentSong,
  isPlaying: audioState.isPlaying,
  currentTime: audioState.currentTime,
  isLoading: audioState.isLoading,
  duration,

  // Features Toggle
  isMuted: audioState.isMuted,
  loopEnabled: audioState.loopEnabled,
  shuffleEnabled: audioState.shuffleEnabled,
  playbackSpeed: audioState.playbackSpeed,
  volume: audioState.volume,

  // Playback control functions
  playSongAtIndex,
  handleTogglePlay,
  handleNext,
  handlePrev,

  // Audio event handlers
handleTimeUpdate,
handleLoadedMetadata,
handleEnded,

// Feature control functions
handleToggleMute,
handleToggleLoop,
handleToggleShuffle,
handleChangeSpeed,
handleSeek, 
handleChangeVolume
};
};
export default useAudioPlayer;
