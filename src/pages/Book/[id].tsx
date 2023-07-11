import { Book } from "@/api/Interface";
import styles from "../../styles/BookPage.module.scss";
import { useRouter } from "next/router";
import React, { useState, useEffect, useContext, useRef } from "react";
import userAuthenticated from "@/helpers/UserAuthenticated";
import { KTON_CONTEXT } from "../../context/KTONContext";
import InitApi from "../../api/InitAPI";
import Highlight from "@/components/Highlight";
import { usePalette } from "react-palette";
import Tilt from "react-parallax-tilt";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import TextareaAutosize from "react-textarea-autosize";
import summariseBookApi from "@/api/Books/Summary";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import genreColors, { colorMapKeys } from "@/helpers/sortGenreColors";

function useOutsideAlerter(
  ref: any,
  modalState: React.Dispatch<React.SetStateAction<boolean>>
) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        modalState(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

const BookPage = () => {
  const router = useRouter();
  const id = router.query.id;
  const singleId = Array.isArray(id) ? id[0] : id; // Access the first element if it's an array
  const { books, userinfo } = useContext(KTON_CONTEXT);
  const { InitialiseApp } = InitApi();
  const { colorConverter, randomColorGenerator, mapTable } = genreColors();
  const [mainBook, setMainBook] = useState<undefined | Book>(undefined);
  const [restrictions, setRestricitons] = useState<boolean>(true);
  const [displayGenreModal, setDisplayGenreModal] = useState(false);
  const [selectedGenreIndex, setSelectedGenreIndex] = useState<
    number | undefined
  >(undefined);
  const [displayGenreDropdown, setDisplayGenreDropdown] = useState<boolean>();
  const [inputSummary, setInputSummary] = useState<string | undefined>(
    undefined
  );
  const [genreInput, setGenreInput] = useState<string>("");
  // const [summary, setSummary] = useState<string | undefined>(undefined);
  const multiRef = useRef(null);
  const { data, loading, error } = usePalette(
    mainBook ? mainBook.cover_image : ""
  );
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    //Have to set screenwidth to conditionally change size of heat map
    setScreenWidth(window.innerWidth);
    window.addEventListener("resize", () => setScreenWidth(window.innerWidth));
  }, []);

  useEffect(() => {
    //If book is undefined at start, change summary once it updates
    if (mainBook !== undefined) {
      setInputSummary(mainBook.summary);
      // setSummary(mainBook.summary);
    }
  }, [mainBook]);

  //Initialising App by making data call on page load, this updates user context
  useEffect(() => {
    setRestricitons(!userAuthenticated());
    //If the user is logged in but the book data is empty then we gotta refresh context, this way we can keep initial load fast by not loading books off of navigation
    if (userAuthenticated() && !books) {
      InitialiseApp();
    }

    //Else user not logged in, we can just grab from clippings
    if (!userAuthenticated()) {
      const clippings = localStorage.getItem("clippings");

      if (clippings && singleId) {
        const parsedClippings: Book[] = JSON.parse(clippings);
        setMainBook(parsedClippings[parseInt(singleId)]);
      }
    }
  }, []);

  //This should trigger at the start if theres already books, or after the initaliseApp has been called to get books
  useEffect(() => {
    if (userAuthenticated() && books) {
      setMainBook(books.filter((book) => book._id === singleId)[0]);
    }
  }, [books]);

  const bookTitle = () => {
    if (mainBook)
      return (
        <div className={styles.bookTitle}>
          <h1>{mainBook.title}</h1>
          <p>
            {mainBook.author.slice(-1) === ";"
              ? mainBook.author.slice(0, -1)
              : mainBook.author.replace(";", " & ")}
          </p>
        </div>
      );
    else null;
  };

  const highlightsList = () => {
    if (mainBook)
      return mainBook.highlights
        .slice(0, restrictions ? 50 : mainBook.highlights.length)
        .map((eachHighlight, index) => (
          <Highlight highlight={eachHighlight} key={index} index={index} />
        ));
    else null;
  };

  const handleAddGenre = (genre: string) => {
    if (mainBook) {
      //Sorting locally
      if (!mainBook.genre.includes(genre)) {
        const newState = { ...mainBook, genre: [...mainBook.genre, genre] };
        setMainBook(newState);
      }

      //sorting on server
    }
  };

  const genreModal = () => {
    if (userinfo)
      return (
        <div className={styles.GenreModal} ref={multiRef}>
          <div className={styles.searchItem}>
            <input
              placeholder="Search for filters"
              onChange={(e) => setGenreInput(e.target.value)}
            />
          </div>
          {Object.keys(userinfo.genres)
            .filter((eachGenre) =>
              eachGenre.toLowerCase().includes(genreInput.toLowerCase())
            )
            .map((eachGenre, i) => (
              <div key={i} className={styles.genreItem}>
                <p
                  style={
                    {
                      "--background-color": colorConverter(
                        userinfo.genres[eachGenre]
                      ),
                    } as React.CSSProperties
                  }
                  onClick={() => handleAddGenre(eachGenre)}
                >
                  {eachGenre}
                </p>
                <MoreHorizIcon
                  className={styles.dots}
                  onClick={() => {
                    setSelectedGenreIndex(i);
                    setDisplayGenreDropdown(!displayGenreDropdown);
                  }}
                />
              </div>
            ))}
          {!Object.keys(userinfo.genres)
            .map((eachGenre) => eachGenre.toLowerCase())
            .includes(genreInput.toLowerCase()) &&
            genreInput !== "" && (
              <div className={styles.genreItem}>
                <p>{`Create ${genreInput}`}</p>
                <MoreHorizIcon className={styles.dots} />
              </div>
            )}
        </div>
      );
    else return null;
  };

  /**Custom hook which takes in a ref and a setState action which gets triggered when the user clicks outside of the ref */
  useOutsideAlerter(multiRef, setDisplayGenreModal);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      // Perform any action you want to execute when Enter is pressed
      handleSummary();
    }
  };

  const handleSummary = () => {
    //Handling request locally
    //Handling request on server
    summariseBookApi({ book_id: id, data: inputSummary });

    //Clear summary
  };

  if (mainBook) {
    return (
      <div className={styles.BookPage}>
        <div className={styles.bookHalf}>
          <div className={styles.overlay}></div>
          <div className={styles.imageSection}>
            <Tilt
              glareEnable={true}
              glareMaxOpacity={0.1}
              glarePosition="all"
              glareBorderRadius="0px"
              tiltAngleYInitial={-10}
              tiltEnable={true}
              gyroscope={true}
              className={styles.ImageContainer}
              perspective={650}
            >
              {restrictions ? null : (
                <img
                  alt="Book Cover"
                  draggable="false"
                  src={mainBook.cover_image}
                  className="image"
                />
              )}
            </Tilt>
          </div>
          <div className={styles.genreBanner}>
            <p onClick={() => setDisplayGenreModal(!displayGenreModal)}>
              + Add genre
            </p>
            {mainBook.genre.map((eachGenre, i) => (
              <p key={i}>{eachGenre}</p>
            ))}
            {displayGenreModal && userinfo ? genreModal() : null}
          </div>
          {screenWidth < 1024 ? bookTitle() : null}
          <div className={styles.summarySection}>
            <TextareaAutosize
              value={inputSummary}
              placeholder="Add a quick summary here"
              onChange={(e) => setInputSummary(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className={styles.buttonsSection}>
              <p
                onClick={() => {
                  handleSummary();
                }}
              >
                Save
              </p>
              <p onClick={() => setInputSummary("")}>Clear</p>
            </div>
          </div>
          {screenWidth < 1024 ? highlightsList() : null}
        </div>
        <div className={styles.highlightHalf}>
          {screenWidth > 1024 ? bookTitle() : null}
          {screenWidth > 1024 ? highlightsList() : null}
          {restrictions && mainBook.highlights.length > 50 ? (
            <div className={styles.highlightRestriction}>
              <h2>
                Your highlights have been limited to 50, login to see your full
                list
              </h2>
            </div>
          ) : null}
        </div>
      </div>
    );
  } else return <h1>Component Loading</h1>;
};

export default BookPage;
