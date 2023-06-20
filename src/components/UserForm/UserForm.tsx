import { FormEvent, useRef } from "react";

import styles from "./user-form.module.css";
import useLocalStorage from "use-local-storage";
import { toast } from "react-toastify";

const UserForm: React.FC = () => {
  const [user, setUser] = useLocalStorage("user", "");
  const userInput = useRef<HTMLInputElement>(null);

  const handleUser = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const name = userInput.current?.value;

    if (!name) {
      toast.warn("Fornece um nome válido");
      return;
    }

    setUser(name);
  }

  if (!user) {
    return (
      <form onSubmit={handleUser} className={styles.form}>
        <label className={styles['form-label']}>
          Nome <sup>*</sup>:
          <input type="text" ref={userInput} />
          <span>Forneça um nome para adicionar músicas na playlist</span>
        </label>

        <button>Enviar</button>
      </form>
    )
  } else {
    return null;
  }
};

export { UserForm };