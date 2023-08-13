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

    switch (dataSelection) {
      case "Month":
        setData(groupByMonth(highlights));
        break;
      case "Day":
        setData(groupByDay(highlights));
        break;
      case "Time":
        setData(groupByTime(highlights));
        break;
    }
  }, [dataSelection, highlights]);

  if (!data) return null;

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
