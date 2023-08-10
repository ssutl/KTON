import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name={"description"}
          title={"description"}
          content="A platform to organise, annotate and export your kindle highlights 📖📝"
        />
        <meta name={"og:title"} title={"og:title"} content="KTON" />
        <meta
          name={"og:description"}
          title={"og:description"}
          content="A platform to organise, annotate and export your kindle highlights 📖📝"
        />
        <meta
          name={"og:image"}
          title={"og:image"}
          content="%PUBLIC_URL%/image/laptop.png"
        />

        {
          //Fav icon
        }
        <link rel="icon" href="/image/bookIcon.png" />

        <link rel="shortcut icon" href="%PUBLIC_URL%/image/bookIcon.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="%PUBLIC_URL%/image/bookIcon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="%PUBLIC_URL%/image/bookIcon.png"
        />
        <link rel="apple-touch-icon" sizes="512x512" href="bookIcon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
