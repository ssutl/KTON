import axios, { AxiosResponse } from "axios";

export interface createportalProps {
  customer_id: string;
}

export type createportalReturnTypes = Promise<string>;

//API TO CREATE portal SESSION FOR STRIPE

const createPortal = async ({
  customer_id,
}: createportalProps): createportalReturnTypes => {
  //Get token
  const authToken = localStorage.getItem("token");

  //If token is null, throw error, only authed users can  upgrade to premium
  if (authToken === null) throw new Error("No token found");

  // Simple request to call create portal session endpoint
  try {
    const response: AxiosResponse<any> = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BACKENDURL}/create-customer-portal-session`,
      headers: {
        "x-auth-token": authToken.replace(/\"/g, ""),
        "Access-Control-Allow-Origin": "*",
      },
      data: { customerId: customer_id },
    });

    //The portal session url is returned, which the user is redirected to
    const url: string = response.data;
    return url;
  } catch (err) {
    throw new Error("Failed to create portal session");
  }
};

export default createPortal;
