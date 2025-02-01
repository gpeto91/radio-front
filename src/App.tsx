import useLocalStorage from "use-local-storage";

import { Theme, ToastContainer } from "react-toastify";

import { Menu } from "./components/Menu/Menu";
import { Page } from "./components/Page/Page";
import { UserForm } from "./components/UserForm/UserForm";
import { Radio } from "./components/Radio/Radio";
import { AddPlaylistForm } from "./components/AddPlaylistForm/AddPlaylistForm";

import "react-toastify/dist/ReactToastify.css";

function App() {
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [user] = useLocalStorage("user", "");
  const [theme] = useLocalStorage("theme", defaultDark ? "dark" : "light");

  return (
    <>
      <Page>
        <Menu />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "calc(100% - 50px)",
            padding: "0 15px",
            paddingTop: 60,
          }}
        >
          <h1 className="title">Guarani Collab Radio</h1>

          {!user && <UserForm />}

          <Radio />

          {user && <AddPlaylistForm />}
        </div>
      </Page>

      <ToastContainer
        autoClose={3000}
        limit={2}
        newestOnTop={true}
        pauseOnHover={false}
        theme={theme as Theme}
      />
    </>
  );
}

export default App;
