import axios from "axios";

const addHighlightCategoryApi = ({
  book_id,
  highlight_id,
  data,
}: {
  book_id: any;
  highlight_id: string;
  data: string[];
}) => {
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
  }).then((res) => {
    console.log(res.data);
  });
};
export default addHighlightCategoryApi;
