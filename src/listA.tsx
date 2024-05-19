import * as Todo from "./todo";

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
    <div>
      <BearTodo.Provider>
        <Todo.AddForm>
          <label>
            Text
            <input name="text" />
          </label>
          <button>Save</button>
        </Todo.AddForm>
        <Todo.PendingIndicator>Loading</Todo.PendingIndicator>
        <Todo.ResetButton>Reset</Todo.ResetButton>
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
                    {(item) => <p>{item?.text}</p>}
                  </BearTodo.TodoItem>
                  <CloneButton id={itemId} />
                  <Todo.RemoveButton itemId={itemId}>Remove</Todo.RemoveButton>
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

type CloneButtonProps = {
  id: string;
};

const CloneButton = ({ id }: CloneButtonProps) => {
  const clone = BearTodo.useTodoStore((state) => state.clone);
  return <button onClick={() => clone(id)}>Clone</button>;
};

const Debug = () => {
  const ids = BearTodo.useTodoStore((state) => state.ids);
  const map = BearTodo.useTodoStore((state) => state.map);
  return <pre>{JSON.stringify({ ids, map }, null, 2)}</pre>;
};
