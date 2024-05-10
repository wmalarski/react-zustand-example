import { PropsWithChildren, ReactNode, createContext, useContext } from "react";
import { StateCreator, StoreApi, createStore, useStore } from "zustand";

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
};

const BaseTodoContext = createContext<StoreApi<BaseTodoState<BaseItem>> | null>(
  null
);

export function useBaseTodoContext<T>(
  selector: (state: BaseTodoState<BaseItem>) => T
) {
  const context = useContext(BaseTodoContext);

  if (!context) {
    throw new Error("TodoContext not defined");
  }

  return useStore(context, selector);
}

export function createTodoStore<
  Item extends BaseItem,
  State extends BaseTodoState<Item>
>(initializer: StateCreator<State>) {
  const store = createStore<State>(initializer);

  function useTodoStore<T>(selector: (state: State) => T) {
    return useStore(store, selector);
  }

  const Provider = ({ children }: PropsWithChildren) => {
    return (
      <BaseTodoContext.Provider value={store}>
        {children}
      </BaseTodoContext.Provider>
    );
  };

  type TodoItemProps = {
    children: (item?: Item) => ReactNode;
    id: string;
  };

  const TodoItem = ({ children, id }: TodoItemProps) => {
    const item = useTodoStore((state) => state.get(id));
    return <>{children(item)}</>;
  };

  return { useTodoStore, Provider, TodoItem };
}
