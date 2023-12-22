import { UnifiedPlaylist } from "../../types/index";
import { SinglePlaylist } from "./single-playlist";
import { useContext, useEffect, useState } from "react";
import { MusicAPIContext } from "@/lib/client/ContextProviders/MusicAPIContext";

const PlaylistGallery = () => {
  // Context
  const { provider } = useContext(MusicAPIContext);

  // State
  const [page, setPage] = useState(0);
  const [numResults, setNumResults] = useState(0);
  const [playlists, setPlaylists] = useState<UnifiedPlaylist[]>([]);

  useEffect(() => {
    if (playlists.length == 0 || !provider) {
      return;
    }

    playlists.map((playlist) =>
      provider.getPlaylistSongs(playlist.id).then((songs) => {
        console.log(songs);
      })
    );
  }, [playlists, provider]);

  useEffect(() => {
    if (!provider) {
      return;
    }

    provider.getPlaylists(page).then(setPlaylists);
  }, [provider, page]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
      {playlists.map((playlist, idx) => (
        <SinglePlaylist key={idx} playlist={playlist} />
      ))}
    </div>
  );
};

export default PlaylistGallery;
