
import { useEffect, useState } from "react";
import Header from "../components/Header";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Activity,
  RefreshCw,
} from "lucide-react";

import toast from "react-hot-toast";
import { getTransactions } from "../services/TransactionService.js";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount || 0);

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const response = await getTransactions();
      const data = response?.transactions ?? [];

      setTransactions(data);
    } catch (error) {
      console.error("Fetch transactions error:", error);

      toast.error(
        error.response?.data?.message ||
        "Unable to load transactions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Calculate income
  const income = transactions
    .filter(
      (item) => item.type?.toLowerCase() === "income"
    )
    .reduce(
      (total, item) => total + Number(item.amount || 0),
      0
    );

  // Calculate expenses
  const expenses = transactions
    .filter(
      (item) => item.type?.toLowerCase() === "expense"
    )
    .reduce(
      (total, item) => total + Number(item.amount || 0),
      0
    );

  const balance = income - expenses;

  const savings =
    income > 0 ? (balance / income) * 100 : 0;

  // Summary cards
  const summaryCards = [
    {
      title: "Total Balance",
      amount: formatCurrency(balance),
      icon: Wallet,
      color: "bg-violet-100 text-violet-600",
    },
    {
      title: "Total Income",
      amount: formatCurrency(income),
      icon: ArrowDownLeft,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Total Expenses",
      amount: formatCurrency(expenses),
      icon: ArrowUpRight,
      color: "bg-rose-100 text-rose-600",
    },
    {
      title: "Savings Rate",
      amount: `${savings.toFixed(1)}%`,
      icon: Activity,
      color: "bg-blue-100 text-blue-600",
    },
  ];

  // Latest 5 transactions
  const recentTransactions = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.date || b.createdAt || 0) -
        new Date(a.date || a.createdAt || 0)
    )
    .slice(0, 5);

  return (
    <>
      {/* Profile Header */}
      <Header />

      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

        {/* Dashboard Heading */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Track your income and expenses in one place.
            </p>
          </div>

          <button
            onClick={fetchTransactions}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </header>

        {/* Summary Cards */}
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map(
            ({ title, amount, icon: Icon, color }) => (
              <article
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">
                    {title}
                  </p>

                  <span className={`rounded-xl p-3 ${color}`}>
                    <Icon size={21} />
                  </span>
                </div>

                <p className="mt-5 break-words text-2xl font-bold text-slate-800">
                  {loading ? "Loading..." : amount}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  {transactions.length} recorded transactions
                </p>
              </article>
            )
          )}
        </section>

        {/* Financial Overview */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">
            Financial Overview
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Your financial summary is updated from your transactions.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="text-sm text-emerald-700">
                Income
              </p>
              <p className="mt-2 text-xl font-bold text-emerald-700">
                {formatCurrency(income)}
              </p>
            </div>

            <div className="rounded-xl bg-rose-50 p-4">
              <p className="text-sm text-rose-700">
                Expenses
              </p>
              <p className="mt-2 text-xl font-bold text-rose-700">
                {formatCurrency(expenses)}
              </p>
            </div>

            <div className="rounded-xl bg-violet-50 p-4">
              <p className="text-sm text-violet-700">
                Balance
              </p>
              <p className="mt-2 text-xl font-bold text-violet-700">
                {formatCurrency(balance)}
              </p>
            </div>
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Recent Transactions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your five latest transactions.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center text-sm text-slate-500">
              Loading transactions...
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">
              No transactions yet. Add your first transaction to see your financial activity here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left">

                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Description</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Amount</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {recentTransactions.map((item) => {
                    const isIncome =
                      item.type?.toLowerCase() === "income";

                    return (
                      <tr
                        key={item._id || item.id}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-5 py-4 font-medium text-slate-800">
                          {item.description ||
                            item.category ||
                            "Transaction"}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {item.category || "-"}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {formatDate(item.date || item.createdAt)}
                        </td>

                        <td
                          className={`whitespace-nowrap px-5 py-4 font-semibold ${
                            isIncome
                              ? "text-emerald-600"
                              : "text-rose-600"
                          }`}
                        >
                          {isIncome ? "+" : "-"}
                          {formatCurrency(
                            Number(item.amount || 0)
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>
          )}
        </section>

      </div>
    </>
  );
}
