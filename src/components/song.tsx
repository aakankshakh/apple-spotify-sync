import React from "react";
import { song } from "../types";

interface SongProps {
  song: song;
}

const Song = (props: SongProps) => {
  const { song } = props;
  const seconds = song.duration % 60;
  const minutes = (song.duration - seconds) / 60;
  const duration: string = minutes + ":" + seconds;

  return (
    <li className="flex border-b border-gray-800 hover:bg-gray-800">
      <div className="p-3 w-8 flex-shrink-0">▶️</div>
      <div className="p-3 w-8 flex-shrink-0">❤️</div>
      <div className="p-3 w-full">{song.name}</div>
      <div className="p-3 w-full">{song.artist}</div>
      <div className="p-3 w-12 flex-shrink-0 text-right">{duration}</div>
    </li>
  );
};

export default Song;
