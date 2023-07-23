import axios from "axios";
import { error } from "console";

export interface uploadBooksProps {
  formData: FormData;
}

export type ImportBooksReturnType = "Started" | "Complete" | "None";

const ImportBooksApi = async ({
  formData,
}: uploadBooksProps): Promise<ImportBooksReturnType> => {
  //Get token
  const authToken = localStorage.getItem("token");

  if (authToken === null) throw new Error("No auth token found");

  try {
    //Simple request to update User annotations
    const upload = await axios({
      method: `POST`,
      url: `${process.env.NEXT_PUBLIC_BACKENDURL}/upload`,
      headers: {
        "x-auth-token": authToken.replace(/\"/g, ""),
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });

    return "Complete";
  } catch (err) {
    return "None";
  }
};
export default ImportBooksApi;
