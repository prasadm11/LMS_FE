import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getBorrowSummary,
  getDueBookSoon,
  getOverdueBooks,
  getUserBorrowHistory,
  checkBorrowEligibility,
} from "../../borrow/api/borrowApi";
import { getUserFromToken } from "../../../utils/auth";

const UserDashboard = () => {
  const navigate = useNavigate();

  const [summary, setSummary] = useState<any>(null);
  const [dueSoon, setDueSoon] = useState<any[]>([]);
  const [overdue, setOverdue] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [eligibility, setEligibility] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const user = getUserFromToken();
  const userId =
    user?.decodedToken[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ];

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [summaryRes, dueRes, overdueRes, historyRes, eligibilityRes] =
        await Promise.all([
          getBorrowSummary(),
          getDueBookSoon(2),
          getOverdueBooks(),
          getUserBorrowHistory(userId),
          checkBorrowEligibility(userId),
        ]);

      setSummary(summaryRes.data);
      setDueSoon(dueRes.data);

      // filter overdue only for current user
      const userOverdue = overdueRes.data.filter(
        (item: any) => item.userId === userId
      );
      setOverdue(userOverdue);

      setRecent(historyRes.data.slice(0, 5));
      setEligibility(eligibilityRes.data);
    } catch (err) {
      console.error("User dashboard error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);


  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold">📊 Dashboard</h2>
        <p className="text-gray-400 text-sm">
          Overview of your library activity
        </p>
      </div>
      {loading ? (
        <div className="flex justify-center py-10 min-h-[50vh]">
          <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>

      {/* SUMMARY */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 p-4 rounded-xl text-center">
            <p className="text-gray-400 text-sm">Active</p>
            <h3 className="text-xl font-bold">{summary.active}</h3>
          </div>

          <div className="bg-white/5 p-4 rounded-xl text-center">
            <p className="text-gray-400 text-sm">Returned</p>
            <h3 className="text-xl font-bold">{summary.returned}</h3>
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

      {/* ELIGIBILITY */}
      {eligibility && (
        <div
          className={`p-4 rounded-xl text-sm ${
            eligibility.isEligible
              ? "bg-green-500/20 text-green-300"
              : "bg-red-500/20 text-red-300"
          }`}
        >
          {eligibility.message}
        </div>
      )}

      {/* ALERTS */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* DUE SOON */}
        <div className="bg-white/5 p-5 rounded-xl">
          <h3 className="mb-3 font-semibold text-yellow-400">⏳ Due Soon</h3>

          {dueSoon.length === 0 ? (
            <p className="text-gray-400">No upcoming due books</p>
          ) : (
            <div className="space-y-2">
              {dueSoon.map((item: any) => (
                <div key={item.borrowId} className="text-sm">
                  {item.bookTitle} -{" "}
                  {new Date(item.dueDate).toLocaleDateString()}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* OVERDUE */}
        <div className="bg-white/5 p-5 rounded-xl">
          <h3 className="mb-3 font-semibold text-red-400">⚠ Overdue</h3>

          {overdue.length === 0 ? (
            <p className="text-gray-400">No overdue books 🎉</p>
          ) : (
            <div className="space-y-2">
              {overdue.map((item: any) => (
                <div key={item.borrowId} className="text-sm">
                  {item.bookTitle}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RECENT */}
      <div className="bg-white/5 p-6 rounded-xl">
        <h3 className="mb-4 font-semibold">📚 Recent Activity</h3>

        {recent.length === 0 ? (
          <p className="text-gray-400">No recent activity</p>
        ) : (
          <table className="w-full text-left">
            <thead className="text-gray-400">
              <tr>
                <th>Book</th>
                <th>Status</th>
                <th>Due</th>
              </tr>
            </thead>

            <tbody>
              {recent.map((item: any) => (
                <tr
                  key={item.borrowId}
                  className="border-t border-white/10"
                >
                  <td className="py-2">{item.bookTitle}</td>
                  <td>{item.status}</td>
                  <td>
                    {new Date(item.dueDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* QUICK ACTIONS */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/user-books")}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
        >
          Browse Books
        </button>

        <button
          onClick={() => navigate("/user-borrowed")}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
        >
          My Books
        </button>
      </div>
        </>
      )}
    </div>
  );
};

export default UserDashboard;