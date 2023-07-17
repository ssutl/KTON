import verifyUserApi from "@/api/Users/VerifyUser";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const VerificationPage = () => {
  const router = useRouter();
  const id = router.query.id;
  const [verified, setVerified] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      verifyUserApi({ id: id[0], token: id[1] })
        .then(() => {
          setVerified(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [id]);

  return (
    <div>
      <h1>{verified ? `Verified G` : `Waiting for verification`}</h1>
    </div>
  );
};

export default VerificationPage;
