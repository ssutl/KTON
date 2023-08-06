import axios, { AxiosResponse } from "axios";

export interface createCustomerProps {
  price_id: string;
  success_url: string;
  cancel_url: string;
}

export type createCustomerReturnTypes = Promise<string>;

//API TO CREATE CHECKOUT SESSION FOR STRIPE

const createCustomer = async ({
  price_id,
  success_url,
  cancel_url,
}: createCustomerProps): createCustomerReturnTypes => {
  //Get token
  const authToken = localStorage.getItem("token");

  //If token is null, throw error, only authed users can upgrade to premium
  if (authToken === null) throw new Error("No token found");

  // Simple request to call create customer endpoint
  try {
    const response: AxiosResponse<any> = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BACKENDURL}/create-customer`,
      headers: {
        "x-auth-token": authToken.replace(/\"/g, ""),
        "Access-Control-Allow-Origin": "*",
      },
      data: { priceId: price_id, success_url, cancel_url },
    });

    // The checkout session url is returned, which the user is redirected to
    const url: string = response.data;
    return url;
  } catch (err) {
    console.log("err: ", err);
    throw new Error("Failed to create customer");
  }
};

export default createCustomer;
