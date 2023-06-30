import React, { useEffect, useState, useContext } from "react";
import styles from "../styles/HeatMapBanner.module.scss";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import CalenderFunctions from "../helpers/CalanderFunctions";
import userAuthenticated from "@/helpers/UserAuthenticated";
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
            classForValue={(value) => {
              if (!value) {
                return styles["color-empty-light"];
              }
              const count = Math.ceil(
                value.count
                  .toExponential()
                  .substring(0, value.count.toExponential().indexOf("e"))
              );
              return styles[`color-scale-${count > 3 ? 4 : count}`];
            }}
            showWeekdayLabels={false}
          />
        </div>
      </div>
    );
  } else return <h1>Component Loading</h1>;
};

export default HeatMapBanner;
