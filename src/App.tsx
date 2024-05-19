import { ListA } from "./examples/ListA";
import { ListB } from "./examples/ListB";

const App = () => {
  return (
    <main className="grid max-w-screen-xl w-full grid-cols-2">
      <ListA />
      <ListB />
    </main>
  );
};

export default App;
