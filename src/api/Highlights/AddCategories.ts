import axios from "axios";

export interface addHighlightApiProps {
  book_id: string;
  highlight_id: string;
  data: string[];
}

const addHighlightCategoryApi = ({
  book_id,
  highlight_id,
  data,
}: addHighlightApiProps) => {
  //Get token
  const authToken = localStorage.getItem("token");

  if (authToken === null) return console.log("No auth token found");

  //Simple request to update highlight annotations
  axios({
    method: "PUT",
    url: `${process.env.NEXT_PUBLIC_BACKENDURL}/books/${book_id}/${highlight_id}`,
    headers: {
      "x-auth-token": authToken.replace(/\"/g, ""),
    },
    data: { category: data },
  })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};
export default addHighlightCategoryApi;
