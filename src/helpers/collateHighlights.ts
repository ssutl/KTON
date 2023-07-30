import { parsedClippingsEntry } from "./UploadedTXTHelper";

interface IHighlight {
  deleted: boolean;
  Text: string;
  Page?: number;
  LocationStart?: number | null;
  LocationEnd?: number | null;
  LocationStartX?: number | null;
  LocationEndX?: number | null;
  Date: string;
  notes: string;
  starred: boolean;
  category: string[];
  last_updated: string;
}

interface extractedClippingsData {
  [key: string]: any;
  Title?: string;
  Author?: string;
  LocationStart?: number;
  LocationEnd?: number;
  LocationStartX?: number;
  LocationEndX?: number;
  Date: string;
  Text: string;
  Page?: number;
}

export interface formattedBook {
  highlights: Array<IHighlight>;
  author: string;
  title: string;
  genre: string[];
  rating: string;
  summary: string;
}

/**
 * converts unsighlty object into an array of books in the desired format
 */
export function organiseResults(messyObj: { [key: string]: formattedBook }) {
  const uselessTitles = Object.keys(messyObj);

  return uselessTitles.map((crappyTitle) => {
    return messyObj[crappyTitle];
  });
}
/**
 * Groups books by the desired property (books in this case) and then formats the result into semi final form ready for organising
 *
 * @param objectArray
 * @param property
 * @returns
 */
export function prepBookForDB(
  objectArray: parsedClippingsEntry[],
  property: keyof parsedClippingsEntry
) {
  return objectArray.reduce(function (accumulatedItems, currentItem) {
    //goes through each object in the array

    let key: string = currentItem[property]; //takes property and uses it to obtain key

    key = JSON.stringify(key, null, 2); //key is an obj in this case so it get's stringified
    if (!(key in accumulatedItems)) {
      accumulatedItems[key] = {
        author: currentItem.Author!,
        title: currentItem.Title!,
        genre: [],
        rating: "",
        summary: "",
        highlights: [],
      };
    }
    accumulatedItems[key]["author"] = currentItem.Author!;
    accumulatedItems[key]["title"] = currentItem.Title!;
    accumulatedItems[key]["genre"] = [];
    accumulatedItems[key]["rating"] = "";
    accumulatedItems[key]["summary"] = "";
    accumulatedItems[key]["highlights"].push({
      notes: "",
      starred: false,
      ...(currentItem.LocationStart !== undefined && {
        LocationStart: Number(currentItem.LocationStart),
      }),
      ...(currentItem.LocationStartX !== undefined && {
        LocationStartX: Number(currentItem.LocationStartX),
      }),
      ...(currentItem.LocationEnd !== undefined && {
        LocationEnd: Number(currentItem.LocationEnd),
      }),
      ...(currentItem.LocationEndX !== undefined && {
        LocationEndX: Number(currentItem.LocationEndX),
      }),
      Date: currentItem.Date,
      Text: currentItem.Text,
      deleted: false,
      category: [],
      ...(currentItem.Page !== undefined && { Page: Number(currentItem.Page) }),
      last_updated: ``,
    });
    return accumulatedItems;
  }, {} as { [key: string]: formattedBook });
}

/**
 * Takes in the parsed clippings data array, formats and then saves the resultant file on the server
 */
export function collateHighlights(
  incomingData: parsedClippingsEntry[] | undefined
) {
  if (incomingData == null || incomingData.length == 0) {
    return;
  }
  const result = prepBookForDB(incomingData, "Title");
  //calls the function "groupBy" passing in the object as the first parameter and the object property or key that we want to group by
  const organisedResults = organiseResults(result);

  sessionStorage.setItem("clippings", JSON.stringify(organisedResults));
}

export default collateHighlights;
