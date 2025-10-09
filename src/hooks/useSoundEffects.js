import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { soundEffects } from '../utils/soundEffects';

export function useSoundEffects() {
  const [soundEnabled, setSoundEnabled] = useLocalStorage('soundEnabled', true);

  useEffect(() => {
    soundEffects.setEnabled(soundEnabled);
  }, [soundEnabled]);

  return {
    soundEnabled,
    toggleSound: () => setSoundEnabled(!soundEnabled),
    playTaskComplete: () => soundEffects.playTaskComplete(),
    playLevelUp: () => soundEffects.playLevelUp(),
    playAchievement: () => soundEffects.playAchievement(),
    playClick: () => soundEffects.playClick(),
    playSnooze: () => soundEffects.playSnooze(),
    playDelete: () => soundEffects.playDelete(),
    playHover: () => soundEffects.playHover(),
  };
}
