import styles from "../styles/LoadingPage.module.scss";

const LoadingPage: React.FC<{ Text: string }> = ({ Text }) => {
  return (
    <div className={styles.loading}>
      <h1 className={styles.text}>{Text}</h1>
    </div>
  );
};

export default LoadingPage;
