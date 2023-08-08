import styles from "../../styles/Components/LoadingPage.module.scss";

const LoadingPage: React.FC<{ Text: string }> = ({ Text }) => {
  //This is a generic loading page for each page of the site, i.e home, library, etc
  return (
    <div className={styles.loading}>
      <h1 className={styles.text}>{Text}</h1>
    </div>
  );
};

export default LoadingPage;
