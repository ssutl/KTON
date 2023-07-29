import verifyUserApi from "@/api/Users/VerifyUser";
import AllowedRoute from "@/helpers/AllowedRoute";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Router from "next/router";

const VerificationPage = () => {
  const router = useRouter();
  const id = router.query.id;
  const [verified, setVerified] = useState<boolean>(false);

  useEffect(() => {
    //check if this is an allowed route
    AllowedRoute();
  }, []);

  //On page load verify user with the id and token in the url
  useEffect(() => {
    const verifyUser = async () => {
      if (id) {
        try {
          const status = await verifyUserApi({ id: id[0], token: id[1] });

          //Once verified, token would be in local storage and user would be redirected to import page
          if (status === "verified") {
            setVerified(true);
            Router.push("/Import");
          }
        } catch (err) {
          throw err;
        }
      }
    };

    verifyUser();
  }, [id]);

  return (
    <div>
      <h1>{verified ? `Verified G` : `Waiting for verification`}</h1>
    </div>
  );
};

export default VerificationPage;
