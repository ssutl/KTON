import axios from "axios";

export interface createCheckoutProps {
  price_id: string;
  success_url: string;
  cancel_url: string;
}

// export type c =
//   | "Pending verification"
//   | "Invalid Credentials"
//   | "Password must be at least 8 characters long"
//   | undefined;

const createCheckout = async ({
  price_id,
  success_url,
  cancel_url,
}: createCheckoutProps) => {
  //Get token
  const authToken = localStorage.getItem("token");

  if (authToken === null) throw new Error("No token found");

  //Simple request to update highlight annotations
  try {
    const url = axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BACKENDURL}/create-checkout-session`,
      headers: {
        "x-auth-token": authToken.replace(/\"/g, ""),
        "Access-Control-Allow-Origin": "*",
      },
      data: { priceId: price_id, success_url, cancel_url },
    });

    return url;
  } catch (err) {
    console.log("err: ", err);
    throw new Error("Failed to create checkout session");
  }
};
export default createCheckout;
