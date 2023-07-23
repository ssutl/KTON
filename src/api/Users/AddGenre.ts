import { colorMapKeys } from "@/helpers/sortGenreColors";
import axios from "axios";

export interface addGenreToUserApiProps {
  data: { [key: string]: colorMapKeys };
}

const addGenreToUserApi = ({ data }: addGenreToUserApiProps) => {
  //Get token
  const authToken = localStorage.getItem("token");

  if (authToken === null) return console.log("No auth token found");

  //Simple request to update summaries
  axios({
    method: "PUT",
    url: `${process.env.NEXT_PUBLIC_BACKENDURL}/users/info`,
    headers: {
      "x-auth-token": authToken.replace(/\"/g, ""),
    },
    data: { genres: data },
  }).then((res) => {
    console.log(res.data);
  });
};
export default addGenreToUserApi;
