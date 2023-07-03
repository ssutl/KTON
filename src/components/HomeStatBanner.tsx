import styles from "../styles/HomeStatBanner.module.scss";
import React, { useState, useEffect, useContext } from "react";
import userAuthenticated from "@/helpers/UserAuthenticated";
import { KTON_CONTEXT } from "../context/KTONContext";
import { streakRanges, summary } from "date-streaks";
import { Meta_con_highlight } from "@/api/Interface";
import clippings_AllHighlights from "../helpers/Clippings_AllHighlights";

//interface HomeStatBannerProps {}

export default function HomeStatBanner() {
  const { highlights } = useContext(KTON_CONTEXT);
  //These are the highlights in context, which only authenticated users will have

  const [main_highlights, setMain_highlights] = useState<
    Meta_con_highlight[] | undefined
  >();
  //This will be the main highlights, which we'll conditionally push either local clippings highlights to or context highlights
  //This is what we'll use for rendering

  useEffect(() => {
    //If user authed, give context highlights, else pass in clippings highlights
    if (userAuthenticated()) {
      setMain_highlights(highlights);
    } else {
      const clippings = localStorage.getItem("clippings");
      setMain_highlights(clippings_AllHighlights(clippings));
    }
  }, []);

  function getLongestStreak() {
    //Getting the longest streak of days read
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

  if (main_highlights) {
    return (
      <div className={styles.HomeStatBanner}>
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
          <p></p>
        </div>
      </div>
    );
  } else return <h1>Component Loading </h1>;
}
