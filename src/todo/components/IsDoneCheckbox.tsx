import { ComponentProps } from "react";
import { useBaseTodoContext } from "../context";
import { AsChildProps } from "../../components/types";
import { Slot } from "../../components/Slot";

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
