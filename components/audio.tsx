import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  PauseIcon,
  PlayIcon,
  SpeakerXMarkIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/outline";

type AudioProps = {
  audio: string;
  readTime: number;
  onTimeUpdate: (progress: number) => void;
};

export const Audio = ({ audio, readTime, onTimeUpdate }: AudioProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);

  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    if (e.currentTarget instanceof HTMLAudioElement) {
      setAudioProgress(e.currentTarget.currentTime / readTime);
      onTimeUpdate((e.currentTarget.currentTime / readTime) * 60);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const abort = new AbortController();

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata, {
      signal: abort.signal,
    });

    audio.addEventListener("timeupdate", handleTimeUpdate, {
      signal: abort.signal,
    });

    audio.addEventListener("ended", handleEnded, { signal: abort.signal });

    return () => {
      abort.abort();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      if (newVolume === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
      }
    }
  };

  const handleProgressClick = (e: MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const clickPosition =
      (e.clientX - progressBar.getBoundingClientRect().left) /
      progressBar.offsetWidth;
    const newTime = clickPosition * duration;

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-4">
      <motion.button
        onClick={togglePlay}
        aria-label={isPlaying ? "Pausar" : "Reproduzir"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 rounded-full bg-primary hover:bg-primary-glow flex items-center justify-center transition-colors shadow-glow relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="pause"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.2 }}
            >
              <PauseIcon className="w-5 h-5 text-primary-foreground" />
            </motion.div>
          ) : (
            <motion.div
              key="play"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.2 }}
              className="ml-0.5"
            >
              <PlayIcon className="w-5 h-5 text-primary-foreground" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ripple effect when playing */}
        <AnimatePresence>
          {isPlaying && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full bg-primary-glow"
                initial={{ scale: 1, opacity: 0.3 }}
                animate={{ scale: 1.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-primary-glow"
                initial={{ scale: 1, opacity: 0.3 }}
                animate={{ scale: 1.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              />
            </>
          )}
        </AnimatePresence>
      </motion.button>

      <div className="flex-1">
        <motion.div
          className="flex items-center justify-between mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.span
            className="text-sm font-medium text-foreground"
            animate={{
              scale: isPlaying ? [1, 1.02, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: isPlaying ? Infinity : 0,
            }}
          >
            {isPlaying ? "Reproduzindo áudio" : "Ouvir artigo"}
          </motion.span>
          <motion.span
            className="text-xs text-muted-foreground font-mono"
            key={currentTime}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
          >
            {formatTime(currentTime)} / {formatTime(duration)}
          </motion.span>
        </motion.div>

        <motion.div
          className="h-2 bg-muted rounded-full overflow-hidden cursor-pointer"
          onClick={handleProgressClick}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          whileHover={{ scaleY: 1.5 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="h-full bg-primary rounded-full relative"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </motion.div>
      </div>

      <div className="relative">
        <motion.button
          onClick={toggleMute}
          aria-label={isMuted ? "Ativar som" : "Silenciar"}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-accent-foreground"
        >
          <AnimatePresence mode="wait">
            {isMuted || volume === 0 ? (
              <motion.div
                key="muted"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <SpeakerXMarkIcon className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div
                key="unmuted"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <SpeakerWaveIcon className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* <AnimatePresence>
          {showVolumeSlider && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="absolute bottom-full right-0 mb-2 p-2 bg-popover rounded-lg shadow-elegant border border-border"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <motion.input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                aria-label="Controle de volume"
                whileHover={{ scale: 1.05 }}
                className="accent-primary cursor-pointer"
                style={{
                  writingMode: "bt-lr",
                  WebkitAppearance: "slider-vertical",
                  height: "80px",
                  width: "8px",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence> */}
      </div>

      <audio ref={audioRef} src={audio} preload="metadata" className="hidden" />
    </div>
  );
};
