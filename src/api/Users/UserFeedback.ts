import axios from "axios";

export interface userFeedbackApiProps {
  user: string;
  text: string;
  satisfaction: "Happy" | "Neutral" | "Sad";
  category: "Error" | "General";
}

//API TO SEND USER FEEDBACK
const userFeedbackApi = async (data: userFeedbackApiProps) => {
  //Get token
  const authToken = localStorage.getItem("token");

  //If token is null, throw error, only authed users can send feedback
  if (authToken === null) throw new Error("No token found");

  //Simple request to hit feedback endpoint
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
