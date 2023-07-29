import create_checkout from "@/api/Membership/create_checkout";
import styles from "../../styles/Membership.module.scss";
import { useRouter } from "next/router";

const Membership = () => {
  const router = useRouter();

  return (
    <div className={styles.membershipPage}>
      <div className={styles.membershipContainer}>
        <div className={styles.membershipCard}>
          <p>Unauthorised</p>
        </div>
        <div className={styles.membershipButton}></div>
      </div>
      <div className={styles.membershipContainer}>
        <div className={styles.membershipCard}>
          <p>Authorised</p>
        </div>
        <div className={styles.membershipButton}>
          <p>Login</p>
        </div>
      </div>
      <div className={styles.membershipContainer}>
        <div className={styles.membershipCard}>
          <p>Premium</p>
        </div>
        <div
          className={styles.membershipButton}
          onClick={async () => {
            try {
              const url = await create_checkout({
                price_id: "price_1NUZdSKPa3aWR3Tf7nc1SplP",
                success_url: "http://localhost:3000/Home",
                cancel_url: "http://localhost:3000/",
              });

              //   router.push(url);
            } catch (err) {
              console.log(err);
            }
          }}
        >
          <p>Checkout</p>
        </div>
      </div>
    </div>
  );
};

export default Membership;
