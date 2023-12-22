import { Provider } from "../../../types";
import { useSession } from "next-auth/react";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { MusicProvider } from "../MusicProviders/_provider";
import AppleMusicProvider from "../MusicProviders/apple";
import { buildProvider } from "../MusicProviders";
import { Session } from "next-auth";

type AuthStatus = "authenticated" | "unauthenticated" | "loading";
type SetMusicProvder = Dispatch<SetStateAction<MusicProvider | undefined>>;
type SetTrigger = Dispatch<SetStateAction<number>>;

type MusicAPIProviderType = {
  provider: MusicProvider | undefined;
  setProvider: SetMusicProvder;
  setTrigger: SetTrigger;
  trigger: number;
};
export const MusicAPIContext = createContext<MusicAPIProviderType>({
  provider: undefined,
  setProvider: () => {},
  setTrigger: () => {},
  trigger: 0,
});

const checkIsSignedInToApple = (music: MusicKit.MusicKitInstance) => {
  if (!music.isAuthorized) {
    return;
  }

  const userToken = music.musicUserToken as string;
  const developerToken = music.developerToken as string;

  const provider = new AppleMusicProvider({
    accessToken: userToken,
    developerToken: developerToken,
  });
  return provider;
};

const checkIsSignedInToSpotify = (data: Session | null, status: AuthStatus) => {
  // Check if signed in to Spotify
  if (status !== "authenticated" || !data) {
    return;
  }

  const provider = buildProvider({
    provider: Provider.spotify,
    tokens: {
      accessToken: data.accessToken,
    },
  });
  return provider;
};

export const MusicAPI = (props: { children: React.ReactNode }) => {
  // Provider state
  const [provider, setProvider] = useState<MusicProvider | undefined>(
    undefined
  );
  const [trigger, setTrigger] = useState(0);

  // NextAuth context
  const { data, status } = useSession();

  // Signed in checks and provider construction
  const updateProviders = useCallback(() => {
    const currentProvider = provider?.provider;
    const music = window.MusicKit.getInstance();

    let appleProvider = checkIsSignedInToApple(music);
    let spotifyProvider = checkIsSignedInToSpotify(data, status);

    if (appleProvider && currentProvider !== Provider.apple) {
      setProvider(appleProvider);
    } else if (spotifyProvider && currentProvider !== Provider.spotify) {
      setProvider(spotifyProvider);
    }
  }, [data, provider?.provider, status]);

  useEffect(() => {
    setTimeout(() => {
      updateProviders();
    }, 100);
  }, [updateProviders, trigger]);

  return (
    <MusicAPIContext.Provider
      value={{ provider, setProvider, setTrigger, trigger }}
    >
      {props.children}
    </MusicAPIContext.Provider>
  );
};
