import { Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/ui/toast";
import BuilderPage from "./pages/BuilderPage";

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<BuilderPage />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
