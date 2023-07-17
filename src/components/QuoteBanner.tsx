import React, { useEffect, useState, useContext } from "react";
import styles from "../styles/QuoteBanner.module.scss";
import userAuthenticated from "@/helpers/UserAuthenticated";
import { KTON_CONTEXT } from "../context/KTONContext";
import { Meta_con_highlight } from "@/api/Interface";
import clippings_AllHighlights from "@/helpers/Clippings_AllHighlights";
import favouriteHighlightApi from "@/api/Highlights/Favourite";
import deleteHighlightApi from "@/api/Highlights/Delete";
import cleanAuthor from "@/helpers/cleanAuthor";

const QuoteBanner = () => {
  const { highlights } = useContext(KTON_CONTEXT);
  const [restrictions, setRestrictions] = useState(true);
  const [index, setIndex] = useState<number>(0);
  //This is the main collection we are reading from, either authed user info or unauthed will go here
  const [shuffledHighlights, setShuffledHighlights] = useState<
    Meta_con_highlight[] | undefined
  >();

  //Function to shuffle the highlights
  const shuffleHighlights = (allHighlights: Meta_con_highlight[]) => {
    const shuffledArray = [...allHighlights];
    setShuffledHighlights(shuffledArray.sort(() => Math.random() - 0.5));
  };

  //On page load, we'll set the restrictions and decide where to get highlights from
  useEffect(() => {
    //Setting restrictions
    setRestrictions(!userAuthenticated());

    const userIsAuthenticated = userAuthenticated();
    const clippings = localStorage.getItem("clippings");
    let highlightsData;

    if (userIsAuthenticated && highlights) {
      shuffleHighlights(highlights);
    } else if (clippings) {
      const clippingsHighlights = clippings_AllHighlights(clippings);
      if (clippingsHighlights) shuffleHighlights(clippingsHighlights);
      highlightsData = clippingsHighlights;
    }

    const interval = setInterval(() => {
      setIndex((prevIndex) => prevIndex + 1);
    }, 20000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  //Function to favourite a highlight
  const handleFavourite = () => {
    if (shuffledHighlights) {
      //Handling request locally
      const newState = shuffledHighlights?.map((eachHighlightConMeta, i) => {
        if (i === index) {
          return {
            ...eachHighlightConMeta,
            highlight: {
              ...eachHighlightConMeta.highlight,
              starred: !eachHighlightConMeta.highlight.starred,
            },
          };
        } else return eachHighlightConMeta;
      });
      setShuffledHighlights(newState);

      //Handling request on server
      favouriteHighlightApi({
        book_id: shuffledHighlights[index].book_id,
        highlight_id: shuffledHighlights[index].highlight._id,
      });
    }
  };

  //Function to delete a highlight
  const handleDelete = () => {
    if (shuffledHighlights) {
      //Handling request locally
      const newState = shuffledHighlights?.map((eachHighlightConMeta, i) => {
        if (i === index) {
          return {
            ...eachHighlightConMeta,
            highlight: {
              ...eachHighlightConMeta.highlight,
              deleted: !eachHighlightConMeta.highlight.deleted,
            },
          };
        } else return eachHighlightConMeta;
      });

      // Update the index to the next highlight
      if (shuffledHighlights)
        setIndex((prevIndex) => {
          const newIndex = prevIndex + 1;
          return newIndex < shuffledHighlights.length ? newIndex : 0;
        });

      setShuffledHighlights(newState);

      //Handling request on server
      deleteHighlightApi({
        book_id: shuffledHighlights[index].book_id,
        highlight_id: shuffledHighlights[index].highlight._id,
      });
    }
  };

  //Reading from the main collection (source of truth), if it aint there show loading
  if (shuffledHighlights) {
    const text = shuffledHighlights[index].highlight.Text;
    const author = shuffledHighlights[index].author;
    const title = shuffledHighlights[index].title;
    const starred = shuffledHighlights[index].highlight.starred;

    return (
      <div className={styles.QuoteBanner}>
        <div className={styles.QuoteBannerWidth}>
          <h1 className={styles.highlight}>{text}</h1>
          {restrictions ? null : (
            <p className={styles.metaData1}>
              <span onClick={() => handleFavourite()}>
                {starred ? `Starred` : `Star`}
              </span>{" "}
              -<span onClick={() => handleDelete()}> Delete</span>
            </p>
          )}
          <p className={styles.metaData2}>
            {cleanAuthor(author)} - {title}
          </p>
        </div>
      </div>
    );
  } else return <h1>Component Loading </h1>;
};

export default QuoteBanner;
