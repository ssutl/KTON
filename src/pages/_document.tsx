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
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
