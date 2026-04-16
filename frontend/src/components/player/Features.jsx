import React from "react";
import { IoVolumeHighOutline, IoVolumeMuteOutline } from "react-icons/io5";
import { TbArrowsShuffle } from "react-icons/tb";
import { RiLoopRightLine } from "react-icons/ri";

import "../../css/footer/Feature.css";

const Features = ({ playerState = {}, playerFeatures = {} } = {}) => {
  // static UI state
 //const isMuted = false;
  //const shuffleEnabled = false;
  //const loopEnabled = false;
  //const playbackSpeed = 1;
  //const volume = 50;


  const {
    isMuted = false,
    loopEnabled = false,
    shuffleEnabled = false,
    playbackSpeed = 1,
    volume = 50,
  } = playerState;

  const {
    onToggleMute = () => {},
    onToggleLoop = () => {},
    onToggleShuffle = () => {},
    onChangeSpeed = () => {},
    onChangeVolume = () => {},

  } = playerFeatures;

const handleSpeedChange = (e) => {
  const value = Number(e.target.value);
  onChangeSpeed(value);
};
const handleVolumeChange = (e) => {
  const value = Number(e.target.value);
  onChangeVolume(value);
};



  return (
    <><div className="features-root">
      <div className="features-row">
        {/* Mute */}
        <button
          className="features-btn"
          aria-label={isMuted ? "unmute" : "mute"}
          onClick={onToggleMute}
        >
          {isMuted ? (
            <IoVolumeMuteOutline color="#a855f7" size={24} />
          ) : (
            <IoVolumeHighOutline color="#a855f7" size={24} />
          )}
        </button>

        {/* Shuffle */}
      <button
      type="button"
  className={
    shuffleEnabled
      ? "features-btn features-btn-active"
      : "features-btn"
  }
  aria-label={shuffleEnabled ? "disable shuffle" : "enable shuffle"}
  onClick={onToggleShuffle}
>
  <TbArrowsShuffle color={shuffleEnabled ? "#a855f7" :"#9ca3af"} size={26} />
</button>

        {/* Loop */}
       <button
       type="button"
  className={
    loopEnabled ? "features-btn features-btn-active" : "features-btn"
  }
  aria-label="loop"
  onClick={onToggleLoop}
>
  <RiLoopRightLine
    color={loopEnabled ? "#a855f7" : "#9ca3af"}
    size={26}
  />
</button>



        {/* Playback Speed */}
       <label className="features-speed-label" htmlFor="playbackSpeed">
  <select
    name="playbackSpeed"
    id="playbackSpeed"
    aria-label="playbackSpeed"
    className="features-speed-select"
    value={playbackSpeed}
    onChange={handleSpeedChange}
  >

            <option className="features-speed-select" value={0.75}>0.75x</option>

            <option  className="features-speed-select"value={1}>1x</option>

            <option  className="features-speed-select" value={1.25}>1.25x</option>

            <option className="features-speed-select"value={1.5}>1.5x</option>

            <option className="features-speed-select" value={2}>2x</option>
          </select>
        </label>
      </div>

      {/* Volume */}
      <div className="features-volume-wrapper">
        {(() => {
          const rawProgress = Number(volume);
          const progress = Number.isFinite(rawProgress)
            ? Math.min(100, Math.max(0, rawProgress))
            : 0;
          return (
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={handleVolumeChange}
              className="features-volume-range"
              style={{ "--volume": `${progress}%` }}
            />
          );
        })()}
      </div>
      </div>
    
    </>

    );
};
export default Features;
