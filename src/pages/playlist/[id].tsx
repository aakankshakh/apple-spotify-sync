import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { playlistDBEntry } from "@/types/index";
import { getPlaylist } from "@/lib/client/crud";
import { useSession } from "next-auth/react";
import { PlaylistPreview } from "@/components/playlist-page";
import { NoProviderGate, ProviderGate } from "@/lib/client/Gates/ProviderGate";

export default function PlaylistPage() {
  const router = useRouter();
  const { status } = useSession();
  const { id } = router.query;

  const [playlist, setPlaylist] = useState<playlistDBEntry | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (id === undefined) return;

    getPlaylist(
      id as string,
      (err) => {
        setError(err);
        setLoading(false);
      },
      (playlist) => {
        setPlaylist(playlist);
        setLoading(false);
      }
    );
  }, [id]);

  useEffect(() => {
    console.log("Songs:", playlist?.playlist.songs || []);
  }, [playlist]);

  return (
    <>
      <ProviderGate>
        <PlaylistPreview error={error} playlist={playlist} />
      </ProviderGate>
      <NoProviderGate>
        <div className="absolute h-screen w-screen bg-white/70 dark:bg-black/70">
          <div className="absolute w-1/2 left-1/4 top-1/3 bg-white dark:bg-black p-20 border border-black dark:border-gray-500 rounded-lg">
            <div className="flex flex-col">
              <h2 className="text-3xl font-semibold text-black dark:text-white text-center mb-3">
                Log in to sync this playlist!
              </h2>
              <div className="flex flex-row mx-auto">
                <button
                  type="button"
                  className="text-white bg-[#050708] dark:bg-[#777474] hover:bg-[#050708]/90 dark:hover:bg-[#777474]/60 focus:ring-4 focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 m-3"
                >
                  <svg
                    className="mr-2 -ml-1 w-5 h-5"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="apple"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                  >
                    <path
                      fill="currentColor"
                      d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
                    ></path>
                  </svg>
                  Sign in with Apple
                </button>
                <button
                  type="button"
                  className="text-white bg-[#050708] dark:bg-[#777474] hover:bg-[#050708]/90 dark:hover:bg-[#777474]/60 focus:ring-4 focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 m-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 496 512"
                    className="mr-2 -ml-1 w-5 h-5"
                  >
                    <path
                      fill="#1ed760"
                      d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8Z"
                    />
                    <path d="M406.6 231.1c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3zm-31 76.2c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm-26.9 65.6c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4z" />
                  </svg>
                  Sign in with Spotify
                </button>
              </div>
            </div>
          </div>
        </div>
        <PlaylistPreview error={error} playlist={playlist} />
      </NoProviderGate>
    </>
  );
}
