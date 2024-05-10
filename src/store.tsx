import { BaseItem, BaseTodoState, createTodoStore } from "./base";

type BearsItem = BaseItem & {
  id: string;
  isDone: boolean;
  text: string;
};

type BeardState = BaseTodoState<BearsItem> & {
  clone: (id: string) => void;
  ids: string[];
  map: Record<string, BearsItem>;
};

const BearTodo = createTodoStore<BearsItem, BeardState>((set, get) => ({
  ids: [],
  map: {},
  add: (form) => {
    const id = crypto.randomUUID();
    const text = form.get("text") as string;
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
  setDone: (id, isDone) => {
    set((current) => {
      const item = current.map[id];
      return item
        ? { map: { ...current.map, [id]: { ...item, isDone } } }
        : current;
    });
  },
  get items() {
    return get().ids;
  },
  remove: (id) => {
    set((current) => {
      const copyIds = [...current.ids];
      const copyMap = { ...current.map };
      copyIds.splice(copyIds.indexOf(id), 1);
      delete copyMap[id];
      return { ids: copyIds, map: copyMap };
    });
  },
  reset: () => {
    set({ ids: [], map: {} });
  },
  clone: (id) => {
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
}));

export const BearTodoList = () => {
  return (
    <div>
      <BearTodo.Provider>
        <BearTodo.AddForm>
          <label>
            Text
            <input name="text" />
          </label>
          <button>Save</button>
        </BearTodo.AddForm>
        <ul>
          <BearTodo.TodoItems>
            {(items) =>
              items.map((itemId) => (
                <li key={itemId}>
                  <label>
                    <BearTodo.IsDoneCheckbox id={itemId} />
                    Done
                  </label>
                  <BearTodo.TodoItem id={itemId}>
                    {(item) => <p>{item?.text}</p>}
                  </BearTodo.TodoItem>
                  <CloneButton id={itemId} />
                  <BearTodo.RemoveButton id={itemId}>
                    Remove
                  </BearTodo.RemoveButton>
                </li>
              ))
            }
          </BearTodo.TodoItems>
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
