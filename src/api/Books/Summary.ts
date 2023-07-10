import axios from "axios";

//Edit below function to annotate a highlight

const summariseBookApi = ({ book_id, data }: any) => {
  //make an axios request to the backend to annotate a highlight
  const authToken = localStorage.getItem("token");

  if (authToken === null) return console.log("No auth token found");

  axios({
    method: "PUT",
    url: `${process.env.NEXT_PUBLIC_BACKENDURL}/books/${book_id}`,
    headers: {
      "x-auth-token": authToken.replace(/\"/g, ""),
    },
    data: { summary: data },
  }).then((res) => {
    console.log(res.data);
  });
};
export default summariseBookApi;
