import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Script from "next/script";

import "@/styles/globals.css";
import { MusicKitProvider } from "@/lib/client/MusicKitContext";

import { Montserrat } from "next/font/google";

// If loading a variable font, you don't need to specify the font weight
const montserrat = Montserrat({ subsets: ["latin"] });

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <Script src="https://js-cdn.music.apple.com/musickit/v1/musickit.js" />
      <Script id="musickit-load">{`
          document.addEventListener("musickitloaded", () => {
            if (window.MK_DEVELOPER_TOKEN) {
              MusicKit.configure({
                developerToken: MK_DEVELOPER_TOKEN,
                app: {
                  name: "Playlist Sync",
                  build: "0.0.1",
                },
              });
            }
            else {
              fetch("/api/token")
                .then((res) => res.json())
                .then(({ token }) => {
                  window.MK_DEVELOPER_TOKEN = token;
                  MusicKit.configure({
                    developerToken: token,
                    app: {
                      name: "Playlist Sync",
                      build: "0.0.1",
                    },
                  });
                });
            }
          });
      `}</Script>
      <MusicKitProvider>
        <SessionProvider session={session}>
          <div className={montserrat.className}>
            <Component {...pageProps} />
          </div>
        </SessionProvider>
      </MusicKitProvider>
    </>
  );
}
