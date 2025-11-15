import { lazy, Suspense } from "react";
import Loader from "../components/Loader";
import Guard from "../components/Gaurd";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Homepage = lazy(() => import("../components/Home"));
const Dashboard = lazy(() => import("../components/Admin"));
const NewEmployee = lazy(() => import("../components/Admin/NewEmployee"));
const PageNotFound = lazy(() => import("../components/PageNotFound"));
const Branding = lazy(() => import("../components/Admin/Branding"));
const Branch = lazy(() => import("../components/Admin/Branch"));
const Currency = lazy(() => import("../components/Admin/Currency"));
const EmployeeDashboard = lazy(() => import("../components/Employee"));

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          {/* Admin related routes */}
          <Route
            path="/admin/"
            element={<Guard endpoint={"/api/verify-token"} role="admin" />}
          >
            <Route index element={<Dashboard />} />
            <Route path="branding" element={<Branding />} />
            <Route path="branch" element={<Branch />} />
            <Route path="currency" element={<Currency />} />
            <Route path="new-employee" element={<NewEmployee />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>

          {/* Employee related routes */}
          <Route
            path="/employee/"
            element={<Guard endpoint={"/api/verify-token"} role="employee" />}
          >
            <Route index element={<EmployeeDashboard />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>

          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
