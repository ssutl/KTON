import { Book, userInfo } from "@/api/Interface";
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
import genreColors, { colorMapKeys } from "@/helpers/sortGenreColors";
import useOutsideAlerter from "@/helpers/ClickOutsideFunction";
import HandleLoginModal from "@/components/HandleLoginModal";
import cleanAuthor from "@/helpers/cleanAuthor";
import addGenreToBookApi from "@/api/Books/AddGenreToBook";
import { set } from "lodash";
import addGenreToUserApi from "@/api/Users/AddGenre";

const BookPage = () => {
  const router = useRouter();
  const id = router.query.id;
  const singleId = Array.isArray(id) ? id[0] : id; // Access the first element if it's an array
  const { books, userinfo } = useContext(KTON_CONTEXT);
  const { InitialiseApp } = InitApi();
  const { colorConverter, randomColorGenerator, mapTable } = genreColors();
  const [randomColor, setRandomColor] = useState(randomColorGenerator());
  const [mainBook, setMainBook] = useState<undefined | Book>(undefined);
  const [mainUserinfo, setMainUserinfo] = useState<undefined | userInfo>(
    undefined
  );
  const [restrictions, setRestricitons] = useState<boolean>(true);
  const [displayGenreModal, setDisplayGenreModal] = useState(false);
  const { LoginModal, setModal } = HandleLoginModal();
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
      console.log("Not authentication func");
      const clippings = localStorage.getItem("clippings");

      if (clippings && singleId) {
        const parsedClippings: Book[] = JSON.parse(clippings);
        setMainBook(parsedClippings[parseInt(singleId)]);
      }
    }
  }, [singleId]);

  //This should trigger at the start if theres already books, or after the initaliseApp has been called to get books
  useEffect(() => {
    if (userAuthenticated() && books) {
      setMainBook(books.filter((book) => book._id === singleId)[0]);
      setMainUserinfo(userinfo);
    }
  }, [books]);

  const bookTitle = () => {
    if (mainBook)
      return (
        <div className={styles.bookTitle}>
          <h1>{mainBook.title}</h1>
          <p>{cleanAuthor(mainBook.author)}</p>
        </div>
      );
    else null;
  };

  const highlightsList = () => {
    if (mainBook)
      return mainBook.highlights
        .slice(0, restrictions ? 50 : mainBook.highlights.length)
        .map((eachHighlight, index) => (
          <Highlight
            highlight={eachHighlight}
            key={index}
            setModal={setModal}
          />
        ));
    else null;
  };

  const handleAddGenreToBook = ({
    type,
    genre,
  }: {
    type: "add" | "remove";
    genre: string;
  }) => {
    if (mainBook) {
      let newState;
      if (type === "add") {
        newState = { ...mainBook, genre: [...mainBook.genre, genre] };
      } else if (type === "remove") {
        newState = {
          ...mainBook,
          genre: mainBook.genre.filter((eachGenre) => eachGenre !== genre),
        };
      }

      //Sorting locally
      setMainBook(newState);

      //sorting on server
      if (newState)
        addGenreToBookApi({ book_id: mainBook._id, data: newState.genre });
    }
  };

  const handleAddGenreToUser = ({
    type,
    genre,
  }: {
    type: "add" | "remove";
    genre: string;
  }) => {
    if (mainUserinfo && mainBook) {
      let newState = mainUserinfo;

      if (type === "add") {
        //Add the genre to the userinfo genres
        newState = {
          ...mainUserinfo,
          genres: { ...mainUserinfo.genres, [genre]: randomColor.color },
        };
      } else if (type === "remove") {
        //Filter the userinfo genres to remove the genre and add to newState
        let ghost = mainUserinfo.genres;
        delete ghost[genre];
        newState = { ...mainUserinfo, genres: ghost };
      }

      //sorting locally
      setMainUserinfo(newState);

      //Sorting on server
      if (newState) addGenreToUserApi({ data: newState.genres });

      //We could be removing from user geres but it may not be on the highlight, so we need to check before removing and wasting a request
      //When we add to user genres, we also need to add to book genres, so we can just add to book categories
      if (
        (type === "remove" && mainBook.genre.includes(genre)) ||
        (type === "add" && !mainBook.genre.includes(genre))
      ) {
        handleAddGenreToBook({ type, genre });
      }
    }
  };

  const genreModal = () => {
    if (mainBook && mainUserinfo)
      return (
        <div className={styles.GenreModal} ref={multiRef}>
          <div className={styles.searchItem}>
            <input
              placeholder="Search for genres"
              value={genreInput}
              onChange={(e) => setGenreInput(e.target.value)}
            />
          </div>
          {Object.keys(mainUserinfo.genres)
            .filter((eachGenre) =>
              eachGenre.toLowerCase().includes(genreInput.toLowerCase())
            )
            .map((eachGenre, i) => (
              <div
                key={i}
                className={`${styles.genreItem} ${styles.spaceBetween}`}
                onClick={() => {
                  if (!mainBook.genre.includes(eachGenre)) {
                    handleAddGenreToBook({ type: "add", genre: eachGenre });
                  }
                }}
              >
                <div
                  style={
                    {
                      "--background-color": colorConverter(
                        mainUserinfo.genres[eachGenre]
                      ),
                    } as React.CSSProperties
                  }
                  className={styles.tag}
                >
                  <p>{eachGenre}</p>
                </div>
                <MoreHorizIcon
                  className={styles.dotsIcon}
                  onClick={() => {
                    setDisplayGenreDropdown(!displayGenreDropdown);
                  }}
                />
              </div>
            ))}
          {!Object.keys(mainUserinfo.genres)
            .map((eachGenre) => eachGenre.toLowerCase())
            .includes(genreInput.toLowerCase()) &&
            genreInput !== "" && (
              <div
                className={styles.genreItem}
                onClick={() =>
                  handleAddGenreToUser({ type: "add", genre: genreInput })
                }
              >
                <p id={styles.createText}>Create</p>
                <div
                  className={styles.tag}
                  style={
                    {
                      "--background-color": randomColor.hex,
                    } as React.CSSProperties
                  }
                >
                  <p>{genreInput}</p>
                </div>
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

  if (mainBook && mainUserinfo) {
    return (
      <>
        {LoginModal()}
        <div className={styles.BookPage}>
          <div className={styles.bookHalf}>
            <div className={styles.overlay}></div>
            <div className={styles.imageSection}>
              <Tilt
                glareEnable={true}
                glareMaxOpacity={0.1}
                glarePosition="all"
                glareBorderRadius="0px"
                tiltAngleYInitial={screenWidth < 1024 ? 0 : -10}
                tiltEnable={false}
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
              <p
                onClick={() => {
                  restrictions
                    ? setModal()
                    : setDisplayGenreModal(!displayGenreModal);
                }}
                id={styles.addGenre}
              >
                + Add genre
              </p>
              {displayGenreModal && mainUserinfo && !restrictions
                ? genreModal()
                : null}
              {mainBook.genre.map((eachGenre, i) => (
                <p
                  key={i}
                  className={styles.BannerTags}
                  style={
                    {
                      "--background-color": colorConverter(
                        mainUserinfo.genres[eachGenre]
                      ),
                    } as React.CSSProperties
                  }
                >
                  {eachGenre}{" "}
                  <span
                    onClick={() => {
                      handleAddGenreToBook({
                        type: "remove",
                        genre: eachGenre,
                      });
                    }}
                  >
                    x
                  </span>
                </p>
              ))}
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
                    restrictions ? setModal() : handleSummary();
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
                  Your highlights have been limited to 50, login to see your
                  full list
                </h2>
              </div>
            ) : null}
          </div>
        </div>
      </>
    );
  } else return <h1>Component Loading</h1>;
};

export default BookPage;
