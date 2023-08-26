import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Script from "next/script";

import "@/styles/globals.css";
import { MusicKitProvider } from "@/lib/client/MusicKitContext";

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
                    build: "0.0.1",
                  },
                });
              });
          });
      `}</Script>
      <MusicKitProvider>
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </MusicKitProvider>
    </>
  );
}
