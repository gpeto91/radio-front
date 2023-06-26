import { useState } from "react";
import styles from "./info-message.module.css"
import { MdOutlineClose } from "react-icons/md";

const InfoMessage: React.FC = () => {
  const [open, setOpen] = useState<boolean>(true);

  if (open) {
    return (
      <div className={styles.info}>
        <div className={styles.content}>
          <MdOutlineClose className={styles.close} size={20} onClick={() => setOpen(false)} />
          <p>Meus queridos, foi feita uma alteração na adição das músicas pra tentar resolver o problema da rádio parando. Com isso toda a playlist foi reiniciada :( Adicionem várias músicas pra gente testar!! ♡</p>
        </div>
      </div>
    )
  }

  return null;
};

export { InfoMessage };