import axios from "axios";
import { error } from "console";

export interface uploadBooksProps {
  formData: FormData;
}

export type ImportBooksReturnType = "Started" | "Complete" | "None";

//API TO IMPORT BOOKS

const ImportBooksApi = async ({
  formData,
}: uploadBooksProps): Promise<ImportBooksReturnType> => {
  //Get token
  const authToken = localStorage.getItem("token");

  //If token is null, throw error
  if (authToken === null) throw new Error("No auth token found");

  //Async request to upload books, when complete, return "Complete"
  try {
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
    // return "None";
    throw new Error("Failed uploading books");
  }
};
export default ImportBooksApi;
