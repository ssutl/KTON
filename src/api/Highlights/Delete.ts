import axios from "axios";

const deleteHighlightApi = ({ book_id, highlight_id, data }: any) => {
  //make an axios request to the backend to delete a highlight
  const authToken = localStorage.getItem("token");

  if (authToken === null) return console.log("No auth token found");

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
