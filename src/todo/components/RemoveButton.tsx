import { ComponentProps } from "react";
import { useBaseTodoContext } from "../context";
import { AsChildProps } from "../../components/types";
import { Slot } from "../../components/Slot";

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
