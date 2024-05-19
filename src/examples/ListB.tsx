import { Button } from "../components/Button";
import * as Todo from "../todo";

type BearsItem = Todo.BaseItem & {
  finished: boolean;
  content: string;
};

type BeardState = Todo.BaseTodoState<BearsItem> & {
  moveUp: (id: string) => void;
  moveDown: (id: string) => void;
  items: BearsItem[];
};

const BearTodo = Todo.createTodoStore<BearsItem, BeardState>((set, get) => {
  const wait = async () => {
    set({ pending: true });
    await new Promise((resolve) => setTimeout(resolve, 200));
    set({ pending: false });
  };

  return {
    ids: [],
    items: [],
    pending: false,
    add: async (form) => {
      const id = crypto.randomUUID();
      const content = form.get("content") as string;
      await wait();
      set((current) => {
        return {
          ids: [...current.ids, id],
          items: [...current.items, { content, id, finished: false }],
        };
      });
    },
    get: (id) => {
      return get().items.find((item) => item.id === id);
    },
    isDone: (id) => {
      return get().items.find((item) => item.id === id)?.finished;
    },
    setDone: async (id, isDone) => {
      await wait();
      set((current) => {
        const index = current.items.findIndex((item) => item.id === id);
        const item = current.items[index];
        if (!item) return current;

        const itemsCopy = [...current.items];
        itemsCopy.splice(index, 1, { ...item, finished: isDone });

        return { items: itemsCopy };
      });
    },
    remove: async (id) => {
      await wait();
      set((current) => {
        const copyIds = [...current.ids];
        const copyItems = [...current.items];

        const index = copyIds.indexOf(id);
        copyIds.splice(index, 1);
        copyItems.splice(index, 1);

        return { ids: copyIds, items: copyItems };
      });
    },
    reset: async () => {
      await wait();
      set({ ids: [], items: [] });
    },
    moveUp: async (id) => {
      await wait();
      set((current) => {
        const copyIds = [...current.ids];
        const copyItems = [...current.items];
        const index = copyIds.indexOf(id);

        if (index < 1) return current;

        copyIds.splice(index - 1, 2, copyIds[index], copyIds[index - 1]);
        copyItems.splice(index - 1, 2, copyItems[index], copyItems[index - 1]);

        return { ids: copyIds, items: copyItems };
      });
    },
    moveDown: async (id) => {
      await wait();
      set((current) => {
        const copyIds = [...current.ids];
        const copyItems = [...current.items];
        const index = copyIds.indexOf(id);

        if (index > copyIds.length - 2) return current;

        copyIds.splice(index, 2, copyIds[index + 1], copyIds[index]);
        copyItems.splice(index, 2, copyItems[index + 1], copyItems[index]);

        return { ids: copyIds, items: copyItems };
      });
    },
  };
});

export const ListB = () => {
  return (
    <div>
      <BearTodo.Provider>
        <Todo.AddForm>
          <label>
            Content
            <input name="content" />
          </label>
          <Button>Save</Button>
        </Todo.AddForm>
        <Todo.PendingIndicator>In progress</Todo.PendingIndicator>
        <Todo.ResetButton asChild>
          <Button>Reset</Button>
        </Todo.ResetButton>
        <ul>
          <Todo.TodoItems>
            {(ids) =>
              ids.map((itemId) => (
                <li key={itemId}>
                  <label>
                    <Todo.IsDoneCheckbox itemId={itemId} />
                    Done
                  </label>
                  <BearTodo.TodoItem id={itemId}>
                    {(item) => <p>{item?.content}</p>}
                  </BearTodo.TodoItem>
                  <MoveUpButton itemId={itemId} />
                  <MoveDownButton itemId={itemId} />
                  <Todo.RemoveButton asChild itemId={itemId}>
                    <Button>Remove</Button>
                  </Todo.RemoveButton>
                </li>
              ))
            }
          </Todo.TodoItems>
        </ul>
        <Debug />
      </BearTodo.Provider>
    </div>
  );
};

type MoveUpButtonProps = {
  itemId: string;
};

const MoveUpButton = ({ itemId }: MoveUpButtonProps) => {
  const moveUp = BearTodo.useTodoStore((state) => state.moveUp);
  return <Button onClick={() => moveUp(itemId)}>Up</Button>;
};

type MoveDownButtonProps = {
  itemId: string;
};

const MoveDownButton = ({ itemId }: MoveDownButtonProps) => {
  const moveDown = BearTodo.useTodoStore((state) => state.moveDown);
  return <Button onClick={() => moveDown(itemId)}>Down</Button>;
};

const Debug = () => {
  const ids = BearTodo.useTodoStore((state) => state.ids);
  const items = BearTodo.useTodoStore((state) => state.items);
  return <pre>{JSON.stringify({ ids, items }, null, 2)}</pre>;
};
