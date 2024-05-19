import { createContext, useContext } from "react";
import { StoreApi, useStore } from "zustand";

export type BaseItem = {
  id: string;
};

export type BaseTodoState<Item extends BaseItem> = {
  add: (form: FormData) => void;
  isDone: (id: string) => boolean | undefined;
  setDone: (id: string, isDone: boolean) => void;
  remove: (id: string) => void;
  reset: () => void;
  get: (id: string) => Item | undefined;
  ids: string[];
  pending: boolean;
};

export const BaseTodoContext = createContext<StoreApi<
  BaseTodoState<BaseItem>
> | null>(null);

export function useBaseTodoContext<T>(
  selector: (state: BaseTodoState<BaseItem>) => T
) {
  const context = useContext(BaseTodoContext);

  if (!context) {
    throw new Error("TodoContext not defined");
  }

  return useStore(context, selector);
}
