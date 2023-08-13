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
      <div className={styles.graphContainer}>
        <div className={styles.graphHeader}>
          <div className={styles.maxReadSection}>
            <h2 className="p-large" id="max-read">
              {data.max}
            </h2>
          </div>
          <div className={styles.dataButtonSection}>
            <p onClick={() => setDataSelection("Month")}>Month</p>
            <p onClick={() => setDataSelection("Day")}>Day</p>
            <p onClick={() => setDataSelection("Time")}>Time</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height="70%">
          <AreaChart
            data={data?.data}
            margin={{ top: 0, right: 35, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3fcdfc" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3fcdfc" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis dataKey="count" />

            <CartesianGrid strokeDasharray="5 5" />
            <Tooltip />
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
  );
};

export default MostReadBanner;
