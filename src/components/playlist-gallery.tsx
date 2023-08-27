import { UnifiedPlaylist } from "@/types";

type PlaylistGalleryProps = {
  playlists: UnifiedPlaylist[];
};
export const PlaylistGallery = (props: PlaylistGalleryProps) => {
  const { playlists } = props;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
      {playlists.map((playlist, idx) => (
        <div
          key={idx}
          className="p-4 rounded-lg bg-transparent hover:bg-orange-500/20 dark:hover:bg-orange-500/50  cursor-pointer"
        >
          {playlist.imageURL ? (
            <img
              alt={playlist.name}
              className="w-full h-auto mb-3 rounded-lg"
              src={playlist.imageURL}
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className=""
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
              />
            </svg>
          )}

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {playlist.name}
          </h2>
        </div>
      ))}
    </div>
  );
};
