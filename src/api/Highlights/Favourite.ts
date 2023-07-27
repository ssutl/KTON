import axios from "axios";

export interface favouriteHighlightApiProps {
  book_id: string;
  highlight_id: string;
  data: boolean;
}

const favouriteHighlightApi = async ({
  book_id,
  highlight_id,
  data,
}: favouriteHighlightApiProps) => {
  //Get token
  const authToken = localStorage.getItem("token");

  if (authToken === null) throw new Error("No token found");

  //Simple request to favourite highlight
  try {
    axios({
      method: "PUT",
      url: `${process.env.NEXT_PUBLIC_BACKENDURL}/books/${book_id}/${highlight_id}`,
      headers: {
        "x-auth-token": authToken.replace(/\"/g, ""),
      },
      data: { starred: data },
    });
  } catch (err) {
    throw new Error("Failed favouriting highlight");
  }
};
export default favouriteHighlightApi;
