import verifyUserApi from "@/api/Users/VerifyUser";
import { useRouter } from "next/router";
import { useEffect } from "react";

const VerificationPage = () => {
  const router = useRouter();
  const id = router.query.id;

  useEffect(() => {
    if (typeof id === "string") {
      verifyUserApi(id);
    }
  }, [id]);

  return <div>{id}</div>;
};

export default VerificationPage;
