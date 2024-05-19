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
    <div className="p-8 border-1 flex flex-col gap-2 border-4 border-base-200 rounded-xl">
      <h2 className="text-xl">Store B</h2>
      <BearTodo.Provider>
        <Todo.AddForm className="flex w-full items-end gap-2">
          <fieldset className="form-control w-full flex-grow">
            <label className="label">
              <span className="label-text">Content</span>
            </label>
            <input className="input input-bordered w-full" name="content" />
          </fieldset>
          <Button>Save</Button>
        </Todo.AddForm>
        <Todo.ResetButton asChild>
          <Button>Reset</Button>
        </Todo.ResetButton>
        <ul className="flex flex-col gap-2">
          <Todo.TodoItems>
            {(ids) =>
              ids.map((itemId) => (
                <li key={itemId} className="card bg-base-200">
                  <div className="card-body">
                    <BearTodo.TodoItem id={itemId}>
                      {(item) => <p>{item?.content}</p>}
                    </BearTodo.TodoItem>
                    <div className="card-actions justify-end items-center">
                      <div className="form-control">
                        <label className="label cursor-pointer gap-2">
                          <Todo.IsDoneCheckbox
                            className="checkbox"
                            itemId={itemId}
                          />
                          <span className="label-text">Finished</span>
                        </label>
                      </div>
                      <MoveUpButton itemId={itemId} />
                      <MoveDownButton itemId={itemId} />
                      <Todo.RemoveButton asChild itemId={itemId}>
                        <Button size="sm" variant="outline">
                          Remove
                        </Button>
                      </Todo.RemoveButton>
                    </div>
                  </div>
                </li>
              ))
            }
          </Todo.TodoItems>
        </ul>
        <Todo.PendingIndicator>In progress</Todo.PendingIndicator>
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
  return (
    <Button size="sm" variant="outline" onClick={() => moveUp(itemId)}>
      Up
    </Button>
  );
};

type MoveDownButtonProps = {
  itemId: string;
};

const MoveDownButton = ({ itemId }: MoveDownButtonProps) => {
  const moveDown = BearTodo.useTodoStore((state) => state.moveDown);
  return (
    <Button size="sm" variant="outline" onClick={() => moveDown(itemId)}>
      Down
    </Button>
  );
};

const Debug = () => {
  const ids = BearTodo.useTodoStore((state) => state.ids);
  const items = BearTodo.useTodoStore((state) => state.items);
  return (
    <pre className="text-sm">{JSON.stringify({ ids, items }, null, 2)}</pre>
  );
};
