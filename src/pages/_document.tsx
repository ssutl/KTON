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
          content="https://kton.xyz%PUBLIC_URL%/SEO Image.jpg"
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
          content="https://kton.xyz%PUBLIC_URL%/SEO Image.jpg"
        />

        <link rel="icon" href="/path/to/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
