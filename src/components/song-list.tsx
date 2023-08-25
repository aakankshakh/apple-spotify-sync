import React from "react";
import { song } from "../types";
import Song from "./song";

interface SongListProps {
  songs: song[];
}

const SongList = (props: SongListProps) => {
  const { songs } = props;
  return (
    <div>
      <div className="flex text-gray-600">
        <div className="p-2 w-8 flex-shrink-0"></div>
        <div className="p-2 w-full">Title</div>
        <div className="p-2 w-full">Artist</div>
        <div className="p-2 w-12 flex-shrink-0 text-right">⏱</div>
      </div>

      <ul className="space-y-2">
        {songs.map((song, i) => (
          <Song song={song} index={i} key={i} />
        ))}
      </ul>
    </div>
  );
};

export default SongList;
