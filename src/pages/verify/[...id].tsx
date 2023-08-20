import verifyUserApi from "@/api/Users/VerifyUser";
import AllowedRoute from "@/helpers/AllowedRoute";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Router from "next/router";
import styles from "../../styles/Pages/verify.module.scss";

const VerificationPage = () => {
  const router = useRouter();
  const id = router.query.id;
  const [verified, setVerified] = useState<boolean>(false);

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
          throw new Error("Failed to verify user");
        }
      }
    };

    verifyUser();
  }, [id]);

  return (
    <div className={styles.verifyPage}>
      <h1 id={!verified ? styles.loading : ""}>
        {verified ? `Verified G` : `Waiting for verification`}
      </h1>
    </div>
  );
};

export default VerificationPage;
