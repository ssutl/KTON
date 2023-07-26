import axios from "axios";

export interface changeBookImageApiProps {
  book_id: string;
  data: string;
}

const changeBookImageApi = ({ book_id, data }: changeBookImageApiProps) => {
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
    data: { cover_image: data },
  }).then((res) => {
    console.log(res.data);
  });
};
export default changeBookImageApi;
