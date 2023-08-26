type PlaylistGalleryProps = {
  playlists: any[];
};
export const PlaylistGallery = (props: PlaylistGalleryProps) => {
  const { playlists } = props;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {playlists.map((playlist, idx) => (
        <div
          key={idx}
          className="p-4 rounded-lg bg-transparent hover:bg-white/30 cursor-pointer"
        >
          <img
            alt={playlist.name}
            className="w-full h-48 object-cover object-center mb-3 rounded-lg"
            src={playlist.images[0].url}
          />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {playlist.name}
          </h2>
        </div>
      ))}
    </div>
  );
};
