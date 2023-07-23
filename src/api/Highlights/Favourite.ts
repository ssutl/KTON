import axios from "axios";

export interface favouriteHighlightApiProps {
  book_id: string;
  highlight_id: string;
  data: boolean;
}

const favouriteHighlightApi = ({
  book_id,
  highlight_id,
  data,
}: favouriteHighlightApiProps) => {
  //Get token
  const authToken = localStorage.getItem("token");

  if (authToken === null) return console.log("No auth token found");

  //Simple request to favourite highlight
  axios({
    method: "PUT",
    url: `${process.env.NEXT_PUBLIC_BACKENDURL}/books/${book_id}/${highlight_id}`,
    headers: {
      "x-auth-token": authToken.replace(/\"/g, ""),
    },
    data: { starred: data },
  })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};
export default favouriteHighlightApi;
