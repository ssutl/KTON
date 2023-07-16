import verifyUserApi from "@/api/Users/VerifyUser";
import { useRouter } from "next/router";
import { useEffect } from "react";

const VerificationPage = () => {
  const router = useRouter();
  const id = router.query.id;

  useEffect(() => {
    if (id) {
      verifyUserApi({ id: id[0], token: id[1] });
    }
  }, [id]);

  return <div>{id}</div>;
};

export default VerificationPage;
