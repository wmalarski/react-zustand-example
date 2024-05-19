import { ReactNode } from "react";
import { useBaseTodoContext } from "../context";

type TodoItemsProps = {
  children: (items: string[]) => ReactNode;
};

export const TodoItems = ({ children }: TodoItemsProps) => {
  const ids = useBaseTodoContext((state) => state.ids);
  return <>{children(ids)}</>;
};
