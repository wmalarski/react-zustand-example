import { ListA } from "./examples/ListA";
import { ListB } from "./examples/ListB";

const App = () => {
  return (
    <main className="max-w-screen-xl p-8 mx-auto flex flex-col gap-8">
      <h1 className="text-2xl">Store Examples</h1>
      <div className="grid  w-full grid-cols-2 gap-8 ">
        <ListA />
        <ListB />
      </div>
    </main>
  );
};

export default App;
