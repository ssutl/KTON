import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>KTON: Kindle Highlight Manager</title>
        <meta
          name="description"
          content="A platform to organise, annotate and export your imported kindle highlights 📖📝"
        />

        <meta property="og:url" content="https://www.kton.xyz/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="KTON: Kindle Highlight Manager" />
        <meta
          property="og:description"
          content="A platform to organise, annotate and export your imported kindle highlights 📖📝"
        />
        <meta
          property="og:image"
          content="https://app.kton.xyz/images/SEO-image1.jpg"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="kton.xyz" />
        <meta property="twitter:url" content="https://www.kton.xyz/" />
        <meta name="twitter:title" content="KTON: Kindle Highlight Manager" />
        <meta
          name="twitter:description"
          content="A platform to organise, annotate and export your imported kindle highlights 📖📝"
        />
        <meta
          name="twitter:image"
          content="https://app.kton.xyz/images/SEO-image1.jpg"
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
