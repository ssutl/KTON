import React, { useContext, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  Label,
} from "recharts";
import styles from "../../styles/Components/MostReadBanner.module.scss";
import { KTON_CONTEXT } from "../../context/KTONContext";
import {
  groupByDay,
  groupByMonth,
  groupByTime,
} from "@/helpers/MostOftenReadHelper";
import { CustomTooltip } from "./CustomToolTip";

const MostReadBanner = () => {
  const { highlights } = useContext(KTON_CONTEXT);
  const [dataSelection, setDataSelection] = useState<"Month" | "Day" | "Time">(
    "Month"
  );
  const [data, setData] = useState<{
    data: {
      name: string;
      count: number;
    }[];
    max: string;
  }>();

  useEffect(() => {
    if (!highlights) return;

    const filteredHighlights = highlights.filter(
      (eachHighlight) => eachHighlight.highlight.deleted === false
    );

    switch (dataSelection) {
      case "Month":
        setData(groupByMonth(filteredHighlights));
        break;
      case "Day":
        setData(groupByDay(filteredHighlights));
        break;
      case "Time":
        setData(groupByTime(filteredHighlights));
        break;
    }
  }, [dataSelection, highlights]);

  if (!data)
    return (
      <div className={styles.MostReadBanner}>
        <div className={styles.loading}></div>
      </div>
    );

  return (
    <div className={styles.MostReadBanner}>
      <div className={styles.modalContainer}>
        <div className={styles.graphHeader}>
          <div className={styles.maxReadSection}>
            <h3>{data.max}</h3>
          </div>
          <div className={styles.dataButtonSection}>
            <p
              className={dataSelection === "Month" ? styles.active : ""}
              onClick={() => setDataSelection("Month")}
            >
              Month
            </p>
            <p
              className={dataSelection === "Day" ? styles.active : ""}
              onClick={() => setDataSelection("Day")}
            >
              Day
            </p>
            <p
              className={dataSelection === "Time" ? styles.active : ""}
              onClick={() => setDataSelection("Time")}
            >
              Time
            </p>
          </div>
        </div>
        <div className={styles.graphContainer}>
          <ResponsiveContainer>
            <AreaChart data={data?.data}>
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3fcdfc" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3fcdfc" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dy={5} dataKey="name" tick={{ fill: "#ffffff" }} />
              <YAxis dx={-25} dataKey="count" tick={{ fill: "#ffffff" }} />
              <CartesianGrid strokeDasharray="8 8" />
              <Tooltip
                content={<CustomTooltip dataSelection={dataSelection} />}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#3fcdfc"
                fillOpacity={1}
                fill="url(#colorUv)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MostReadBanner;
