import styles from "../styles/SiteDescription.module.scss";
import { useEffect, useState } from "react";

const SiteDescription = () => {
  const [screenWidth, setScreenWidth] = useState(1024);

  useEffect(() => {
    //Have to set screenwidth to conditionally change size of heat map
    setScreenWidth(window.innerWidth);
    window.addEventListener("resize", () => setScreenWidth(window.innerWidth));
  }, []);

  return (
    <div className={styles.siteDescSect}>
      <p>
        For us, there was was no point in highlighting and growing our digital
        library, if we couldn&#39;t easily search, edit and annotate specific
        parts of it.
      </p>
      <p>
        We wanted more control and ease of refrence to the quotes we wanted to
        quote, so we built KTON.
      </p>
      <p>
        For everyone KTON will provide the free tools to manage your digital
        library, the goal is to be the only tool you needed for your kindle
        highlights.
      </p>
      <p>
        Embrace the pleasure of effortless organization, comprehensive
        annotation, and seamless access to your Kindle imports. Join us today
        and embark on a new chapter in your reading journey. With KTON, you can
        efficiently manage your digital library, easily annotate your favorite
        passages, and enjoy a seamless reading experience with all your Kindle
        imports at your fingertips. Happy reading with KTON!
      </p>
    </div>
  );
};

export default SiteDescription;
