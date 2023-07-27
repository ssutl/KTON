import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="KTON" content="Organise your kindle highlights" />
        <meta name="keywords" content="Organisation tools" />

        <link rel="icon" href="/images/book-icon.png" />
        <meta
          name="viewport"
          content="width=device-width,height=device-height,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover, shrink-to-fit=no"
        />
        <meta name="theme-color" content="#000000" />

        {/* <!-- HTML Meta Tags --> */}
        <meta
          name="description"
          content="A platform to organise, annotate and export your kindle highlights 📖📝"
        />

        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content="https://kton.xyz/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Highlight Manager" />
        <meta
          property="og:description"
          content="A platform to organise, annotate and export your kindle highlights 📖📝"
        />
        <meta property="og:image" content="%PUBLIC_URL%/S-Image.jpg" />

        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="kton.xyz" />
        <meta property="twitter:url" content="https://kton.xyz/" />
        <meta name="twitter:title" content="Kindle Manager" />
        <meta
          name="twitter:description"
          content="A platform to organise, annotate and export your kindle highlights 📖📝"
        />
        <meta name="twitter:image" content="%PUBLIC_URL%/Image.jpg" />

        {/* <!-- Meta Tags Generated via https://www.opengraph.xyz -->

        <!--
      manifest.json provides metadata used when your web app is installed on a
      user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
    --> */}
        <link rel="apple-touch-icon" sizes="512x512" href="book-icon.png" />

        {/* <!--
      Notice the use of %PUBLIC_URL% in the tags above.
      It will be replaced with the URL of the `public` folder during the build.
      Only files inside the `public` folder can be referenced from the HTML.

      Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
      work correctly both with client-side routing and a non-root public URL.
      Learn how to configure a non-root public URL by running `npm run build`.
    --> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
