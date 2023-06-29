import styles from "../styles/HomeStatBanner.module.scss";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import userAuthenticated from "@/helpers/UserAuthenticated";
import { KTON_CONTEXT } from "../context/KTONContext";
import { streakRanges, summary } from "date-streaks";
import { Book, Meta_con_highlight } from "@/api/Interface";

//interface HomeStatBannerProps {}

export default function HomeStatBanner() {
  const { highlights } = useContext(KTON_CONTEXT);

  const [restrictions, setRestrictions] = useState(true);
  const [main_highlights, setMain_highlights] = useState<
    Meta_con_highlight[] | undefined
  >();

  useEffect(() => {
    setRestrictions(!userAuthenticated());

    if (!userAuthenticated()) {
      const clippings = localStorage.getItem("clippings");
      if (clippings) {
        const parsedClippings: Book[] = JSON.parse(clippings);

        const clippings_highlights: Meta_con_highlight[] = [];

        //Converting the clippings to intended form
        parsedClippings.map((eachBook) => {
          eachBook.highlights.map((eachHiglight) =>
            clippings_highlights.push({
              title: eachBook.title,
              author: eachBook.author,
              highlight: eachHiglight,
            })
          );
        });

        setMain_highlights(clippings_highlights);
      }
    } else {
      setMain_highlights(highlights);
    }
  }, []);

  function getLongestStreak() {
    if (main_highlights) {
      const groupedDates = main_highlights.map(
        (eachHighlight) => eachHighlight.highlight.Date
      );
      const streakInfo = streakRanges({ dates: groupedDates });

      const sortedArr = streakInfo.sort((a, b) => b.duration - a.duration);

      return sortedArr[0];
    }
  }

  if (main_highlights) {
    return (
      <div className={styles.banner}>
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
  } else return null;
}
