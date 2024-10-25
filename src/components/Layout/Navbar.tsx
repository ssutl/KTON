import styles from "../../styles/Layout/Navbar.module.scss";
import React, { useState, useEffect, useContext } from "react";
import { KTON_CONTEXT } from "../../context/KTONContext";
import { useRouter } from "next/router";
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import TuneIcon from "@mui/icons-material/Tune";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

export interface NavbarProps {
  handleSettingsModal: () => void;
  settingsDisplayed: boolean;
}

export default function Navbar({
  handleSettingsModal,
  settingsDisplayed,
}: NavbarProps) {
  const { books, updateBooks } = useContext(KTON_CONTEXT);
  const router = useRouter();
  const [screenWidth, setScreenWidth] = useState<number | undefined>(undefined);
  const [demo, setDemo] = useState(false);
  console.log("demo", demo);
  const [auth, setAuth] = useState(false);
  console.log("auth", auth);

  // getting the current route
  const isIndexRoute = router.pathname === "/[[...index]]";
  const isImportRoute = router.pathname === "/Import";
  const isHome = router.pathname === "/Home";
  const isLibr = router.pathname === "/Library";
  const isBook = router.pathname.includes("/Book/");
  const isExport = router.pathname === "/Export";

  const DisplaySettings = isHome || isLibr || isBook || isExport;
  const DisplayLibrary =
    DisplaySettings ||
    (isImportRoute &&
      books?.filter((eachBook) => eachBook.deleted === false).length !== 0 &&
      books !== undefined);

  const getLocalStorage = () => {
    //Have to set screenwidth to disable share feature for mobile

    //Updating demo state
    setTimeout(() => {
      const Demo = localStorage.getItem("Demo") === "true";
      const Auth = localStorage.getItem("token") ? true : false;
      if (Auth) setAuth(Auth);
      if (Demo) setDemo(Demo);
    }, 100);
  };

  //Getting the local storage when the route changes
  useEffect(() => {
    if (router.isReady) {
      getLocalStorage();
    }
  }, [router.pathname]);

  //Getting the local storage when the page loads
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", () => handleResize());
    getLocalStorage();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //Display the navbar
  if (router.pathname === "/verify/[...id]") return null;

  const mobileNavbar = () => {
    if (isIndexRoute) return null;
    return (
      <div className={styles.mobileNavbar}>
        <div className={styles.navbarWidth}>
          {!isImportRoute && (
            <p
              onClick={() => {
                router.push("/Home");
                if (settingsDisplayed) {
                  handleSettingsModal();
                }
              }}
            ></p>
          )}
          {DisplayLibrary && !demo && (
            <p
              onClick={() => {
                router.push("/Library");
                if (settingsDisplayed) {
                  handleSettingsModal();
                }
              }}
            >
              <SplitscreenIcon />
            </p>
          )}
          {auth && (DisplaySettings || isImportRoute) && (
            <p onClick={() => handleSettingsModal()}>
              <TuneIcon />
            </p>
          )}
          {demo && !auth && (
            <p
              onClick={() => {
                router.push("https://kton-landing.vercel.app/");
                localStorage.removeItem("Demo");
                setDemo(false);
                updateBooks(undefined);
              }}
            >
              Landing
            </p>
          )}
        </div>
      </div>
    );
  };

  if (screenWidth && screenWidth < 1024 && !isIndexRoute) return mobileNavbar();

  if (screenWidth && screenWidth < 1024 && isIndexRoute) return null;

  return (
    <div className={styles.navbar}>
      <div className={styles.navbarWidth}>
        <h3
          onClick={() =>
            router.push(
              `${
                isIndexRoute || demo
                  ? "https://kton.vercel.app/"
                  : isImportRoute
                  ? "/"
                  : "/Home"
              }`
            )
          }
        >
          KTON
        </h3>
        {isIndexRoute && (
          <p
            onClick={() => router.push("https://kton-landing.vercel.app/")}
            className={styles.backToLanding}
          >
            Back to landing
          </p>
        )}
        {!isIndexRoute && (
          <div className={styles.navigationButtons}>
            {DisplayLibrary && auth && (
              <p onClick={() => router.push("/Library")}>Library</p>
            )}
            {auth && (DisplaySettings || isImportRoute) && (
              <p onClick={() => handleSettingsModal()} id="settingBTN">
                Settings
              </p>
            )}
            {demo && !auth && (
              <p
                onClick={() => {
                  router.push("https://kton-landing.vercel.app/");
                  localStorage.removeItem("Demo");
                  setDemo(false);
                  updateBooks(undefined);
                }}
              >
                Landing
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
