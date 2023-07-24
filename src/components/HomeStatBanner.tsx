import styles from "../styles/HomeStatBanner.module.scss";
import React, { useState, useEffect, useContext } from "react";
import userAuthenticated from "@/helpers/UserAuthenticated";
import { KTON_CONTEXT } from "../context/KTONContext";
import { streakRanges } from "date-streaks";
import { Meta_con_highlight } from "@/api/Interface";
import clippings_AllHighlights from "../helpers/Clippings_AllHighlights";

export default function HomeStatBanner() {
  //These are the highlights in context, which only authenticated users will have
  //We'll conditionally push either local clippings or context highlights to this state
  const { highlights } = useContext(KTON_CONTEXT);
  const [main_highlights, setMain_highlights] = useState<
    Meta_con_highlight[] | undefined
  >();

  //Conditon on page load, if user is authenticated, push context else push local clippings
  useEffect(() => {
    if (userAuthenticated()) {
      setMain_highlights(highlights);
    } else {
      const clippings = localStorage.getItem("clippings");
      setMain_highlights(clippings_AllHighlights(clippings));
    }
  }, []);

  //Getting the longest streak of days read
  function getLongestStreak() {
    if (main_highlights) {
      //Creating an array of all the dates read
      const arrayOfDates = main_highlights.map(
        (eachHighlight) => eachHighlight.highlight.Date
      );

      //Finding the longest consecutive streak of dates
      const streakInfo = streakRanges({ dates: arrayOfDates });

      const sortedArr = streakInfo.sort((a, b) => b.duration - a.duration);

      return sortedArr[0];
    }
  }

  //Once we have the highlights, we can render the component
  return (
    <div className={styles.HomeStatBanner}>
      {main_highlights ? (
        <>
          <div className={styles.statsBox}>
            <p>Longest Streak</p>
            <h1>{getLongestStreak()?.duration}</h1>
            <p>
              {getLongestStreak()?.end === null
                ? `${getLongestStreak()?.start.toDateString()} - todays date lol`
                : `${getLongestStreak()?.start.toDateString()} - ${getLongestStreak()?.end?.toDateString()}`}
            </p>
          </div>
          <div className={`${styles.statsBox} ${styles.statsBoxLong}`}>
            <p>Current Read</p>
            <h1>{main_highlights[0].title}</h1>
            <p>
              Started:{" "}
              {new Date(main_highlights[0].highlight.Date).toDateString()}
            </p>
          </div>
          <div className={styles.statsBox}>
            <p>Total Highlights</p>
            <h1>{main_highlights.length}</h1>
            <p>
              {`${new Date(
                main_highlights[main_highlights.length - 1].highlight.Date
              ).toDateString()} - ${new Date(
                main_highlights[0].highlight.Date
              ).toDateString()}`}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className={styles.loading}></div>
          <div className={styles.loading}></div>
          <div className={styles.loading}></div>
        </>
      )}
    </div>
  );
}
