import styles from "../styles/HomeStatBanner.module.scss";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import userAuthenticated from "@/helpers/UserAuthenticated";
import { KTON_CONTEXT } from "../context/KTONContext";
import { streakRanges, summary } from "date-streaks";
import { Book, Meta_con_highlight } from "@/api/Interface";
import clippings_AllHighlights from "./Clippings_AllHighlights";

//interface HomeStatBannerProps {}

export default function HomeStatBanner() {
  const { highlights } = useContext(KTON_CONTEXT);

  const [main_highlights, setMain_highlights] = useState<
    Meta_con_highlight[] | undefined
  >();

  useEffect(() => {
    if (!userAuthenticated()) {
      const clippings = localStorage.getItem("clippings");
      setMain_highlights(clippings_AllHighlights(clippings));
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
    return <h1>Banner</h1>;
  } else return <h1>Component Loading </h1>;
}
