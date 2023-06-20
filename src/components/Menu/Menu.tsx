"use client"

import { Suspense } from "react";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";
import useLocalStorage from "use-local-storage";

import styles from "./menu.module.css";


const Menu: React.FC = () => {
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage("theme", defaultDark ? "dark" : "light");
  const [user] = useLocalStorage("user", "");

  const handleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    setTheme(newTheme);
  }

  return (
    <Suspense>
      <div className={styles.menu}>
        {theme === "dark" ? <BsSunFill size={24} onClick={handleTheme} /> : <BsMoonStarsFill size={24} onClick={handleTheme} />}
        <span>{user}</span>
      </div>
    </Suspense>
  )
}

export { Menu }