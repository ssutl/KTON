import axios from "axios";

export interface markAsAnnotatedApiProps {
  book_id: string;
  data: boolean;
}

//API TO MARK BOOK AS ANNOTATED

const markAsAnnotatedApi = async ({
  book_id,
  data,
}: markAsAnnotatedApiProps) => {
  //Get token
  const authToken = localStorage.getItem("token");

  //If token is null, throw error
  if (authToken === null) throw new Error("No token found");

  //Simple request to update cover image
  try {
    axios({
      method: "PUT",
      url: `${process.env.NEXT_PUBLIC_BACKENDURL}/books/${book_id}`,
      headers: {
        "x-auth-token": authToken.replace(/\"/g, ""),
      },
      data: { annotated: data },
    });
  } catch (err) {
    console.log(err);
    throw new Error("Failed changing book image");
  }
};
export default markAsAnnotatedApi;
