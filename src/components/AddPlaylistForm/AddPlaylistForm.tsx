import { FormEvent, useRef, useState } from "react";

import { api } from "../../services/api";

import styles from "./add-playlist-form.module.css";
import { toast } from "react-toastify";
import axios from "axios";
import useLocalStorage from "use-local-storage";

const AddPlaylistForm = () => {
  const urlInput = useRef<HTMLInputElement>(null);
  const artistInput = useRef<HTMLInputElement>(null);
  const titleInput = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [user] = useLocalStorage("user", "");

  const handleSendUrl = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    setLoading(true);

    const url = urlInput.current?.value;
    const artist = artistInput.current?.value;
    const title = titleInput.current?.value;

    if (!url) {
      toast.warn("Fornecer um link válido");
      setLoading(false);
      return;
    }

    if (!artist) {
      toast.warn("Informar o nome do artista");
      setLoading(false);
      return;
    }

    if (!title) {
      toast.warn("Informar o nome da música");
      setLoading(false);
      return;
    }

    try {
      const result = await api.post<{ message: string }>("/insert", { url, user, title, artist });
      setLoading(false);

      if (urlInput.current) {
        urlInput.current.value = "";
      }

      if (artistInput.current) {
        artistInput.current.value = "";
      }

      if (titleInput.current) {
        titleInput.current.value = "";
      }

      toast.success(result.data.message);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          toast.error(err.response.data.message);
        } else if (err.request) {
          toast.error(err.request)
        } else {
          toast.error("Não foi possível adicionar a música");
        }
      }

      setLoading(false);
    }

  };

  return (
    <form onSubmit={handleSendUrl} className={styles.form}>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", width: "100%" }}>
        <label className={styles['form-label']}>
          Artista *:
          <input type="text" ref={artistInput} />
        </label>

        <label className={styles['form-label']}>
          Título *:
          <input type="text" ref={titleInput} />
        </label>
      </div>

      <div style={{display: "flex", alignItems: "flex-end", gap: 10, justifyContent: "center", width: "100%"}}>
        <label className={styles['form-label']}>
          Link do YouTube *:
          <input type="text" ref={urlInput} />
          <span>Apenas link do yotube video ou music</span>
        </label>

        <button disabled={loading}>{!loading ? "Enviar" : "Enviando"}</button>
      </div>
    </form>
  )
}

export { AddPlaylistForm }