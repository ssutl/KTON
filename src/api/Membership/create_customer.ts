import axios, { AxiosResponse } from "axios";

export interface createCustomerProps {
  price_id: string;
  success_url: string;
  cancel_url: string;
}

export type createCustomerReturnTypes = Promise<string>;

const createCustomer = async ({
  price_id,
  success_url,
  cancel_url,
}: createCustomerProps): createCustomerReturnTypes => {
  //Get token
  const authToken = localStorage.getItem("token");

  if (authToken === null) throw new Error("No token found");

  // Simple request to update highlight annotations
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

export default createCustomer;
