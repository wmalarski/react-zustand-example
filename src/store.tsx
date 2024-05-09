import { createContext, useState } from "react";
import { createStore, useStore } from "zustand";
import { BaseItem, BaseTodoState, createTodoStore } from "./base";

type BearsItem = BaseItem & {
  id: string;
  isDone: boolean;
  text: string;
};

type BeardState = BaseTodoState<BearsItem> & {
  clone: (id: string) => void;
  ids: string[];
  map: Record<string, BearsItem>;
};

const BearTodo = createTodoStore<BearsItem, BeardState>((set, get) => ({
  ids: [],
  map: {},
  add: (form) => {
    const id = crypto.randomUUID();
    const text = form.get("text") as string;
    set((current) => ({
      ids: [...current.ids, id],
      map: { ...current.map, [id]: { id, isDone: false, text } },
    }));
  },
  get: (id) => {
    return get().map[id];
  },
  isDone: (id) => {
    return get().map[id]?.isDone;
  },
  setDone: (id, isDone) => {
    set((current) => {
      const item = current.map[id];
      return item
        ? { map: { ...current.map, [id]: { ...item, isDone } } }
        : current;
    });
  },
  get items() {
    return Object.values(get().map);
  },
  remove: (id) => {
    set((current) => {
      const copyIds = [...current.ids];
      const copyMap = { ...current.map };
      copyIds.splice(copyIds.indexOf(id), 1);
      delete copyMap[id];
      return { ids: copyIds, map: copyMap };
    });
  },
  reset: () => {
    set({ ids: [], map: {} });
  },
  clone: (id) => {
    set((current) => {
      const item = current.map[id];
      if (!item) return current;
      const newId = crypto.randomUUID();
      return {
        ids: [...current.ids, newId],
        map: { ...current.map, [newId]: { ...item, id: newId } },
      };
    });
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
