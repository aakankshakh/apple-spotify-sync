import React from "react";
import { song } from "../types";
import Song from "./song";

interface SongListProps {
  songs: song[];
}

const SongList = (props: SongListProps) => {
  const { songs } = props;
  return (
    <ul className="space-y-2">
      {songs.map((song, i) => (
        <Song song={song} key={i} />
      ))}
    </ul>
  );
};

export default SongList;
