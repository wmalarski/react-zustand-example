import { ComponentProps, PropsWithChildren, ReactNode } from "react";
import { useBaseTodoContext } from "./store";

export const AddForm = ({ children }: PropsWithChildren) => {
  const add = useBaseTodoContext((state) => state.add);

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
  const isDone = useBaseTodoContext((state) => state.isDone(id));
  const setDone = useBaseTodoContext((state) => state.setDone);

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
  const remove = useBaseTodoContext((state) => state.remove);

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
  const reset = useBaseTodoContext((state) => state.reset);

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
  const ids = useBaseTodoContext((state) => state.ids);
  return <>{children(ids)}</>;
};
