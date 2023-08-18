import axios from "axios";

export interface deleteHighlightApiProps {
  book_id: string;
  highlight_id: string;
  data: boolean;
}

//API TO DELETE HIGHLIGHT
const deleteHighlightApi = async ({
  book_id,
  highlight_id,
  data,
}: deleteHighlightApiProps) => {
  //Get token
  const authToken = localStorage.getItem("token");

  //If token is null, throw error
  if (authToken === null) throw new Error("No token found");

  //Simple request to delete highlight
  try {
    axios({
      method: "PUT",
      url: `${process.env.NEXT_PUBLIC_BACKENDURL}/books/${book_id}/${highlight_id}`,
      headers: {
        "x-auth-token": authToken.replace(/\"/g, ""),
      },
      data: { deleted: true },
    });
  } catch (err) {
    throw new Error("Failed deleting highlight");
  }
};
export default deleteHighlightApi;
