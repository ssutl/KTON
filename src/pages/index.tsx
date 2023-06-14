import Navbar from "@/components/Navbar";
import styles from "../styles/Landing.module.scss";

export default function Landing() {
  const Kindle = () => {
    return (
      <div className={styles.kindleOverlay}>
        <div className={styles.screen}></div>
      </div>
    );
  };
  return (
    <>
      <Navbar />
      <div className={styles.header}>
        <div className={styles.headerWidth}>
          <p>OVER 10,000 IMPORTED HIGHLIGHTS</p>
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.main_left}></div>
        <div className={styles.main_right}>
          <div className={styles.siteDescSect}>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a
              pretium lacus.Aenean quis dui at nunc aliquet sollicitudin ac sit
              amet lacus.
            </p>
            <p>
              Praesent faucibus libero leo, eu tincidunt elit molestie at.
              Quisque erat urna, efficitur non viverra eget, mollis id felis.
              Aenean sit amet venenatis eros. Nullam euismod ultrices aliquam.
              Donec tristique vel elit eu mollis.
            </p>
            <p>
              {" "}
              Nullam consectetur sem justo, nec semper quam commodo non. Nulla
              et vulputate sem, quis placerat justo. Nullam dapibus tellus sit
              amet neque malesuada condimentum. Aliquam blandit sollicitudin
              urna, nec mollis nulla porta rhoncus. Quisque tristique tincidunt
              euismod. Vestibulum porta dui nec gravida aliquam.
            </p>
          </div>
          <div className={styles.importSect}></div>
        </div>
        <Kindle />
      </div>
    </>
  );
}
