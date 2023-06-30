import { Meta_con_highlight } from "@/api/Interface";
import userAuthenticated from "./UserAuthenticated";

export default function HeatMapDataFunc(
  highlights: Meta_con_highlight[] | undefined
) {
  const data: { date: string; count: number }[] = [];

  if (highlights) {
    highlights.map((eachHighlight) => {
      if (
        data.filter(
          (eachObj) =>
            eachObj.date.split(" ").slice(0, 4).join(" ") ===
            eachHighlight.highlight.Date.split(" ").slice(0, 4).join(" ")
        ).length === 0
      ) {
        data.push({
          date: eachHighlight.highlight.Date.split(" ").slice(0, 4).join(" "),
          count: 0,
        });
      }
    });

    data.map((eachObj) => {
      highlights.map((eachHighlight) => {
        if (
          eachObj.date.split(" ").slice(0, 4).join(" ") ===
          eachHighlight.highlight.Date.split(" ").slice(0, 4).join(" ")
        ) {
          eachObj.count = eachObj.count + 1;
        }
      });
    });
  }

  return data;
}
