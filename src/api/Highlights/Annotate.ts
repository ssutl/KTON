import axios from "axios";

//API TO ANNOTATE HIGHLIGHT

const annotateHighlightApi = async ({
  book_id,
  highlight_id,
  data,
}: {
  book_id: string;
  highlight_id: string;
  data: string;
}) => {
  //Get token
  const authToken = localStorage.getItem("token");

  //If token is null, throw error
  if (authToken === null) throw new Error("No token found");

  //Simple request to add note to highlight
  try {
    axios({
      method: "PUT",
      url: `${process.env.NEXT_PUBLIC_BACKENDURL}/books/${book_id}/${highlight_id}`,
      headers: {
        "x-auth-token": authToken.replace(/\"/g, ""),
      },
      data: { notes: data },
    });
  } catch (err) {
    throw new Error("Failed annotating highlight");
  }
};
export default annotateHighlightApi;
