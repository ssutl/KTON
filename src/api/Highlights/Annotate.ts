import axios from "axios";

const annotateHighlightApi = ({ book_id, highlight_id, data }: any) => {
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
    data: { notes: data },
  }).then((res) => {
    console.log(res.data);
  });
};
export default annotateHighlightApi;
