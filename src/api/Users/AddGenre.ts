import { colorMapKeys } from "@/helpers/sortGenreColors";
import axios from "axios";

export interface addGenreToUserApiProps {
  data: { [key: string]: colorMapKeys };
}

const addGenreToUserApi = ({ data }: addGenreToUserApiProps) => {
  //Get token
  const authToken = localStorage.getItem("token");

  if (authToken === null) throw new Error("No token found");

  //Simple request to update summaries
  try {
    axios({
      method: "PUT",
      url: `${process.env.NEXT_PUBLIC_BACKENDURL}/users/info`,
      headers: {
        "x-auth-token": authToken.replace(/\"/g, ""),
      },
      data: { genres: data },
    });
  } catch (err) {
    throw new Error("Failed adding genre to user");
  }
};
export default addGenreToUserApi;
