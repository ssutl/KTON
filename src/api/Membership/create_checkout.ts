import axios, { AxiosResponse } from "axios";

export interface createCheckoutProps {
  price_id: string;
  success_url: string;
  cancel_url: string;
  stripe_customer_id: string;
}

export type createCheckoutReturnTypes = Promise<string>;

//API TO CREATE CHECKOUT SESSION FOR STRIPE

const createCheckout = async ({
  price_id,
  success_url,
  cancel_url,
  stripe_customer_id,
}: createCheckoutProps): createCheckoutReturnTypes => {
  //Get token
  const authToken = localStorage.getItem("token");

  //If token is null, throw error, only authed users can  upgrade to premium
  if (authToken === null) throw new Error("No token found");

  // Simple request to call create checkout session endpoint
  try {
    const response: AxiosResponse<any> = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BACKENDURL}/create-checkout-session`,
      headers: {
        "x-auth-token": authToken.replace(/\"/g, ""),
        "Access-Control-Allow-Origin": "*",
      },
      data: { priceId: price_id, success_url, cancel_url, stripe_customer_id },
    });

    //The checkout session url is returned, which the user is redirected to
    const url: string = response.data;
    return url;
  } catch (err) {
    throw new Error("Failed to create checkout session");
  }
};

export default createCheckout;
