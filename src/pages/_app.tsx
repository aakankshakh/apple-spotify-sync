import type { AppProps } from "next/app";
import { Montserrat } from "next/font/google";

import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { MusicAPI } from "@/lib/client/ContextProviders/MusicAPIContext";

// If loading a variable font, you don't need to specify the font weight
const montserrat = Montserrat({ subsets: ["latin"] });

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <SessionProvider session={session}>
        <MusicAPI>
          <div className={montserrat.className}>
            <Component {...pageProps} />
          </div>
        </MusicAPI>
      </SessionProvider>
    </>
  );
}
