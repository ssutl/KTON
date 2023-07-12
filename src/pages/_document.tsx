import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="KTON" content="Organise your kindle highlights" />
        <meta name="keywords" content="Organisation tools" />
        <link rel="icon" href="/Resources/Logo.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
