import styles from "../styles/HomeStatBanner.module.scss";
import React, { useState, useEffect, useContext } from "react";
import { KTON_CONTEXT } from "../context/KTONContext";
import { streakRanges } from "date-streaks";
import { useRouter } from "next/router";

export default function HomeStatBanner() {
  //These are the highlights in context, which only authenticated users will have
  //We'll conditionally push either local clippings or context highlights to this state
  const router = useRouter();
  const { highlights } = useContext(KTON_CONTEXT);

  //Getting the longest streak of days read
  function getLongestStreak() {
    if (!highlights) return null;

    //Creating an array of all the dates read
    const arrayOfDates = highlights.map(
      (eachHighlight) => eachHighlight.highlight.Date
    );

    //Finding the longest consecutive streak of dates
    const streakInfo = streakRanges({ dates: arrayOfDates });

    const sortedArr = streakInfo.sort((a, b) => b.duration - a.duration);

    return sortedArr[0];
  }

  //Once we have the highlights, we can render the component
  return (
    <div className={styles.HomeStatBanner}>
      {highlights ? (
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
          <div
            className={`${styles.statsBox} ${styles.statsBoxLong}`}
            onClick={() => router.push(`/Book/${highlights[0].book_id}`)}
          >
            <p>Current Read</p>
            <h1>{highlights[0].title}</h1>
            <p>
              Started: {new Date(highlights[0].highlight.Date).toDateString()}
            </p>
          </div>
          <div className={styles.statsBox}>
            <p>Total Highlights</p>
            <h1>{highlights.length}</h1>
            <p>
              {`${new Date(
                highlights[highlights.length - 1].highlight.Date
              ).toDateString()} - ${new Date(
                highlights[0].highlight.Date
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
