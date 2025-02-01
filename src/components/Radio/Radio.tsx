import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import {
  BsMic,
  BsFillMicFill,
  BsFillVolumeDownFill,
  BsFillVolumeMuteFill,
  BsFillVolumeOffFill,
  BsFillVolumeUpFill,
} from "react-icons/bs";

import styles from "./radio.module.css";
import { socket } from "../../socket";
import { PROD_URL } from "../../services/api";
import { toast } from "react-toastify";
import useLocalStorage from "use-local-storage";

type NewTrackType = {
  user: string;
  metadata: {
    title: string;
    artist: string;
  };
};

const Radio: React.FC = () => {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.1);
  const [muted, setMuted] = useState<boolean>(false);
  const [canPlay, setCanPlay] = useState<boolean>(false);

  const [sender, setSender] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [artist, setArtist] = useState<string>("");

  const [pageIsFocused, setPageIsFocused] = useState<boolean>(true);
  const [notificationGranted, setNotificationGranted] = useState<boolean>();

  const [socketId, setSocketId] = useLocalStorage("socketId", "");

  const onFocus = () => {
    setPageIsFocused(true);
  };

  const onBlur = () => {
    setPageIsFocused(false);
  };

  const handlePlay = () => {
    if (canPlay) {
      setPlaying(true);
    }
  };

  const handleMuted = () => {
    setMuted((state) => !state);
  };

  const handleNewTrack = (track: NewTrackType) => {
    setSender(track.user);
    setTitle(track.metadata.title);
    setArtist(track.metadata.artist);
  };

  const onQueued = (message: string) => {
    if (pageIsFocused || !notificationGranted) {
      toast.success(message, { pauseOnFocusLoss: true, autoClose: false });
    } else {
      if (notificationGranted) {
        const notification = new Notification("Sucesso!", { body: message });

        setTimeout(() => {
          notification.close();
        }, 5 * 1000);
      }
    }
  };

  const onQueuedError = (message: string) => {
    if (pageIsFocused || !notificationGranted) {
      toast.error(message, { pauseOnFocusLoss: true, autoClose: false });
    } else {
      if (notificationGranted) {
        const notification = new Notification("Ops!", { body: message });

        setTimeout(() => {
          notification.close();
        }, 5 * 1000);
      }
    }
  };

  useEffect(() => {
    if (canPlay && playing) {
      audio.current?.play();
    }
  }, [canPlay, playing]);

  useEffect(() => {
    if (audio.current) {
      audio.current.volume = volume;
    }
  }, [audio, volume]);

  useEffect(() => {
    if (audio.current) {
      audio.current.muted = muted;
    }
  }, [muted]);

  useEffect(() => {
    socket.on("new-track", handleNewTrack);
    socket.on("queued", onQueued);
    socket.on("queued-error", onQueuedError);
    socket.on("socket-id", (id: string) => setSocketId(id));

    return () => {
      socket.off("new-track", handleNewTrack);
      socket.off("queued", onQueued);
      socket.off("queued-error", onQueuedError);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);

    if (Notification.permission === "granted") {
      setNotificationGranted(true);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") setNotificationGranted(true);
        else setNotificationGranted(false);
      });
    }

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  /* useEffect(() => {
    window.addEventListener("keypress", (evt) => {
      if (evt.code === "Space") {
        handleMuted();
      }
    });
  }, []); */

  return (
    <>
      <Helmet>
        <title>
          {playing
            ? `Rádio Guarani - Tocando: ${artist} - ${title}`
            : `Rádio Guarani`}
        </title>
      </Helmet>

      <audio
        src={`${PROD_URL}/stream`}
        autoPlay
        onCanPlay={() => setCanPlay(true)}
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onAbort={() => setPlaying(false)}
        ref={audio}
      />

      <div className={styles.wrapper}>
        {playing ? (
          <BsFillMicFill size={140} className={styles.mic} />
        ) : (
          <BsMic
            size={140}
            className={`${styles.mic} ${!canPlay && styles.disabled} ${
              styles.clickable
            }`}
            onClick={() => handlePlay()}
          />
        )}

        {playing && (
          <div className={styles.volume}>
            {volume === 1 && !muted ? (
              <BsFillVolumeUpFill size={32} onClick={() => handleMuted()} />
            ) : volume < 1 && volume >= 0.5 && !muted ? (
              <BsFillVolumeDownFill size={32} onClick={() => handleMuted()} />
            ) : volume < 0.5 && volume > 0 && !muted ? (
              <BsFillVolumeOffFill size={32} onClick={() => handleMuted()} />
            ) : (
              <BsFillVolumeMuteFill size={32} onClick={() => handleMuted()} />
            )}
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(evt) => setVolume(Number(evt.currentTarget.value))}
            />
          </div>
        )}

        {sender && playing && (
          <div
            style={{
              padding: 15,
              margin: "20px -15px",
              textTransform: "uppercase",
              backgroundColor: "rgba(0, 0, 0, 0.1)",
            }}
          >
            <p>Tocando agora:</p>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <p style={{ fontSize: 28 }}>
                {artist} - {title}
              </p>
              <span
                style={{
                  alignSelf: "flex-end",
                  fontSize: 12,
                  color: "green",
                  fontWeight: "bold",
                }}
              >
                por {sender} ♡
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export { Radio };
