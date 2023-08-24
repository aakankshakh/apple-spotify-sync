import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ResponseObject, playlist } from "@/types";
import SongList from "@/components/song-list";

export default function PlaylistPage() {
  const router = useRouter();
  const { id } = router.query;

  const [playlist, setPlaylist] = useState<playlist | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchPlaylist = async (id: string) => {
    const res = await fetch(`/api/playlist?id=${id}`);
    const data = (await res.json()) as ResponseObject;

    if (data.error !== undefined) {
      console.error("Error:", data.error);
      setError(data.error);
    } else if (data.object !== "playlist") {
      console.error("Error: Received non-playlist object:", data);
      setError("Received non-playlist object");
    } else {
      setPlaylist(data.data);
      setError(undefined);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (id !== undefined) fetchPlaylist(id as string);
  }, [id]);
  const numSongs = playlist?.songs.length || 0;

  return (
    <main className="flex min-h-screen flex-row items-center justify-center p-24">
      {loading && <h1 className="text-3xl">Loading...</h1>}
      {error && <h1 className="text-3xl">Error: {error}</h1>}
      {playlist && (
        <div className="flex flex-col justify-center">
          <h4 className="mt-0 mb-2 uppercase text-gray-500 tracking-widest text-xs">
            Playlist
          </h4>
          <h1 className="mt-0 mb-2 text-white text-4xl">{playlist.name}</h1>
          <p className="text-gray-600 text-sm">
            Created on {playlist.created_at} - Updated on {playlist.updated_at}
            {numSongs} songs, 3 hr 2 min
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
