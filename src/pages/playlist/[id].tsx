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
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPlaylist(id as string);
  }, [id]);

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
