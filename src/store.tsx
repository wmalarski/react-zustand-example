import { createContext, useState } from "react";
import { createStore, useStore } from "zustand";
import { createTodoStore } from "./base";

type BearsItem = {
  id: string;
  isDone: boolean;
  text: string;
};

const { TodoContext } = createTodoStore<BearsItem>((set) => ({
  values: [],
  add: () => {
    //
  },
  get: () => {
    return { id: "4", isDone: false, text: "" };
  },
  isDone: () => {
    return false;
  },
  get items() {
    return [];
  },
  remove: () => {
    //
  },
  reset: () => {
    //
  },
  clone: () => {
    //
  },
}));

const BearStoreContext = createContext(null);

export const BearStoreProvider = ({ children, initialBears }) => {
  const [store] = useState(() =>
    createStore((set) => ({
      bears: initialBears,
      actions: {
        increasePopulation: (by) =>
          set((state) => ({ bears: state.bears + by })),
        removeAllBears: () => set({ bears: 0 }),
      },
    }))
  );

  return (
    <BearStoreContext.Provider value={store}>
      {children}
    </BearStoreContext.Provider>
  );
};

export const useBearStore = (selector) => {
  const store = React.useContext(BearStoreContext);
  if (!store) {
    throw new Error("Missing BearStoreProvider");
  }
  return useStore(store, selector);
};
