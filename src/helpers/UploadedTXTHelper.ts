const original_regex_pattern =
  /^(?<Title>.+) \((?<Author>.+)\)\r\n- ((Your Highlight on page (?<Page>\d+) \| location (?<LocationStart>\d+)-(?<LocationEnd>\d+))|(Your Highlight at location (?<LocationStartX>\d+)-(?<LocationEndX>\d+))) \| Added on (?<Date>.+)\r\n\r\n(?<Text>.+)\r\n==========/gim;

// parseContents(txtFileContents);

export interface parsedClippingsEntry {
  [key: string]: any;
  Title: string;
  Author: string;
  LocationStart?: string;
  LocationEnd?: string;
  LocationStartX?: string;
  LocationEndX?: string;
  Date: string;
  Text: string;
  Page?: string;
}

/**
 * removes duplicates from a book's title
 * @param highlightArray
 * @returns
 */
export function checkDuplicate(highlightArray: parsedClippingsEntry[]) {
  const uniqueEntries: parsedClippingsEntry[] = [];

  for (const entry of highlightArray) {
    if (
      !uniqueEntries.some(
        (uniqueEntry) =>
          uniqueEntry.Title === entry.Title &&
          (uniqueEntry.Text.includes(entry.Text) ||
            entry.Text.includes(uniqueEntry.Text))
      )
    ) {
      uniqueEntries.push(entry);
    }
  }

  return uniqueEntries;
}

/**
 *  removes any problematic characters from a book's title
 * @param title
 * @returns
 */
export function convert2SafeTitle(title: string) {
  const tempResult = title.replace(/([!/*?<>|\\,"-.])+/g, "");
  const result = tempResult.replace(/:.*/g, "").trim();
  return result;
}

/**
 * uses regex to extract relevant fields (book title, author, highlights etc) from the txt file
 * @param data - txt file contents
 * @returns array
 */
export function parseContents(
  data: string
): parsedClippingsEntry[] | undefined {
  const extractedInfo = data.matchAll(original_regex_pattern); //using regex to find relevant deets from the txt for each book

  const extractedInfoArray = Array.from(extractedInfo); //creates an array
  if (extractedInfoArray.length === 0) {
    return;
  }
  return extractedInfoArray.map((data) => {
    data.groups!.Title = convert2SafeTitle(data.groups!.Title);
    return JSON.parse(JSON.stringify(data.groups)); //loops through array
  });
}

/**
 * Parses given txt file & checks for duplicates
 */
export function clippingsParser(incomingTxtFileContents: string) {
  if (incomingTxtFileContents == null || !incomingTxtFileContents) {
    return;
  }
  const parsedContent = parseContents(incomingTxtFileContents);
  if (!parsedContent) return;
  const uniqueEntries = checkDuplicate(parsedContent);

  return uniqueEntries;
}

export default clippingsParser;
