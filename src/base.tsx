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

const useTodoContext = () => {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error("TodoContext not defined");
  }

  return context;
};

export function createTodoStore<
  Item extends BaseItem,
  State extends BaseTodoState<Item>
>(initializer: StateCreator<State>) {
  const store = createStore<State>(initializer);

  function useTodoStore<T>(selector: (state: State) => T) {
    return useStore(store, selector);
  }
  const useAddAction = () => useTodoStore((state) => state.add);
  const useIsDone = (id: string) => useTodoStore((state) => state.isDone(id));
  const useSetDone = () => useTodoStore((state) => state.setDone);
  const useRemove = () => useTodoStore((state) => state.remove);
  const useReset = () => useTodoStore((state) => state.reset);
  const useItem = (id: string) => useTodoStore((state) => state.get(id));
  const useItems = () => useTodoStore((state) => state.ids);

  const Provider = ({ children }: PropsWithChildren) => {
    return (
      <TodoContext.Provider value={store}>{children}</TodoContext.Provider>
    );
  };

  const AddForm = ({ children }: PropsWithChildren) => {
    const add = useAddAction();

    const onSubmit: ComponentProps<"form">["onSubmit"] = (event) => {
      event.preventDefault();
      add(new FormData(event.currentTarget));
    };

    return <form onSubmit={onSubmit}>{children}</form>;
  };

  type RemoveButtonProps = PropsWithChildren<{
    id: string;
  }>;

  const RemoveButton = ({ children, id }: RemoveButtonProps) => {
    const remove = useRemove();

    const onClick = () => {
      remove(id);
    };

    return (
      <button type="button" onClick={onClick}>
        {children}
      </button>
    );
  };

  const ResetButton = ({ children }: PropsWithChildren) => {
    const reset = useReset();

    const onClick = () => {
      reset();
    };

    return (
      <button type="button" onClick={onClick}>
        {children}
      </button>
    );
  };

  type IsDoneCheckBoxProps = ComponentProps<"input"> & {
    id: string;
  };

  const IsDoneCheckbox = ({
    onChange,
    checked,
    id,
    ...props
  }: IsDoneCheckBoxProps) => {
    const isDone = useIsDone(id);
    const setDone = useSetDone();

    const onChangeInner: IsDoneCheckBoxProps["onChange"] = (event) => {
      onChange?.(event);

      if (!event.defaultPrevented) {
        setDone(id, event.currentTarget.checked);
      }
    };

    return (
      <input
        {...props}
        checked={checked !== undefined ? checked : isDone}
        onChange={onChangeInner}
      />
    );
  };

  type TodoItemProps = {
    children: (item?: Item) => ReactNode;
    id: string;
  };

  const TodoItem = ({ children, id }: TodoItemProps) => {
    const item = useItem(id);
    return <>{children(item as Item)}</>;
  };

  type TodoItemsProps = {
    children: (items: string[]) => ReactNode;
  };

  const TodoItems = ({ children }: TodoItemsProps) => {
    const items = useTodoStore((state) => state.ids);

    console.log("items", items);

    return <>{children(items)}</>;
  };

  return {
    useTodoStore,
    useAddAction,
    useSetDone,
    useIsDone,
    useRemove,
    useItem,
    useItems,
    useReset,
    Provider,
    AddForm,
    RemoveButton,
    ResetButton,
    IsDoneCheckbox,
    TodoItem,
    TodoItems,
  };
}
