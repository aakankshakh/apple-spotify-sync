import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

type DeveloperTokenContextType = {
  token: string | undefined;
};
export const DeveloperTokenContext = createContext<DeveloperTokenContextType>({
  token: undefined,
});

export const DeveloperTokenProvider = (props: { children: ReactNode }) => {
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!token || token === "") {
      // @ts-ignore
      if (!window.MK_DEVELOPER_TOKEN) {
        // update token in 0.5s to trigger this again
        setTimeout(() => {
          setToken("");
        }, 500);
      } else {
        // @ts-ignore
        setToken(window.MK_DEVELOPER_TOKEN);
      }
    }
  }, [token]);

  return (
    <DeveloperTokenContext.Provider value={{ token }}>
      {props.children}
    </DeveloperTokenContext.Provider>
  );
};
