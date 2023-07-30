import MembershipCard from "@/components/MembershipCard";
import styles from "../../styles/MembershipPage.module.scss";
import HandleLoginModal from "../../components/HandleLoginModal";

const Membership = () => {
  const { LoginModal, setLoginModal } = HandleLoginModal();

  return (
    <div className={styles.membershipPage}>
      {LoginModal()}
      <MembershipCard type="Preview" setLoginModal={() => setLoginModal()} />
      <MembershipCard type="Free" setLoginModal={() => setLoginModal()} />
      <MembershipCard type="Premium" setLoginModal={() => setLoginModal()} />
    </div>
  );
};

export default Membership;
