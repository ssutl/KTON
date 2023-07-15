import { useRouter } from "next/router";

const VerificationPage = () => {
  const router = useRouter();
  const id = router.query.id;

  return <div>{id}</div>;
};

export default VerificationPage;
