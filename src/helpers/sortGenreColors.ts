export type colorMapKeys =
  | "pink"
  | "red"
  | "purple"
  | "blue"
  | "green"
  | "yellow"
  | "orange"
  | "brown";
export type ColorMap = Record<colorMapKeys, string>;

function genreColors() {
  const mapTable: ColorMap = {
    red: "#DA5552",
    pink: "#F4978E",
    purple: "#8B85C1",
    blue: "#3fcdfc",
    green: "#69995D",
    yellow: "#E3B23C",
    orange: "#D98324",
    brown: "#9E6240",
  };

  //Quick lil function to convert color names to hex
  const colorConverter = (name: colorMapKeys) => {
    const hex = mapTable[name];
    return hex;
  };

  //Quick lil function to generate random colors
  const randomColorGenerator = () => {
    const array: colorMapKeys[] = Object.keys(mapTable) as colorMapKeys[];
    const randomColor = array[(array.length * Math.random()) << 0];
    return { hex: mapTable[randomColor], color: randomColor };
  };

  return { colorConverter, randomColorGenerator, mapTable };
}

export default genreColors;
