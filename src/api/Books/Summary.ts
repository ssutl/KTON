import axios from "axios";

export interface summariseBookApiProps {
  book_id: string;
  data: string;
}

//Simple API to summarise book

const summariseBookApi = async ({ book_id, data }: summariseBookApiProps) => {
  //Get token
  const authToken = localStorage.getItem("token");

  if (authToken === null) throw new Error("No token found");

  //Simple request to update summaries
  try {
    const res = await axios({
      method: "PUT",
      url: `${process.env.NEXT_PUBLIC_BACKENDURL}/books/${book_id}`,
      headers: {
        "x-auth-token": authToken.replace(/\"/g, ""),
      },
      data: { summary: data },
    });
  } catch (err) {
    throw new Error("Failed summarising book");
  }
};
export default summariseBookApi;
