import { playlist } from "@/types";
import dateFormat from "dateformat";
import React from "react";
import SongList from "@/components/song-list";

type PlaylistPageProps = {
  error: string | undefined;
  playlist: playlist | undefined;
};

export const PlaylistPreview = (props: PlaylistPageProps) => {
  const { error, playlist } = props;
  const numSongs = playlist?.songs.length || 0;
  const totalDuration =
    playlist?.songs
      .map((song) => song.duration)
      .reduce((partialSum, a) => partialSum + a, 0) || 0;

  const durationHours = Math.floor(totalDuration / 3600);
  const durationMinutes = Math.round((totalDuration % 3600) / 60);
  const formattedDuration = `${durationHours} hr ${durationMinutes} min`;
  return (
    <main className="p-24 w-screen">
      {error && <h1 className="text-3xl">Error: {error}</h1>}
      {playlist && (
        <div className="flex flex-col justify-center">
          <h4 className="mt-0 mb-2 uppercase text-gray-500 tracking-widest text-xs">
            Playlist
          </h4>
          <div className="flex flex-row justify-between">
            <h1 className="mt-0 mb-2 text-black font-semibold dark:text-white text-4xl">
              {playlist.name}
            </h1>
            <div className="justify-items-end">
              <button className="font-semibold mr-2 inline-flex bg-yellow-600 text-white items-center py-1 px-4 rounded-full gap-x-2 hover:bg-yellow-800">
                SYNC
              </button>
              <button className="font-semibold mr-2 inline-flex bg-orange-600 text-white items-center py-1 px-4 rounded-full gap-x-2 hover:bg-orange-800">
                SHARE
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-white w-4 h-4 "
                  viewBox="0 0 24 24"
                >
                  <path d="M17.033 6.966c.584.583.584 1.529 0 2.112l-7.955 7.956c-.583.583-1.529.583-2.112 0-.583-.583-.583-1.529 0-2.112l7.956-7.956c.582-.583 1.528-.583 2.111 0zm-9.138 13.386c-1.171 1.171-3.076 1.171-4.248 0-1.171-1.171-1.171-3.077 0-4.248l5.639-5.632c-1.892-.459-3.971.05-5.449 1.528l-2.147 2.147c-2.254 2.254-2.254 5.909 0 8.163 2.254 2.254 5.909 2.254 8.163 0l2.147-2.148c1.477-1.477 1.986-3.556 1.527-5.448l-5.632 5.638zm6.251-18.662l-2.146 2.148c-1.478 1.478-1.99 3.553-1.53 5.445l5.634-5.635c1.172-1.171 3.077-1.171 4.248 0 1.172 1.171 1.172 3.077 0 4.248l-5.635 5.635c1.893.459 3.968-.053 5.445-1.53l2.146-2.147c2.254-2.254 2.254-5.908 0-8.163-2.253-2.254-5.908-2.254-8.162-.001z" />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-gray-600 text-m">
            {numSongs} songs, {formattedDuration}
          </p>
          <p className="text-gray-600 text-sm pb-5">
            Last synced:{" "}
            {dateFormat(playlist.updated_at, "dddd, mmmm dS, yyyy")}
            {/*
            {"   -   "}
            Created: {dateFormat(playlist.created_at, "dddd, mmmm dS, yyyy")}
      */}
          </p>

          <SongList songs={playlist.songs} />
        </div>
      )}
    </main>
  );
};
