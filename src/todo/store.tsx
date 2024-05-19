import { PropsWithChildren, ReactNode } from "react";
import { StateCreator, createStore, useStore } from "zustand";
import { BaseItem, BaseTodoContext, BaseTodoState } from "./context";

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

  return { useTodoStore, Provider, TodoItem, store };
}
