import { useRef } from "react";

import rightSoundEffect from "../../assets/sounds/ring-sound-effect.mp3"
import wrongSoundEffect  from "../../assets/sounds/wrong-sound-effect.mp3"

export const useWithSound = () => {
  const soundRef = useRef();

  const playRightSound = () => {
    soundRef.current = new Audio(rightSoundEffect);
    soundRef.current.play();
  };

  const playWrongSound = () => {
    soundRef.current = new Audio(wrongSoundEffect);
    soundRef.current.play();
  };

  // const pauseSound = () => {
  //   soundRef.current.pause();
  // };

  return {
    playRightSound,
    playWrongSound,
  };
};
