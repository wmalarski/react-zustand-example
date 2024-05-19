import { PropsWithChildren } from "react";
import { useBaseTodoContext } from "../context";

export const PendingProgress = ({ children }: PropsWithChildren) => {
  const pending = useBaseTodoContext((state) => state.pending);

  if (!pending) return null;

  return <>{children}</>;
};
