import { Meta_con_highlight } from "@/api/Interface";

type weekType =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";
type monthType =
  | "january"
  | "february"
  | "march"
  | "april"
  | "may"
  | "june"
  | "july"
  | "august"
  | "september"
  | "october"
  | "november"
  | "december";

export const groupByDay = function (xs: Meta_con_highlight[]) {
  // Initialize an empty array to store grouped data and a variable for the final sentence
  const data: { name: string; count: number }[] = [];
  let sentence = "";

  // Use reduce to group the array of Meta_con_highlight objects by the specified key
  const array = Object.entries(
    xs.reduce(function (rv: any, x) {
      // Access the value of the specified key ("Date") in the highlight object of the current Meta_con_highlight object
      const day = x.highlight["Date"].split(",")[0]; // Extract the day value

      // Add the current Meta_con_highlight object to the array associated with the extracted day value
      // If the array doesn't exist for this day, create a new array
      (rv[day] = rv[day] || []).push(x);

      // Return the modified result value (rv) for the next iteration
      return rv;
    }, {})
  );

  // 'array' now contains an array of arrays, where each inner array groups Meta_con_highlight objects by the specified key

  // Define a sorter object to map day names to their corresponding numeric values
  const sorter = {
    // "sunday": 0, // << if Sunday is the first day of the week
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 7,
  };

  // Map the grouped data to calculate the count for each day and push it to the 'data' array
  array.map((each: any) => data.push({ name: each[0], count: each[1].length }));

  // Find the day(s) with the maximum count
  const maxArray = data
    .filter(
      (eachObj) => eachObj.count === Math.max(...data.map((each) => each.count))
    )
    .map((eachObj) => eachObj.name);

  // Generate the sentence based on whether there's one or multiple days with the maximum count
  if (maxArray.length === 1) {
    // Checking if the array has only one day
    sentence = `You read most often on ${maxArray[0]}'s`;
  } else {
    // Multiple days with the same maximum count
    const lastDay = maxArray.pop();
    sentence = `You read most often on the days: ${maxArray.join(
      ", "
    )} and ${lastDay}`;
  }

  return {
    // Sort the grouped data by day using the sorter object
    data: data.sort(function sortByDay(a, b) {
      const day1 = a.name.toLowerCase();
      const day2 = b.name.toLowerCase();
      return (
        sorter[day1 as keyof typeof sorter] -
        sorter[day2 as keyof typeof sorter]
      );
    }),
    max: sentence, // Return the generated sentence as part of the result
  };
};

export const groupByMonth = function (xs: Meta_con_highlight[]) {
  const data: { name: string; count: number }[] = [];
  let sentence = "";

  const array = Object.entries(
    xs.reduce(function (rv: any, x) {
      (rv[x.highlight["Date"].split(",")[1].trim().split(" ")[1]] =
        rv[x.highlight["Date"].split(",")[1].trim().split(" ")[1]] || []).push(
        x
      );
      return rv;
    }, {})
  );

  const sorter = {
    // "sunday": 0, // << if sunday is first day of week
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
  };

  array.map((each: any) => data.push({ name: each[0], count: each[1].length }));

  const maxArray = data
    .filter(
      (eachObj) => eachObj.count === Math.max(...data.map((each) => each.count))
    )
    .map((eachObj) => eachObj.name);

  if (maxArray.length === 1) {
    //Checking if array has only one day
    sentence = `You read most often during the month of ${maxArray[0]}`;
  } else {
    const lastMonth = maxArray.pop();
    sentence = `You read most often during the months: ${
      maxArray.join(", ") + " and " + lastMonth
    }`;
  }

  return {
    data: data.sort(function sortByDay(a, b) {
      const month1 = a.name.toLowerCase();
      const month2 = b.name.toLowerCase();
      return sorter[month1 as monthType] - sorter[month2 as monthType];
    }),
    max: sentence,
  };
};

export const groupByTime = function (xs: Meta_con_highlight[]) {
  const data: { name: string; count: number }[] = [];
  let sentence = "";

  const array = Object.entries(
    xs.reduce(function (rv: any, x) {
      (rv[
        x.highlight["Date"].split(",")[1].trim().split(" ")[3].split(":")[0]
      ] =
        rv[
          x.highlight["Date"].split(",")[1].trim().split(" ")[3].split(":")[0]
        ] || []).push(x);
      return rv;
    }, {})
  );

  array.map((each: any) =>
    data.push({ name: each[0] + ":00", count: each[1].length })
  );

  let maxArray = data
    .filter(
      (eachObj) => eachObj.count === Math.max(...data.map((each) => each.count))
    )
    .map((eachObj) => eachObj.name);

  if (maxArray.length === 1) {
    //Checking if array has only one day
    sentence = `You read most often between ${
      maxArray[0] + "-" + ((parseInt(maxArray[0]) + 1) % 24).toString() + ":00"
    }`;
  } else {
    maxArray = maxArray.map(
      (eachTime) =>
        eachTime + "-" + ((parseInt(eachTime) + 1) % 24).toString() + ":00"
    );

    const lastTime = maxArray.pop();

    sentence = `You read most often between the hours: ${
      maxArray.join(" ,") + " and " + lastTime
    }`;
  }

  return {
    data: data.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    }),
    max: sentence,
  };
};
