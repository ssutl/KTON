import axios from "axios";

const deleteHighlightApi = ({ book_id, highlight_id, data }: any) => {
  //Get token
  const authToken = localStorage.getItem("token");

  if (authToken === null) return console.log("No auth token found");

  //Simple request to delete highlight
  axios({
    method: "PUT",
    url: `${process.env.NEXT_PUBLIC_BACKENDURL}/books/${book_id}/${highlight_id}`,
    headers: {
      "x-auth-token": authToken.replace(/\"/g, ""),
    },
    data: { deleted: data },
  }).then((res) => {
    console.log(res.data);
  });
};
export default deleteHighlightApi;
