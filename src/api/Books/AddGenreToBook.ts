import axios from "axios";

export interface addGenreToBookApiProps {
  book_id: string;
  data: string[];
}

const addGenreToBookApi = ({ book_id, data }: addGenreToBookApiProps) => {
  //Get token
  const authToken = localStorage.getItem("token");

  if (authToken === null) return console.log("No auth token found");

  //Simple request to update summaries
  axios({
    method: "PUT",
    url: `${process.env.NEXT_PUBLIC_BACKENDURL}/books/${book_id}`,
    headers: {
      "x-auth-token": authToken.replace(/\"/g, ""),
    },
    data: { genre: data },
  }).then((res) => {
    console.log(res.data);
  });
};
export default addGenreToBookApi;
