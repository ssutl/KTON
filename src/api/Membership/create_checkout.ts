import axios, { AxiosResponse } from "axios";

export interface createCheckoutProps {
  price_id: string;
  success_url: string;
  cancel_url: string;
}

export type createCheckoutReturnTypes = Promise<string>;

const createCheckout = async ({
  price_id,
  success_url,
  cancel_url,
}: createCheckoutProps): createCheckoutReturnTypes => {
  //Get token
  const authToken = localStorage.getItem("token");

  if (authToken === null) throw new Error("No token found");

  // Simple request to update highlight annotations
  try {
    const response: AxiosResponse<any> = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BACKENDURL}/create-checkout-session`,
      headers: {
        "x-auth-token": authToken.replace(/\"/g, ""),
        "Access-Control-Allow-Origin": "*",
      },
      data: { priceId: price_id, success_url, cancel_url },
    });

    //console.log
    console.log("response: ", response.data);

    // Assuming the response contains a "url" property, extract it and return
    const url: string = response.data;
    return url;
  } catch (err) {
    console.log("err: ", err);
    throw new Error("Failed to create checkout session");
  }
};

export default createCheckout;
