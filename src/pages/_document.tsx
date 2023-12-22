import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html
      lang="en"
      className="bg-white text-black dark:bg-black dark:text-white"
    >
      <Head />
      <body>
        <Script
          src="https://js-cdn.music.apple.com/musickit/v1/musickit.js"
          strategy="beforeInteractive"
        />
        <Script id="musickit-load" strategy="beforeInteractive">{`
          document.addEventListener("musickitloaded", () => {
            fetch("/api/token")
              .then((res) => res.json())
              .then(({ token }) => {
                return MusicKit.configure({
                  developerToken: token,
                  app: {
                    name: "Playlist Sync",
                    build: "0.0.1",
                  },
                });
              });
          });
      `}</Script>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
