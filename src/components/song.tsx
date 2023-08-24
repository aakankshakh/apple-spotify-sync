import React from "react";
import { song } from "../types";

interface SongProps {
  song: song;
}

const Song = (props: SongProps) => {
  const { song } = props;
  return (
    <li className="bg-[#ffa033] p-2 rounded-md">
      {song.name} - {song.artist}
    </li>
  );
};

export default Song;
