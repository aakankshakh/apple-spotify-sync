import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ResponseObject, playlist } from "@/types";
import SongList from "@/components/song-list";
import { getPlaylist } from "@/lib/client/crud";
import dateFormat from "dateformat";

export default function PlaylistPage() {
  const router = useRouter();
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

  return (
    <main className="p-24 w-screen">
      {loading && <h1 className="text-3xl">Loading...</h1>}
      {error && <h1 className="text-3xl">Error: {error}</h1>}
      {playlist && (
        <div className="flex flex-col justify-center">
          <h4 className="mt-0 mb-2 uppercase text-gray-500 tracking-widest text-xs">
            Playlist
          </h4>
          <h1 className="mt-0 mb-2 text-white text-4xl">{playlist.name}</h1>
          <p className="text-gray-600 text-sm">
            Created on {dateFormat(playlist.created_at, "dddd, mmmm dS, yyyy")}{" "}
            - Updated on{" "}
            {dateFormat(playlist.updated_at, "dddd, mmmm dS, yyyy")} {numSongs}{" "}
            songs, 3 hr 2 min
          </p>

          <button className="mr-2 bg-green-500 text-green-100 block py-2 px-8 rounded-full">
            Copy Link
          </button>
          <SongList songs={playlist.songs} />
        </div>
      )}
    </main>
  );
}
