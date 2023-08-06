import axios from "axios";

export interface rateBookApiProps {
  book_id: string;
  data: number;
}

//Simple API to rate book

const rateBookApi = async ({ book_id, data }: rateBookApiProps) => {
  //Get token
  const authToken = localStorage.getItem("token");

  if (authToken === null) throw new Error("No token found");

  //Simple request to update THE RATING
  try {
    axios({
      method: "PUT",
      url: `${process.env.NEXT_PUBLIC_BACKENDURL}/books/${book_id}`,
      headers: {
        "x-auth-token": authToken.replace(/\"/g, ""),
      },
      data: { rating: data },
    });
  } catch (err) {
    throw new Error("Failed rating book");
  }
};
export default rateBookApi;
