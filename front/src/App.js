import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MapPage from "./pages/MapPage";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </Router>
  );
}

export default App;
