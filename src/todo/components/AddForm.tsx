import { ComponentProps } from "react";
import { useBaseTodoContext } from "../context";
import { AsChildProps } from "../../components/utils/types";
import { Slot } from "../../components/Slot";

type AddFormProps = AsChildProps<ComponentProps<"form">, "onSubmit">;

export const AddForm = ({ asChild, onSubmit, ...props }: AddFormProps) => {
  const Component = asChild ? Slot : "form";

  const add = useBaseTodoContext((state) => state.add);

  const onSubmitInner: AddFormProps["onSubmit"] = async (event) => {
    onSubmit?.(event);

    if (!event.isDefaultPrevented()) {
      event.preventDefault();
      add(new FormData(event.currentTarget));
      event.currentTarget.reset();
    }
  };

  return <Component {...props} onSubmit={onSubmitInner} />;
};
