import styles from "../../styles/Components/HomeStatBanner.module.scss";
import React, { useState, useEffect, useContext } from "react";
import { KTON_CONTEXT } from "../../context/KTONContext";
import { useRouter } from "next/router";
import { Meta_con_highlight } from "@/api/Interface";

function HomeStatBanner() {
  //These are the highlights in context, which only authenticated users will have
  //We'll conditionally push either local clippings or context highlights to this state
  const router = useRouter();
  const { highlights } = useContext(KTON_CONTEXT);

  function getlongestStreak(): {
    CurrentLongestStreak: number;
    LongestStreakStart: string;
    LongestStreakEnd: string;
  } | null {
    if (!highlights) return null;

    let CurrentLongestStreak = 0;
    let CurrentCount = 0;
    let CurrentStreakStart = "";
    let LongestStreakStart = "";
    let LongestStreakEnd = "";

    const reducedHighlights = reduceHighlightsToOnePerDay().sort(function (
      a: any,
      b: any
    ) {
      return (
        new Date(b.highlight.Date).getTime() -
        new Date(a.highlight.Date).getTime()
      );
    });

    reducedHighlights.reverse().map((meta_highlight, i) => {
      if (i < reducedHighlights.length - 1) {
        const dateOfNextHighlight = formatDateString(
          reducedHighlights[i + 1].highlight.Date
        );
        const nextDayOfCurrentHighlight = getNextDay(
          formatDateString(meta_highlight.highlight.Date)
        );

        if (dateOfNextHighlight === nextDayOfCurrentHighlight) {
          if (CurrentCount === 0) {
            // Set the start of the streak if it's not already set
            CurrentStreakStart = meta_highlight.highlight.Date;
          }
          CurrentCount++;
        } else {
          if (CurrentCount > CurrentLongestStreak) {
            CurrentLongestStreak = CurrentCount;
            LongestStreakStart = CurrentStreakStart;
            LongestStreakEnd = meta_highlight.highlight.Date;
          }

          // Reset current count and streak start for the next strea
          CurrentCount = 0;
          CurrentStreakStart = "";
        }
      }
    });

    return {
      CurrentLongestStreak,
      LongestStreakStart,
      LongestStreakEnd,
    };
  }

  function reduceHighlightsToOnePerDay(): Meta_con_highlight[] {
    if (!highlights || highlights.length === 0) return [];

    const dateMap = new Map<string, Meta_con_highlight>();

    // Store the first highlight of each date in the dateMap
    for (const highlight of highlights) {
      const dateString = formatDateString(highlight.highlight.Date);
      if (!dateMap.has(dateString)) {
        dateMap.set(dateString, highlight);
      }
    }

    // Extract the values (unique highlights) from the dateMap and return as an array
    return Array.from(dateMap.values());
  }

  const formatDateString = (date: string) => {
    return date.split(" ").slice(1, 4).join(" ");
  };

  function getNextDay(dateString: string): string {
    // dateString = "16 Feb 2021"
    var day = new Date(dateString);
    var nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);

    // Custom formatting function for the date
    function formatDate(date: Date): string {
      const day = date.getDate().toString().padStart(2, "");

      // Array of month names starting from January (index 0) to December (index 11)
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const month = monthNames[date.getMonth()];
      const year = date.getFullYear().toString();

      return `${day} ${month} ${year}`;
    }

    return formatDate(nextDay);
  }

  if (!highlights)
    return (
      <div className={styles.HomeStatBanner}>
        <div className={styles.StatWidthContainer}>
          <div className={styles.loading}></div>
          <div className={styles.loading}></div>
          <div className={styles.loading}></div>
        </div>
      </div>
    );

  const streakData = getlongestStreak();

  //Once we have the highlights, we can render the component

  if (!streakData) return null;

  return (
    <div className={styles.HomeStatBanner}>
      <div className={styles.StatWidthContainer}>
        <div className={styles.statsBox}>
          <p>Longest Streak</p>
          <h1>{streakData?.CurrentLongestStreak}</h1>
          <p>{`${new Date(
            streakData.LongestStreakStart
          ).toDateString()} - ${new Date(
            streakData.LongestStreakEnd
          ).toDateString()}`}</p>
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
      </div>
    </div>
  );
}

export default React.memo(HomeStatBanner);
