import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Script from "next/script";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <Script src="https://js-cdn.music.apple.com/musickit/v1/musickit.js" />
      <Script id="musickit-load">{`
          document.addEventListener("musickitloaded", () => {
            fetch("/api/token")
              .then((res) => res.json())
              .then(({ token }) => {
                MusicKit.configure({
                  developerToken: token,
                  app: {
                    name: "Playlist Sync",
                    build: "1978.4.1",
                  },
                });
              });
          });
      `}</Script>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
}
