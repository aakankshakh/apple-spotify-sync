import { useContext } from "react";
import { MusicAPIContext } from "@/lib/client/ContextProviders/MusicAPIContext";

export const ProviderGate: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { provider } = useContext(MusicAPIContext);

  if (provider) {
    return <>{children}</>;
  }

  return null;
};

export const NoProviderGate: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { provider } = useContext(MusicAPIContext);

  if (!provider) {
    return <>{children}</>;
  }

  return null;
};
