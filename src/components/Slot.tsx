import { Children, cloneElement, isValidElement } from "react";

type SlotProps = React.HTMLAttributes<HTMLElement>;

export const Slot = ({ children, ...props }: SlotProps) => {
  if (isValidElement(children)) {
    return cloneElement(children, {
      ...props,
      ...children.props,
    });
  }

  if (Children.count(children) > 1) {
    Children.only(null);
  }

  return null;
};
