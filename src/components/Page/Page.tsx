import useLocalStorage from "use-local-storage";

import styles from "./page.module.css";

interface PageProps {
  children?: React.ReactNode;
}

const Page: React.FC<PageProps> = ({ children }) => {
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme] = useLocalStorage("theme", defaultDark ? "dark" : "light");

  return (
    <div data-theme={theme} className={styles.page}>
      {children}
    </div>
  )
}

export { Page };