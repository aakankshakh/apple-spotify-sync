import { UnifiedPlaylist, UnifiedSong } from "@/types";

const hashPlaylist = async (playlist: UnifiedPlaylist): Promise<string> => {
  const playlistMinusUniqueFields: UnifiedPlaylist = {
    ...playlist,
    id: "temp",
    type: "spotify",
  };

  const jsonStr = JSON.stringify(playlistMinusUniqueFields);
  const encoded = new TextEncoder().encode(jsonStr);
  const hash = await crypto.subtle.digest("SHA-256", encoded);
  const charArray = Array.from(new Uint8Array(hash));
  return btoa(String.fromCharCode(...charArray));
};

const getRemovedSongs = (
  currentSongs: UnifiedPlaylist["songs"] = [],
  playlistSongs: UnifiedPlaylist["songs"] = []
): UnifiedSong[] => {
  return currentSongs.filter((song) => {
    return !playlistSongs.some((playlistSong) => {
      return (
        playlistSong.name === song.name &&
        playlistSong.artists.some((artist) => {
          return song.artists.some((songArtist) => {
            return songArtist.toLowerCase().includes(artist.toLowerCase());
          });
        })
      );
    });
  });
};

const syncUnifiedPlaylists = async (
  current: UnifiedPlaylist,
  playlistOne: UnifiedPlaylist,
  playlistTwo: UnifiedPlaylist
): Promise<UnifiedPlaylist> => {
  const currentHash = await hashPlaylist(current);
  const playlistOneHash = await hashPlaylist(playlistOne);
  const playlistTwoHash = await hashPlaylist(playlistTwo);
  const didPlaylistOneChange = currentHash !== playlistOneHash;
  const didPlaylistTwoChange = currentHash !== playlistTwoHash;

  if (!didPlaylistOneChange && !didPlaylistTwoChange) {
    return current;
  }

  // There were changes, we need to find the songs that changed, and merge them into the current playlist
  const currentSongs = current.songs || [];

  // Find the songs that were removed
  const playlistOneSongs = playlistOne.songs || [];
  const playlistTwoSongs = playlistTwo.songs || [];

  const overlappingSongs = currentSongs.filter((song) => {
    return (
      playlistOneSongs.some((playlistOneSong) => {
        return (
          playlistOneSong.name === song.name &&
          playlistOneSong.artists.some((artist) => {
            return song.artists.some((songArtist) => {
              return songArtist.toLowerCase().includes(artist.toLowerCase());
            });
          })
        );
      }) &&
      playlistTwoSongs.some((playlistTwoSong) => {
        return (
          playlistTwoSong.name === song.name &&
          playlistTwoSong.artists.some((artist) => {
            return song.artists.some((songArtist) => {
              return songArtist.toLowerCase().includes(artist.toLowerCase());
            });
          })
        );
      })
    );
  });

  const songsRemovedFromPlaylistOne = getRemovedSongs(
    current.songs,
    playlistOneSongs
  );

  const songsRemovedFromPlaylistTwo = getRemovedSongs(
    current.songs,
    playlistTwoSongs
  );

  const songsAddedToPlaylistOne = playlistOneSongs.filter((song) => {
    return !currentSongs.some((currentSong) => {
      return (
        currentSong.name === song.name &&
        currentSong.artists.some((artist) => {
          return song.artists.some((songArtist) => {
            return songArtist.toLowerCase().includes(artist.toLowerCase());
          });
        })
      );
    });
  });

  const songsAddedToPlaylistTwo = playlistTwoSongs.filter((song) => {
    return !currentSongs.some((currentSong) => {
      return (
        currentSong.name === song.name &&
        currentSong.artists.some((artist) => {
          return song.artists.some((songArtist) => {
            return songArtist.toLowerCase().includes(artist.toLowerCase());
          });
        })
      );
    });
  });

  let newSongs = [
    ...overlappingSongs,
    ...songsAddedToPlaylistOne,
    ...songsAddedToPlaylistTwo,
  ];

  // Remove the songs that were removed
  newSongs = newSongs.filter((song) => {
    return (
      !songsRemovedFromPlaylistOne.some((removedSong) => {
        return (
          removedSong.name === song.name &&
          removedSong.artists.some((artist) => {
            return song.artists.some((songArtist) => {
              return songArtist.toLowerCase().includes(artist.toLowerCase());
            });
          })
        );
      }) &&
      !songsRemovedFromPlaylistTwo.some((removedSong) => {
        return (
          removedSong.name === song.name &&
          removedSong.artists.some((artist) => {
            return song.artists.some((songArtist) => {
              return songArtist.toLowerCase().includes(artist.toLowerCase());
            });
          })
        );
      })
    );
  });

  return {
    ...current,
    songs: newSongs,
  };
};
