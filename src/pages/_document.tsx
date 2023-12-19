import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>KTON: Kindle Highlight Manager</title>
        <meta
          name="description"
          content="An all in one highlight manager for your e-books. We‘ll help you organise, annotate and export your kindle highlights. Join us with a free forever account and then optionally upgrade your plan to unlock more features. Finding your highlights made easy, happy reading with KTON! 📖📝"
        />

        <meta property="og:url" content="https://www.app.kton.xyz/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="KTON: Kindle Highlight Manager" />
        <meta
          property="og:description"
          content="An all in one highlight manager for your e-books. We‘ll help you organise, annotate and export your kindle highlights. Join us with a free forever account and then optionally upgrade your plan to unlock more features. Finding your highlights made easy, happy reading with KTON! 📖📝"
        />
        <meta
          property="og:image"
          content="https://app.kton.xyz/images/SEO-image.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="kton.xyz" />
        <meta property="twitter:url" content="https://www.app.kton.xyz/" />
        <meta name="twitter:title" content="KTON: Kindle Highlight Manager" />
        <meta
          name="twitter:description"
          content="An all in one highlight manager for your e-books. We‘ll help you organise, annotate and export your kindle highlights. Join us with a free forever account and then optionally upgrade your plan to unlock more features. Finding your highlights made easy, happy reading with KTON! 📖📝"
        />
        <meta
          name="twitter:image"
          content="https://app.kton.xyz/images/SEO-image.png"
        />

        <link rel="icon" href="/images/bookIcon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
