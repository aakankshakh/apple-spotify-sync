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

const updateProvider = (
  session: Session | null,
  status: AuthStatus,
  musickit: MusicKit.MusicKitInstance | undefined = undefined
) => {
  if (!session || status !== "authenticated") {
    return;
  }

  // Credentials provider (which we use for Apple Music) seems to break the types, and returns:
  // {
  //    expires: date,
  //    user: {
  //       name: string,
  //       email: string,
  //    }
  // }
  // Let's check for the existance of the user property to determine if we are using the Apple Music provider.
  if ("user" in session && musickit) {
    console.log("Apple Music provider detected!");
    return buildProvider({
      provider: Provider.apple,
      tokens: {
        accessToken: musickit.musicUserToken,
        developerToken: musickit.developerToken,
      },
    });
  }

  const { accessToken, provider: providerId } = session;
  console.log("accessToken:", accessToken);
  console.log("providerId:", providerId);
  switch (providerId) {
    case "spotify":
      return buildProvider({
        provider: Provider.spotify,
        tokens: {
          accessToken: accessToken,
        },
      });
    default:
      return;
  }
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
    console.log("Status:", status);
    const music = window.MusicKit.getInstance();
    const provider = updateProvider(data, status, music);
    console.log("New povider:", provider);
    setProvider(provider);
  }, [data, status]);

  useEffect(() => {
    setTimeout(() => {
      updateProviders();
    }, 250);
  }, [updateProviders, trigger]);

  return (
    <MusicAPIContext.Provider
      value={{ provider, setProvider, setTrigger, trigger }}
    >
      {props.children}
    </MusicAPIContext.Provider>
  );
};
