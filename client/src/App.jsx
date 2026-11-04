import { lazy, Suspense, useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./Pages/Login";
import { useAuth } from "./context/AuthContext";
import { getTransactions } from "./services/TransactionService.js";
import toast from "react-hot-toast";

// Lazy loaded pages
const Dashboard = lazy(() => import("./Pages/Dashboard.jsx"));
const ManualEntry = lazy(() => import("./Pages/ManualEntry.jsx"));
const Transactions = lazy(() => import("./Pages/Transactions.jsx"));
const Calendar = lazy(() => import("./Pages/Calendar.jsx"));
const ExpensePieChart = lazy(() =>
  import("./Pages/ExpensePieChart.jsx")
);
const MonthlyBarChart = lazy(() =>
  import("./Pages/MonthlyBarChart.jsx")
);
const AISmartEntry = lazy(() =>
  import("./Pages/AiExpenseEntry.jsx")
);

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
    </div>
  );
}

function PlaceholderPage({ title, description }) {
  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-slate-800">
        {title}
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>

      <div className="mt-8 flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center">
        <p className="text-sm text-slate-400">
          This feature is coming soon.
        </p>
      </div>
    </div>
  );
}

function Reports() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getTransactions();

        const data = Array.isArray(response)
          ? response
          : response?.transactions ??
            response?.data?.transactions ??
            response?.data ??
            [];

        if (!Array.isArray(data)) {
          throw new Error("Unexpected transactions API response.");
        }

        setTransactions(data);
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Unable to load transactions.";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Reports
        </h1>

        <p className="mt-2 text-slate-500">
          Analyze your monthly spending and financial trends.
        </p>
      </header>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Suspense fallback={<PageLoader />}>
          <ExpensePieChart transactions={transactions} />
        </Suspense>

        <Suspense fallback={<PageLoader />}>
          <MonthlyBarChart transactions={transactions} />
        </Suspense>
      </div>
    </div>
  );
}

// Active page name based on URL
const pageNames = {
  "/dashboard": "Dashboard",
  "/transactions": "Transactions",
  "/manual-entry": "Manual Entry",
  "/reports": "Reports",
  "/ai-entry": "AI Smart Entry",
  "/calendar": "Calendar",
  "/settings": "Settings",
};

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const activePage = pageNames[location.pathname] || "Dashboard";

  // Sidebar ke existing setActivePage prop ko preserve karna
  const setActivePage = (page) => {
    const paths = {
      Dashboard: "/dashboard",
      Transactions: "/transactions",
      "Manual Entry": "/manual-entry",
      Reports: "/reports",
      "AI Smart Entry": "/ai-entry",
      Calendar: "/calendar",
      Settings: "/settings",
    };

    if (paths[page]) {
      navigate(paths[page]);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
    toast.success("Logged out successfully");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="min-w-0 flex-1">
        <div className="flex justify-end border-b border-slate-200 bg-white p-3">
          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}

// Already logged-in user should not see Login page
function LoginRoute() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated
    ? <Navigate to="/dashboard" replace />
    : <Login />;
}

export default function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<LoginRoute />} />

      {/* All routes below are protected */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
        <Route
           path="/dashboard"
            element={<Dashboard />}
/>
          <Route
            path="/transactions"
            element={<Transactions />}
          />

          <Route
            path="/manual-entry"
            element={<ManualEntry />}
          />

          <Route
            path="/reports"
            element={<Reports />}
          />

          <Route
            path="/ai-entry"
            element={<AISmartEntry />}
          />

          <Route
            path="/calendar"
            element={<Calendar />}
          />

          <Route
            path="/settings"
            element={
              <PlaceholderPage
                title="Settings"
                description="Manage your account and application preferences."
              />
            }
          />
        </Route>
      </Route>

      {/* Default route */}
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* Invalid route */}
      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}