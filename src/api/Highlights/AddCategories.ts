import axios from "axios";

export interface addHighlightCategoryApiProps {
  book_id: string;
  highlight_id: string;
  data: string[];
}

//API TO ADD CATEGORY TO HIGHLIGHT

const addHighlightCategoryApi = async ({
  book_id,
  highlight_id,
  data,
}: addHighlightCategoryApiProps) => {
  //Get token
  const authToken = localStorage.getItem("token");

  //If token is null, throw error
  if (authToken === null) throw new Error("No token found");

  //Simple request to add update category field of highlights
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
