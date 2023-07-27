import axios from "axios";

export interface userFeedbackApiProps {
  user: string;
  text: string;
  satisfaction: "Happy" | "Neutral" | "Sad";
  category: "Error" | "General";
}
const userFeedbackApi = async (data: userFeedbackApiProps) => {
  //Get token
  const authToken = localStorage.getItem("token");

  if (authToken === null) throw new Error("No token found");

  //Simple request to update summaries
  try {
    const response = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BACKENDURL}/feedback`,
      headers: {
        "x-auth-token": authToken.replace(/\"/g, ""),
      },
      data: data,
    });

    return "Feedback sent";
  } catch (err) {
    throw new Error("Failed sending feedback");
  }
};
export default userFeedbackApi;
