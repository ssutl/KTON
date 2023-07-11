import axios from "axios";

//Edit below function to annotate a highlight

const notionApi = (auth_code: string) => {
  //make an axios request to the backend to annotate a highlight
  const authToken = localStorage.getItem("token");

  if (authToken === null) return console.log("No auth token found");

  const clientId = process.env.NEXT_PUBLIC_oauth_client_id;
  const clientSecret = process.env.NEXT_PUBLIC_oauth_client_secret;
  const redirectUri = process.env.OAUTH_REDIRECT_URI;

  const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  axios({
    method: "POST",
    url: "https://api.notion.com/v1/oauth/token",
    headers: {
      Authorization: `Basic ${encoded}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    data: {
      grant_type: "authorization_code",
      code: auth_code,
      redirect_uri: redirectUri,
    },
  }).then((res) => {
    console.log("res: ", res);
    //Now we wanna do sheninigans with permisions
  });

  //call the db
};
export default notionApi;
