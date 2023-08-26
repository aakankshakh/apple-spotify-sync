import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

type DeveloperTokenContextType = {
  token: string | undefined;
  setToken: Dispatch<SetStateAction<string | undefined>>;
};
export const DeveloperTokenContext = createContext<DeveloperTokenContextType>({
  token: undefined,
  setToken: () => {},
});

export const DeveloperTokenProvider = (props: { children: ReactNode }) => {
  const [token, setToken] = useState<string | undefined>(undefined);

  return (
    <DeveloperTokenContext.Provider value={{ token, setToken }}>
      {props.children}
    </DeveloperTokenContext.Provider>
  );
};
