import axios from "axios";

const addUserCategoryApi = ({ data }: { data: string[] }) => {
  //Get token
  const authToken = localStorage.getItem("token");

  if (authToken === null) return console.log("No auth token found");

  //Simple request to update User annotations
  axios({
    method: "PUT",
    url: `${process.env.NEXT_PUBLIC_BACKENDURL}/users/info`,
    headers: {
      "x-auth-token": authToken.replace(/\"/g, ""),
    },
    data: { categories: data },
  })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};
export default addUserCategoryApi;
