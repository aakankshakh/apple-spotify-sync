import { useRouter } from "next/router";
import { createPlaylist } from "@/lib/client/crud";
import { UnifiedPlaylist, playlistDBEntry } from "@/types/index";
import { PlayListImage } from "./image";
import { MusicAPIContext } from "@/lib/client/ContextProviders/MusicAPIContext";
import { useContext } from "react";
import { useSession } from "next-auth/react";

type SinglePlaylistProps = {
  playlist: UnifiedPlaylist;
};

export const SinglePlaylist = (props: SinglePlaylistProps) => {
  const { playlist } = props;
  const { provider } = useContext(MusicAPIContext);
  const { data } = useSession();
  const router = useRouter();

  const onError = (error: string) => {
    alert(`Something went wrong: ${error}`);
  };

  const onSuccess = (dbEntry: playlistDBEntry) => {
    alert(`Successfully created playlist ${dbEntry.playlist.name}`);
    router.push(`/playlist/${dbEntry.id}`);
  };

  const clickSync = () => {
    if (!provider) {
      alert("Please refresh the page and log in again.");
      return;
    }

    provider.getPlaylistSongs(playlist.id).then((songs) => {
      const playlistObj: Pick<playlistDBEntry, "playlist"> = {
        playlist: {
          ...playlist,
          songs: songs,
        },
      };

      createPlaylist(playlistObj, onError, onSuccess);
    });
  };

  return (
    <div className="relative p-4 rounded-lg bg-transparent cursor-pointer">
      <div className="flex flex-row items-center justify-center space-x-2">
        <PlayListImage alt={playlist.name} imageURL={playlist.imageURL} />
        <div className="absolute inset-0 bg-black/0 hover:bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <button
            className="text-white font-semibold bg-orange-500 hover:bg-orange-700 px-4 py-2 rounded-lg"
            onClick={clickSync}
          >
            Sync
          </button>
        </div>
      </div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        {playlist.name}
      </h2>
    </div>
  );
};
