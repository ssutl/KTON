import axios from "axios";

export interface addHighlightApiProps {
  book_id: string;
  highlight_id: string;
  data: string[];
}

const addHighlightCategoryApi = async ({
  book_id,
  highlight_id,
  data,
}: addHighlightApiProps) => {
  //Get token
  const authToken = localStorage.getItem("token");

  if (authToken === null) throw new Error("No token found");

  //Simple request to update highlight annotations
  try {
    axios({
      method: "PUT",
      url: `${process.env.NEXT_PUBLIC_BACKENDURL}/books/${book_id}/${highlight_id}`,
      headers: {
        "x-auth-token": authToken.replace(/\"/g, ""),
      },
      data: { category: data },
    });
  } catch (err) {
    throw new Error("Failed adding category to highlight");
  }
};
export default addHighlightCategoryApi;
