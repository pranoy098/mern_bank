import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "../components/Home";
import Dashboard from "../components/Admin";
import NewEmployee from "../components/Admin/NewEmployee";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/new-employee" element={<NewEmployee />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
