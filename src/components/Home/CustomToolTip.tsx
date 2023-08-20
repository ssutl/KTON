import styles from "../../styles/Components/CustomToolTip.module.scss";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any;
  label?: string;
  dataSelection: "Month" | "Day" | "Time";
}

export const CustomTooltip = ({
  active,
  payload,
  label,
  dataSelection,
}: CustomTooltipProps) => {
  function getNextHour(inputTime: string) {
    try {
      // Parse the input time string
      const [hourStr, minuteStr] = inputTime.split(":");
      const hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);

      // Increment the hour by 1
      let nextHour = hour + 1;

      // Handle overflow to the next day
      if (nextHour === 24) {
        nextHour = 0;
      }

      // Return the next hour in "HH:MM" format
      const formattedNextHour = `${String(nextHour).padStart(2, "0")}:${String(
        minute
      ).padStart(2, "0")}`;
      return formattedNextHour;
    } catch (error) {
      return "Invalid input format. Please use 'HH:MM'.";
    }
  }

  if (active && payload && payload.length && label) {
    const text =
      dataSelection === "Month"
        ? `During the month of ${label}, you have made a total of ${payload[0].value} highlights`
        : dataSelection === "Day"
        ? `On ${label}'s, you have made a total of ${payload[0].value} highlights`
        : `Between the hours of ${label} and ${getNextHour(
            label
          )}, you have made a total of ${payload[0].value} highlights`;

    return (
      <div className={styles.CustomToolTip}>
        <p className={styles.label}>{text}</p>
      </div>
    );
  }

  return null;
};
