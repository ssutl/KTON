import styles from "../styles/Pages/404.module.scss";
import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();

  return (
    <div className={styles.page}>
      <div className={styles.text_container}>
        <h1>404</h1>
        <h2>Ooops!</h2>
        <h2>Page not found</h2>
        <p onClick={() => router.push("/Home")}>Back to homepage</p>
      </div>
    </div>
  );
}
