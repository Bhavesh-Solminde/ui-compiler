import { Routes, Route } from "react-router-dom";
import BuilderPage from "./pages/BuilderPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<BuilderPage />} />
    </Routes>
  );
}

export default App;
