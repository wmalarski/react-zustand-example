import { ComponentProps } from "react";
import { useBaseTodoContext } from "../context";
import { AsChildProps } from "../../components/types";
import { Slot } from "../../components/Slot";

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
