import { ComponentProps, ReactNode } from "react";
import { useBaseTodoContext } from "./store";
import { AsChildProps } from "../components/types";
import { Slot } from "../components/Slot";

type AddFormProps = AsChildProps<ComponentProps<"form">, "onSubmit">;

export const AddForm = ({ asChild, onSubmit, ...props }: AddFormProps) => {
  const Component = asChild ? Slot : "form";

  const add = useBaseTodoContext((state) => state.add);

  const onSubmitInner: AddFormProps["onSubmit"] = (event) => {
    onSubmit?.(event);

    if (!event.isDefaultPrevented()) {
      event.preventDefault();
      add(new FormData(event.currentTarget));
    }
  };

  return <Component {...props} onSubmit={onSubmitInner} />;
};

type IsDoneCheckBoxProps = AsChildProps<
  ComponentProps<"input"> & { itemId: string },
  "checked" | "onChange" | "itemId"
>;

export const IsDoneCheckbox = ({
  asChild,
  onChange,
  itemId,
  ...props
}: IsDoneCheckBoxProps) => {
  const Component = asChild ? Slot : "input";

  const isDone = useBaseTodoContext((state) => state.isDone(itemId));
  const setDone = useBaseTodoContext((state) => state.setDone);

  const onChangeInner: IsDoneCheckBoxProps["onChange"] = (event) => {
    onChange?.(event);

    if (!event.isDefaultPrevented()) {
      setDone(itemId, event.currentTarget.checked);
    }
  };

  return (
    <Component
      type="checkbox"
      {...props}
      checked={isDone}
      onChange={onChangeInner}
    />
  );
};

type RemoveButtonProps = AsChildProps<
  ComponentProps<"button"> & { itemId: string },
  "itemId" | "onClick"
>;

export const RemoveButton = ({
  onClick,
  asChild,
  itemId,
  ...props
}: RemoveButtonProps) => {
  const Component = asChild ? Slot : "button";

  const remove = useBaseTodoContext((state) => state.remove);

  const onClickInner: RemoveButtonProps["onClick"] = (event) => {
    onClick?.(event);

    if (!event.isDefaultPrevented()) {
      remove(itemId);
    }
  };

  return <Component type="button" {...props} onClick={onClickInner} />;
};

type ResetButtonProps = AsChildProps<ComponentProps<"button">, "onClick">;

export const ResetButton = ({
  asChild,
  onClick,
  ...props
}: ResetButtonProps) => {
  const Component = asChild ? Slot : "button";

  const reset = useBaseTodoContext((state) => state.reset);

  const onClickInner: ResetButtonProps["onClick"] = (event) => {
    onClick?.(event);

    if (!event.isDefaultPrevented()) {
      reset();
    }
  };

  return <Component type="button" {...props} onClick={onClickInner} />;
};

type TodoItemsProps = {
  children: (items: string[]) => ReactNode;
};

export const TodoItems = ({ children }: TodoItemsProps) => {
  const ids = useBaseTodoContext((state) => state.ids);
  return <>{children(ids)}</>;
};
