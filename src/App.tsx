import { Toaster } from "react-hot-toast";
import Weather from "./components/Weather";

function App() {
  return (
    <div className="bg-sky-700 h-screen flex justify-center items-center px-4">
      <Toaster />
      <Weather />
    </div>
  );
}

export default App;
