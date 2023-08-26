import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ResponseObject, playlist } from "@/types";
import SongList from "@/components/song-list";
import { getPlaylist } from "@/lib/client/crud";
import dateFormat from "dateformat";
import { useSession, signIn, signOut } from "next-auth/react";

export default function PlaylistPage() {
  const router = useRouter();
  const { update, data, status } = useSession();
  const { id } = router.query;

  const [playlist, setPlaylist] = useState<playlist | undefined>(undefined);
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
    console.log("Songs:", playlist?.songs || []);
  }, [playlist]);
  const numSongs = playlist?.songs.length || 0;
  const totalDuration =
    playlist?.songs
      .map((song) => song.duration)
      .reduce((partialSum, a) => partialSum + a, 0) || 0;

  const durationHours = Math.floor(totalDuration / 3600);
  const durationMinutes = Math.round((totalDuration % 3600) / 60);
  const formattedDuration = `${durationHours} hr ${durationMinutes} min`;

  if (status == "authenticated") {
    return (
      <main className="p-24 w-screen">
        {loading && <h1 className="text-3xl">Loading...</h1>}
        {error && <h1 className="text-3xl">Error: {error}</h1>}
        {playlist && (
          <div className="flex flex-col justify-center">
            <h4 className="mt-0 mb-2 uppercase text-gray-500 tracking-widest text-xs">
              Playlist
            </h4>
            <div className="flex flex-row justify-between">
              <h1 className="mt-0 mb-2 text-black font-semibold dark:text-white text-4xl">
                {playlist.name}
              </h1>
              <div className="justify-items-end">
                <button className="font-semibold mr-2 inline-flex bg-yellow-600 text-white items-center py-1 px-4 rounded-full gap-x-2 hover:bg-yellow-800">
                  SYNC
                </button>
                <button className="font-semibold mr-2 inline-flex bg-orange-600 text-white items-center py-1 px-4 rounded-full gap-x-2 hover:bg-orange-800">
                  SHARE
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-white w-4 h-4 "
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.033 6.966c.584.583.584 1.529 0 2.112l-7.955 7.956c-.583.583-1.529.583-2.112 0-.583-.583-.583-1.529 0-2.112l7.956-7.956c.582-.583 1.528-.583 2.111 0zm-9.138 13.386c-1.171 1.171-3.076 1.171-4.248 0-1.171-1.171-1.171-3.077 0-4.248l5.639-5.632c-1.892-.459-3.971.05-5.449 1.528l-2.147 2.147c-2.254 2.254-2.254 5.909 0 8.163 2.254 2.254 5.909 2.254 8.163 0l2.147-2.148c1.477-1.477 1.986-3.556 1.527-5.448l-5.632 5.638zm6.251-18.662l-2.146 2.148c-1.478 1.478-1.99 3.553-1.53 5.445l5.634-5.635c1.172-1.171 3.077-1.171 4.248 0 1.172 1.171 1.172 3.077 0 4.248l-5.635 5.635c1.893.459 3.968-.053 5.445-1.53l2.146-2.147c2.254-2.254 2.254-5.908 0-8.163-2.253-2.254-5.908-2.254-8.162-.001z" />
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-gray-600 text-m">
              {numSongs} songs, {formattedDuration}
            </p>
            <p className="text-gray-600 text-sm pb-5">
              Last synced:{" "}
              {dateFormat(playlist.updated_at, "dddd, mmmm dS, yyyy")}
              {/*
            {"   -   "}
            Created: {dateFormat(playlist.created_at, "dddd, mmmm dS, yyyy")}
      */}
            </p>

            <SongList songs={playlist.songs} />
          </div>
        )}
      </main>
    );
  } else if (status == "loading") {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div role="status" className="flex flex-row">
          <svg
            aria-hidden="true"
            className="w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-orange-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="font-medium text-3xl ml-2 sr-only">Loading</span>
        </div>
      </main>
    );
  }
  // if unauthenticated
  return (
    <>
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
      <main className="p-24 w-screen">
        {loading && <h1 className="text-3xl">Loading...</h1>}
        {error && <h1 className="text-3xl">Error: {error}</h1>}
        {playlist && (
          <div className="flex flex-col justify-center">
            <h4 className="mt-0 mb-2 uppercase text-gray-500 tracking-widest text-xs">
              Playlist
            </h4>
            <div className="flex flex-row justify-between">
              <h1 className="mt-0 mb-2 text-black dark:text-white text-4xl">
                {playlist.name}
              </h1>
            </div>
            <p className="text-gray-600 text-m">
              {numSongs} songs, {formattedDuration}
            </p>
            <p className="text-gray-600 text-sm pb-5">
              Last synced:{" "}
              {dateFormat(playlist.updated_at, "dddd, mmmm dS, yyyy")}
              {/*
            {"   -   "}
            Created: {dateFormat(playlist.created_at, "dddd, mmmm dS, yyyy")}
      */}
            </p>

            <SongList songs={playlist.songs} />
          </div>
        )}
      </main>
    </>
  );
}
