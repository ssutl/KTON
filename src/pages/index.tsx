import Tag from "@/components/Tag";
import styles from "../styles/Landing.module.scss";
import ImportButton from "@/components/ImportButton";
import { useEffect } from "react";
import Router from "next/router";
import Head from "next/head";

export default function Landing() {
  //Kindle Overlay image
  const Kindle = () => {
    return (
      <div className={styles.kindleOverlay}>
        <div className={styles.screen}>
          <h3>1</h3>
          <p>
            {" "}
            Praesent faucibus libero leo, eu tincidunt elit molestie at. Quisque
            erat urna, efficitur non viverra eget, mollis id felis. Aenean sit
            amet venenatis eros. Nullam euismod ultrices aliquam. Donec
            tristique vel elit eu mollis.
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

  //UseEffect to check if there's already an authToken
  useEffect(() => {
    const authToken = localStorage.getItem("token");
    const clippings = localStorage.getItem("clippings");

    if (authToken || clippings) {
      // Pass user into the app
      Router.push("Home");
    }
  }, []);

  return (
    <>
      <Head>
        <title>Landing</title>
      </Head>
      <div className={styles.main}>
        <div className={styles.main_left}>
          <div className={styles.section1}>
            <ul>
              <li>A website designed to organise your kindle highlights</li>
            </ul>
          </div>
          <div className={styles.section2}>
            <p>
              KTON is an innovative platform designed to streamline the
              organization and management of all Kindle imports. With KTON,
              users can effortlessly annotate, view, export, and analyze their
              reading habits.
            </p>
            <p>
              For both non-logged in users and logged in users, KTON offers a
              convenient way to access and view their Kindle statistics and
              reading data, however users who are yet to login cannot edit or
              annotate or save any of their imported highlights.
            </p>
            <p>
              If you&#39;re enjoying the platform and want to make the most of
              your digital library, ensure to log in so that all your books can
              be organized in one place. By logging in, you unlock the full
              potential of KTON&#39;s features, allowing you to seamlessly
              manage and access your Kindle imports. With a personalized
              account, you can create custom collections, categorize your books,
              and easily search for specific titles or authors.
            </p>
          </div>
          <div className={styles.section3}>
            <Tag name="SSUTL" />
            <Tag name="CITRUS" />
          </div>
        </div>
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
          <div className={styles.importSect}>
            <div className={styles.importInfoSect}>
              <h3>IMPORT YOUR CLIPPINGS</h3>
              <p>Locate &#34;Clippings.txt&#34;</p>
            </div>
            <div className={styles.importButtonSect}>
              <ImportButton />
            </div>
            <div className={styles.importProgressSect}>
              <p>
                <span>Current Book </span>
                <span>N/A</span>
              </p>
              <p>
                <span>Progress </span>
                <span>N/A</span>
              </p>
              <p>
                <span>Estimated Time </span>
                <span>N/A</span>
              </p>
            </div>
          </div>
        </div>
        <Kindle />
      </div>
    </>
  );
}
