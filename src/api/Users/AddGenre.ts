import { colorMapKeys } from "@/helpers/sortGenreColors";
import axios from "axios";

export interface addGenreToUserApiProps {
  data: { [key: string]: colorMapKeys };
}

//Simple API to update the genre of the user

const addGenreToUserApi = ({ data }: addGenreToUserApiProps) => {
  //Get token
  const authToken = localStorage.getItem("token");

  //If token is null, throw error
  if (authToken === null) throw new Error("No token found");

  //Simple request to update the genre on the user, this will be options for the user to choose from when adding genres to books
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
