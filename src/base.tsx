import {
  ComponentProps,
  PropsWithChildren,
  createContext,
  useContext,
} from "react";
import { StateCreator, StoreApi, createStore, useStore } from "zustand";

export type BaseItem = {
  id: string;
};

export type BaseTodoState<Item extends BaseItem> = {
  add: (form: FormData) => void;
  isDone: (id: string) => boolean;
  remove: (id: string) => void;
  reset: () => void;
  get: (id: string) => Item;
  items: Item[];
};

export function createTodoStore<
  Item extends BaseItem,
  State extends BaseTodoState<Item> = BaseTodoState<Item>
>(initializer: StateCreator<State>) {
  const store = createStore<State>(initializer);
  const TodoContext = createContext<StoreApi<State>>(store);

  function useTodoStore<T>(selector: (state: State) => T) {
    const store = useContext(TodoContext);
    return useStore(store, selector);
  }

  const Provider = ({ children }: PropsWithChildren) => {
    return (
      <TodoContext.Provider value={store}>{children}</TodoContext.Provider>
    );
  };

  const AddForm = ({ children }: PropsWithChildren) => {
    const add = useTodoStore((state) => state.add);

    const onSubmit: ComponentProps<"form">["onSubmit"] = (event) => {
      event.preventDefault();
      add(new FormData(event.currentTarget));
    };

    return <form onSubmit={onSubmit}>{children}</form>;
  };

  const Todo = { Provider, AddForm };

  return { TodoContext, useTodoStore, Todo };
}
