import { ComponentProps, PropsWithChildren, ReactNode } from "react";
import { StateCreator, createStore, useStore } from "zustand";

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
  items: string[];
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
  const useItems = () => useTodoStore((state) => state.items);

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
    return <>{children(useItem(id))}</>;
  };

  type TodoItemsProps = {
    children: (items: string[]) => ReactNode;
  };

  const TodoItems = ({ children }: TodoItemsProps) => {
    const items = useTodoStore((state) => state.items);

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
    AddForm,
    RemoveButton,
    ResetButton,
    IsDoneCheckbox,
    TodoItem,
    TodoItems,
  };
}
