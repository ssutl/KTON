import React, { useEffect, useState, useContext } from "react";
import styles from "../styles/HeatMapBanner.module.scss";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import CalenderFunctions from "../helpers/CalanderFunctions";
import { KTON_CONTEXT } from "../context/KTONContext";
import HeatMapDataFunc from "@/helpers/HeatMapDataFunc";

//interface HeatMapBannerProps {}

const HeatMapBanner = () => {
  const { highlights } = useContext(KTON_CONTEXT);
  const today = new Date();
  const { shiftDate } = CalenderFunctions();
  const [screenWidth, setScreenWidth] = useState(1024);
  const [displayMode, setDisplayMode] = useState<"portrait" | "landscape">(
    "landscape"
  );

  //Setting display mode on load, because the heatmap is dead and not responsive
  useEffect(() => {
    if (window.matchMedia("(orientation: portrait)").matches) {
      setDisplayMode("portrait");
    }
  }, []);

  useEffect(() => {
    //Have to set screenwidth to conditionally change size of heat map
    setScreenWidth(window.innerWidth);
    window.addEventListener("resize", () => setScreenWidth(window.innerWidth));
    //Helper function to get heatmap data in desired format
  }, []);

  if (!highlights)
    <div className={styles.HeatMapBanner}>
      <div className={styles.loading}></div>
    </div>;

  const heatMapData = HeatMapDataFunc(highlights);

  return (
    <div className={styles.HeatMapBanner}>
      <div className={styles.HeatMapContainer}>
        <CalendarHeatmap
          startDate={shiftDate(
            today,
            displayMode === "portrait" && screenWidth >= 1080
              ? -270
              : screenWidth < 425
              ? -155
              : screenWidth < 1024
              ? -200
              : screenWidth < 2560
              ? -425
              : -450
          )}
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
};

export default HeatMapBanner;
