import React, { useEffect, useState, useContext } from "react";
import styles from "../styles/HeatMapBanner.module.scss";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import CalenderFunctions from "../helpers/CalanderFunctions";
import userAuthenticated from "@/helpers/UserAuthenticated";
import { Book, Meta_con_highlight } from "@/api/Interface";
import { streakRanges } from "date-streaks";
import { group } from "console";
import { KTON_CONTEXT } from "../context/KTONContext";
import HeatMapDataFunc from "@/helpers/HeatmapDataFunc";
import clippings_AllHighlights from "./Clippings_AllHighlights";

//interface HeatMapBannerProps {}

const HeatMapBanner = () => {
  const { highlights } = useContext(KTON_CONTEXT);
  const today = new Date();
  const { shiftDate } = CalenderFunctions();
  const [heatMapData, setHeatMapData] = useState<
    { date: string; count: number }[] | undefined
  >(undefined);

  //Getting grouped data
  useEffect(() => {
    if (userAuthenticated() && highlights) {
      setHeatMapData(HeatMapDataFunc(highlights));
    } else {
      const clippings = localStorage.getItem("clippings");
      setHeatMapData(HeatMapDataFunc(clippings_AllHighlights(clippings)));
    }
  }, []);

  if (heatMapData) {
    return (
      <div className={styles.HeatMapBanner}>
        <div className={styles.HeatMapContainer}>
          <CalendarHeatmap
            startDate={shiftDate(today, -535)}
            endDate={today}
            values={heatMapData}
            // classForValue={(value: any) => {
            //   return `color-scale-${
            //     Math.ceil(
            //       value.count
            //         .toExponential()
            //         .substring(0, value.count.toExponential().indexOf("e"))
            //     ) > 3
            //       ? 4
            //       : Math.ceil(
            //           value.count
            //             .toExponential()
            //             .substring(0, value.count.toExponential().indexOf("e"))
            //         )
            //   }`;
            // }}
            showWeekdayLabels={false}
          />
        </div>
      </div>
    );
  } else return <h1>Component Loading</h1>;
};

export default HeatMapBanner;
