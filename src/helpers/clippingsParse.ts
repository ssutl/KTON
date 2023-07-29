import parsedData from "./UploadedTXTHelper";
import collateHighlights from "./collateHighlights";

import fs from "fs";

/**
 *  Helper function that reads the txt file, calls collateHighlights() function and add multiple book function with relevant params
 * @param {string} uploadedTxtPath
 * @param {number} userID
 */

async function uploadedTxtHelper(Contents: string) {
  try {
    // const txtFileContents = fs.readFileSync(uploadedTxtPath, "utf-8");
    const parsedContents = parsedData(Contents);
    if (!parsedContents) throw new Error("No highlights found in txt file");
    collateHighlights(parsedContents); //parse & collate
    return true;
  } catch (error) {
    throw new Error("Failed parsing txt file");
    return false;
  }
}
export default uploadedTxtHelper;
