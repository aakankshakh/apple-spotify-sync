import React from "react";
import { UnifiedSong } from "@/types";

interface SongProps {
  song: UnifiedSong;
  index: number;
}

const Song = (props: SongProps) => {
  const { song, index } = props;

  /*
  const seconds = song.duration % 60;
  const secondsString = seconds < 10 ? seconds + "0" : seconds;
  const minutes = (song.duration - seconds) / 60;
  const duration: string = minutes + ":" + secondsString;
  */

  return (
    <li className="flex border-b border-gray-800 hover:bg-gray-800 p-3">
      <div className="w-8 flex-shrink-0 text-gray-600">{index + 1}</div>
      <div className="w-full">{song.name}</div>
      <div className="w-full">
        {song.artists.length > 0 ? song.artists[0] : "Unknown Artist"}
      </div>
      {/*<div className="w-12 flex-shrink-0 text-right">{duration}</div>*/}
    </li>
  );
};

export default Song;
