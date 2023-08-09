import MembershipCard from "@/components/Membership/MembershipCard";
import styles from "../../styles/Pages/MembershipPage.module.scss";
import HandleLoginModal from "../../components/Login/HandleLoginModal";

const Membership = () => {
  const { LoginModal, setLoginModal } = HandleLoginModal();

  return (
    <div className={styles.membershipPage}>
      {LoginModal()}
      <MembershipCard type="Free" setLoginModal={() => setLoginModal()} />
      <MembershipCard type="Premium" setLoginModal={() => setLoginModal()} />
    </div>
  );

  return null;
};

export default Membership;
