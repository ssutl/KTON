import styles from "../styles/SiteDescription.module.scss";
import { useEffect, useState } from "react";

const SiteDescription = () => {
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    //Have to set screenwidth to conditionally change size of heat map
    setScreenWidth(window.innerWidth);
    window.addEventListener("resize", () => setScreenWidth(window.innerWidth));
  }, []);
  return (
    <div className={styles.siteDescSect}>
      <p>
        KTON is an innovative platform designed to streamline the organization
        and management of all Kindle imports. With KTON, users can effortlessly
        annotate, view, export, and analyze their reading habits.
      </p>
      <p>
        For both non-logged in users and logged in users, KTON offers a
        convenient way to access and view their Kindle statistics and reading
        data, however users who are yet to login cannot edit or annotate or save
        any of their imported highlights.
      </p>
      <p>
        If you&#39;re enjoying the platform and want to make the most of your
        digital library, ensure to log in so that all your books can be
        organized in one place. By logging in, you unlock the full potential of
        KTON&#39;s features, allowing you to seamlessly manage and access your
        Kindle imports. With a personalized account, you can create custom
        collections, categorize your books, and easily search for specific
        titles or authors.
      </p>
      {screenWidth < 1024 ? null : (
        <>
          <p>
            KTON provides detailed reading insights and analytics to help you
            understand your reading habits and patterns. Gain insights into your
            reading speed, the number of books read per month, popular genres,
            and more. These analytics can assist you in setting reading goals,
            tracking your progress, and improving your reading efficiency.
          </p>
          <p>
            KTON is committed to enhancing the user experience by regularly
            updating and improving its features. As the platform evolves, you
            can expect to benefit from new functionalities, enhanced
            performance, and an overall better ebook management experience.
          </p>
        </>
      )}
    </div>
  );
};

export default SiteDescription;
