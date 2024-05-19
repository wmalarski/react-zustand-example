import { Button } from "../components/Button";
import * as Todo from "../todo";

type BearsItem = Todo.BaseItem & {
  isDone: boolean;
  text: string;
};

type BeardState = Todo.BaseTodoState<BearsItem> & {
  clone: (id: string) => void;
  map: Record<string, BearsItem>;
};

const BearTodo = Todo.createTodoStore<BearsItem, BeardState>((set, get) => {
  const wait = async () => {
    set({ pending: true });
    await new Promise((resolve) => setTimeout(resolve, 500));
    set({ pending: false });
  };

  return {
    ids: [],
    map: {},
    pending: false,
    add: async (form) => {
      const id = crypto.randomUUID();
      const text = form.get("text") as string;
      await wait();
      set((current) => ({
        ids: [...current.ids, id],
        map: { ...current.map, [id]: { id, isDone: false, text } },
      }));
    },
    get: (id) => {
      return get().map[id];
    },
    isDone: (id) => {
      return get().map[id]?.isDone;
    },
    setDone: async (id, isDone) => {
      await wait();
      set((current) => {
        const item = current.map[id];
        return item
          ? { map: { ...current.map, [id]: { ...item, isDone } } }
          : current;
      });
    },
    remove: async (id) => {
      await wait();
      set((current) => {
        const copyIds = [...current.ids];
        const copyMap = { ...current.map };
        copyIds.splice(copyIds.indexOf(id), 1);
        delete copyMap[id];
        return { ids: copyIds, map: copyMap };
      });
    },
    reset: async () => {
      await wait();
      set({ ids: [], map: {} });
    },
    clone: async (id) => {
      await wait();
      set((current) => {
        const item = current.map[id];
        if (!item) return current;
        const newId = crypto.randomUUID();
        return {
          ids: [...current.ids, newId],
          map: { ...current.map, [newId]: { ...item, id: newId } },
        };
      });
    },
  };
});

export const ListA = () => {
  return (
    <div className="p-8 border-1 flex flex-col gap-2 border-4 border-base-200 rounded-xl">
      <h2 className="text-xl">Store A</h2>
      <BearTodo.Provider>
        <Todo.AddForm className="flex w-full items-end gap-2">
          <fieldset className="form-control w-full flex-grow">
            <label className="label">
              <span className="label-text">Text</span>
            </label>
            <input className="input input-bordered w-full" name="text" />
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
                      {(item) => <p>{item?.text}</p>}
                    </BearTodo.TodoItem>
                    <div className="card-actions justify-end items-center">
                      <div className="form-control">
                        <label className="label cursor-pointer gap-2">
                          <Todo.IsDoneCheckbox
                            className="checkbox"
                            itemId={itemId}
                          />
                          <span className="label-text">Done</span>
                        </label>
                      </div>
                      <CloneButton id={itemId} />
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
        <Todo.PendingIndicator>Loading</Todo.PendingIndicator>
        <Debug />
      </BearTodo.Provider>
    </div>
  );
};

type CloneButtonProps = {
  id: string;
};

const CloneButton = ({ id }: CloneButtonProps) => {
  const clone = BearTodo.useTodoStore((state) => state.clone);
  return (
    <Button size="sm" variant="outline" onClick={() => clone(id)}>
      Clone
    </Button>
  );
};

const Debug = () => {
  const ids = BearTodo.useTodoStore((state) => state.ids);
  const map = BearTodo.useTodoStore((state) => state.map);
  return <pre>{JSON.stringify({ ids, map }, null, 2)}</pre>;
};
