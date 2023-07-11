import axios from "axios";

//Edit below function to annotate a highlight

const notionApi = (auth_code: string) => {
  //make an axios request to the backend to annotate a highlight
  const authToken = localStorage.getItem("token");

  if (authToken === null) return console.log("No auth token found");

  //Call the notion
  //   https://api.notion.com/v1/oauth/token

  const key_secret = `${process.env.NEXT_PUBLIC_oauth_client_id}:${process.env.NEXT_PUBLIC_oauth_client_secret}`;
  const key_secret_encoded = Buffer.from(key_secret, "ascii");
  const b64_encoded_key = key_secret_encoded.toString("base64");

  axios({
    method: "POST",
    url: "https://api.notion.com/v1/oauth/token",
    headers: {
      Authorization: `Basic ${b64_encoded_key}`,
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    data: {
      grant_type: "authorization_code",
      code: auth_code,
      redirect_uri: process.env.NEXT_PUBLIC_redirect_uri,
    },
  }).then((res) => {
    console.log("res: ", res);
    //Now we wanna do sheninigans with permisions
  });

  //call the db
};
export default notionApi;
