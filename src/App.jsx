import { Agentation } from "agentation";
import YourApp from "./YourApp";

function App() {
  return (
    <>
      <YourApp />
      {process.env.NODE_ENV === "development" && <Agentation />}
    </>
  );
}

export default App;
