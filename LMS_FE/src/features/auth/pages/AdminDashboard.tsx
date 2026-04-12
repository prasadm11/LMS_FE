import { useEffect, useState } from "react";
import { getAllBooks } from "../../book/api/booksApi";
import { getAllUsers } from "../../user/api/userApi";
import {
  getBorrowSummary,
  getOverdueBooks,
  getBooksByStatus,
} from "../../borrow/api/borrowApi";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";


const COLORS = ["#3b82f6", "#22c55e", "#ef4444", "#f59e0b"];


const AdminDashboard = () => {
  const [booksCount, setBooksCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [summary, setSummary] = useState<any>(null);
  const [overdue, setOverdue] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [booksRes, usersRes, summaryRes, overdueRes, recentRes] =
        await Promise.all([
          getAllBooks(),
          getAllUsers(),
          getBorrowSummary(),
          getOverdueBooks(),
          getBooksByStatus("Active"),
        ]);

      setBooksCount(booksRes.data.length);
      setUsersCount(usersRes.data.length);
      setSummary(summaryRes.data);
      setOverdue(overdueRes.data);
      setRecent(recentRes.data.slice(0, 5)); // latest 5

    } catch (err) {
      console.error("Dashboard error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10 items-center h-full">
        <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full"></div>
      </div>
    );
  }
  const borrowChartData = summary
  ? [
      { name: "Active", value: summary.active },
      { name: "Returned", value: summary.returned },
      { name: "Overdue", value: summary.overdue },
      { name: "Late", value: summary.returnedLate },
    ]
  : [];

const systemData = [
  { name: "Books", value: booksCount },
  { name: "Users", value: usersCount },
  { name: "Borrowed", value: summary?.totalBorrowed || 0 },
];

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold tracking-wide">📊 Admin Dashboard</h2>
        <p className="text-gray-400 text-sm">
          Overview of your library system
        </p>
      </div>

      {/* STATS */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

          <div className="bg-gradient-to-br from-white/5 to-white/10 p-5 rounded-2xl text-center shadow-md hover:scale-[1.02] transition">
            <p className="text-gray-400 text-sm">Books</p>
            <h3 className="text-xl font-bold">{booksCount}</h3>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-white/10 p-5 rounded-2xl text-center shadow-md hover:scale-[1.02] transition">
            <p className="text-gray-400 text-sm">Users</p>
            <h3 className="text-xl font-bold">{usersCount}</h3>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-white/10 p-5 rounded-2xl text-center shadow-md hover:scale-[1.02] transition">
            <p className="text-gray-400 text-sm">Borrowed</p>
            <h3 className="text-xl font-bold">
              {summary.totalBorrowed}
            </h3>
          </div>

          <div className="bg-red-500/20 p-4 rounded-xl text-center">
            <p className="text-red-300 text-sm">Overdue</p>
            <h3 className="text-xl font-bold text-red-400">
              {summary.overdue}
            </h3>
          </div>

          <div className="bg-green-500/20 p-4 rounded-xl text-center">
            <p className="text-green-300 text-sm">Fine</p>
            <h3 className="text-xl font-bold text-green-400">
              ₹ {summary.totalFineCollected}
            </h3>
          </div>

        </div>
      )}

      {/* OVERDUE ALERTS */}
      <div className="bg-gradient-to-br from-white/5 to-white/10 p-6 rounded-2xl shadow-md">
        <h3 className="text-red-400 font-semibold mb-4">
          ⚠ Overdue Alerts
        </h3>

        {overdue.length === 0 ? (
          <p className="text-gray-400">No overdue books 🎉</p>
        ) : (
          <div className="space-y-2">
            {overdue.slice(0, 3).map((item: any) => (
              <div
                key={item.borrowId}
                className="border-b border-white/10 pb-2"
              >
                <p className="text-sm">
                  <span className="font-semibold">
                    {item.firstName} {item.lastName}
                  </span>{" "}
                  has{" "}
                  <span className="text-yellow-300">
                    {item.bookTitle}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RECENT BORROW */}
      <div className="bg-gradient-to-br from-white/5 to-white/10 p-6 rounded-2xl shadow-md">
        <h3 className="font-semibold mb-4">
          📚 Recent Borrow Activity
        </h3>

        {recent.length === 0 ? (
          <p className="text-gray-400">No activity</p>
        ) : (
          <table className="w-full text-left">
            <thead className="text-gray-400">
              <tr>
                <th>User</th>
                <th>Book</th>
                <th>Due Date</th>
              </tr>
            </thead>

            <tbody>
              {recent.map((item: any) => (
                <tr
                  key={item.borrowId}
                  className="border-t border-white/10"
                >
                  <td className="py-2">
                    {item.firstName} {item.lastName}
                  </td>
                  <td>{item.bookTitle}</td>
                  <td>
                    {new Date(item.dueDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

  {/* BORROW STATUS PIE */}
  <div className="bg-gradient-to-br from-white/5 to-white/10 p-6 rounded-2xl shadow-md">
    <h3 className="mb-4 font-semibold">📊 Borrow Status</h3>

    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <defs>
          <linearGradient id="colorActive" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
          <linearGradient id="colorReturned" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
          <linearGradient id="colorOverdue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#f87171" />
          </linearGradient>
          <linearGradient id="colorLate" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>

        <Pie
          data={borrowChartData}
          dataKey="value"
          innerRadius={50}
          outerRadius={85}
          paddingAngle={3}
        >
          {borrowChartData.map((_, index) => {
            const gradients = [
              "url(#colorActive)",
              "url(#colorReturned)",
              "url(#colorOverdue)",
              "url(#colorLate)",
            ];
            return <Cell key={index} fill={gradients[index]} />;
          })}
        </Pie>

        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "none",
            borderRadius: "8px",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
      {borrowChartData.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: COLORS[index] }} />
          <span className="text-gray-300">{item.name}</span>
          <span className="ml-auto font-semibold">{item.value}</span>
        </div>
      ))}
    </div>
  </div>

  {/* SYSTEM OVERVIEW BAR */}
  <div className="bg-gradient-to-br from-white/5 to-white/10 p-6 rounded-2xl shadow-md">
    <h3 className="mb-4 font-semibold">📊 System Overview</h3>

    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={systemData} barSize={40}>
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
        </defs>

        <XAxis
          dataKey="name"
          stroke="#9ca3af"
          tick={{ fontSize: 12 }}
        />
        <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "none",
            borderRadius: "8px",
          }}
        />

        <Bar
          dataKey="value"
          fill="url(#barGradient)"
          radius={[10, 10, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>

</div>

    </div>
  );
};

export default AdminDashboard;