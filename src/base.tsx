import {
  ComponentProps,
  PropsWithChildren,
  ReactNode,
  createContext,
  useContext,
} from "react";
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

export const TodoContext = createContext<StoreApi<
  BaseTodoState<BaseItem>
> | null>(null);

function useTodoContext<T>(selector: (state: BaseTodoState<BaseItem>) => T) {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error("TodoContext not defined");
  }

  return useStore(context, selector);
}

export const AddForm = ({ children }: PropsWithChildren) => {
  const add = useTodoContext((state) => state.add);

  const onSubmit: ComponentProps<"form">["onSubmit"] = (event) => {
    event.preventDefault();
    add(new FormData(event.currentTarget));
  };

  return <form onSubmit={onSubmit}>{children}</form>;
};

type IsDoneCheckBoxProps = ComponentProps<"input"> & {
  id: string;
};

export const IsDoneCheckbox = ({
  onChange,
  checked,
  id,
  ...props
}: IsDoneCheckBoxProps) => {
  const isDone = useTodoContext((state) => state.isDone(id));
  const setDone = useTodoContext((state) => state.setDone);

  const onChangeInner: IsDoneCheckBoxProps["onChange"] = (event) => {
    onChange?.(event);

    if (!event.defaultPrevented) {
      setDone(id, event.currentTarget.checked);
    }
  };

  return (
    <input
      type="checkbox"
      checked={checked !== undefined ? checked : isDone}
      onChange={onChangeInner}
      {...props}
    />
  );
};

type RemoveButtonProps = PropsWithChildren<{
  id: string;
}>;

export const RemoveButton = ({ children, id }: RemoveButtonProps) => {
  const remove = useTodoContext((state) => state.remove);

  const onClick = () => {
    remove(id);
  };

  return (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  );
};

export const ResetButton = ({ children }: PropsWithChildren) => {
  const reset = useTodoContext((state) => state.reset);

  const onClick = () => {
    reset();
  };

  return (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  );
};

type TodoItemsProps = {
  children: (items: string[]) => ReactNode;
};

export const TodoItems = ({ children }: TodoItemsProps) => {
  const ids = useTodoContext((state) => state.ids);
  return <>{children(ids)}</>;
};

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
      <TodoContext.Provider value={store}>{children}</TodoContext.Provider>
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
