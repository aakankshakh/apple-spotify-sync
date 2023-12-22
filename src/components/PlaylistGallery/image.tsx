import Image from "next/image";
import defaultPlaylistIcon from "../../../public/icons/default-playlist-icon.svg";

type PlaylistImageProps = {
  imageURL?: string;
  alt: string;
};
export const PlayListImage = (props: PlaylistImageProps) => {
  const { alt, imageURL } = props;

  return (
    <Image
      alt={alt}
      className="w-64 h-auto mb-3 rounded-lg"
      width={256}
      height={256}
      src={imageURL || defaultPlaylistIcon}
    />
  );
};
