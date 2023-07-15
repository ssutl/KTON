import styles from "../styles/KindleOverlay.module.scss";

const KindleOverlay = () => {
  return (
    <div className={styles.kindleOverlay}>
      <div className={styles.screen}>
        <h3>1</h3>
        <p>
          {" "}
          Praesent faucibus libero leo, eu tincidunt elit molestie at. Quisque
          erat urna, efficitur non viverra eget, mollis id felis. Aenean sit
          amet venenatis eros. Nullam euismod ultrices aliquam. Donec tristique
          vel elit eu mollis.
        </p>
        <p>
          Nullam consectetur sem justo, nec semper quam commodo non. Nulla et
          vulputate sem, quis placerat justo. Nullam dapibus tellus sit amet
          neque malesuada condimentum. Aliquam blandit sollicitudin urna, nec
          mollis nulla porta rhoncus.
        </p>
      </div>
      <p>Kindle</p>
    </div>
  );
};

export default KindleOverlay;
