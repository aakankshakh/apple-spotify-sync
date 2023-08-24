import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ResponseObject, playlist } from "@/types";
import SongList from "@/components/song-list";
import { getPlaylist } from "@/lib/client/crud";

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

  return (
    <main className="flex min-h-screen flex-row items-center justify-center p-24">
      {loading && <h1 className="text-3xl">Loading...</h1>}
      {error && <h1 className="text-3xl">Error: {error}</h1>}
      {playlist && (
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-4xl font-bold">{playlist.name}</h1>
          <SongList songs={playlist.songs} />
        </div>
      )}
    </main>
  );
}
