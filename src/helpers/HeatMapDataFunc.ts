import { Meta_con_highlight } from "@/api/Interface";

export default function HeatMapDataFunc(
  highlights: Meta_con_highlight[] | undefined
) {
  if (!highlights) {
    return [];
  }

  const data: { [date: string]: { date: string; count: number } } = {};

  highlights.forEach((eachHighlight) => {
    const dateKey = eachHighlight.highlight.Date.split(" ")
      .slice(0, 4)
      .join(" ");
    if (!data[dateKey]) {
      data[dateKey] = { date: dateKey, count: 0 };
    }
    data[dateKey].count += 1;
  });

  return Object.values(data);
}
