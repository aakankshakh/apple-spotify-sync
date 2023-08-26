import { Dispatch, SetStateAction, createContext, useState } from "react";

type MusicKitContextType = {
  token: string | undefined;
  setToken: Dispatch<SetStateAction<string | undefined>>;
};
export const MusicKitContext = createContext<MusicKitContextType>({
  token: undefined,
  setToken: () => {},
});

export const MusicKitProvider = (props: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | undefined>(undefined);

  return (
    <MusicKitContext.Provider value={{ token, setToken }}>
      {props.children}
    </MusicKitContext.Provider>
  );
};
