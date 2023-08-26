import type { AppProps } from "next/app";
import { Montserrat } from "next/font/google";
import Script from "next/script";

import "@/styles/globals.css";
import { DeveloperTokenProvider } from "@/lib/client/DeveloperTokenContext";
import { MusicKitProvider } from "@/lib/client/MusicKitContext";
import { SessionProvider } from "next-auth/react";

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
        <DeveloperTokenProvider>
          <SessionProvider session={session}>
            <div className={montserrat.className}>
              <Component {...pageProps} />
            </div>
          </SessionProvider>
        </DeveloperTokenProvider>
      </MusicKitProvider>
    </>
  );
}
