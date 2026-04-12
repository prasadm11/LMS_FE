import { useEffect, useState } from "react";
import {
  getBorrowSummary,
  getOverdueBooks,
  getDueBookSoon,
  getBooksByStatus,
} from "../../api/borrowApi";

const AdminBorrowDashboard = () => {
  const [summary, setSummary] = useState<any>(null);
  const [overdue, setOverdue] = useState<any[]>([]);
  const [dueSoon, setDueSoon] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<any>("Active");
  const [statusData, setStatusData] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const summaryRes = await getBorrowSummary();
      const overdueRes = await getOverdueBooks();
      const dueSoonRes = await getDueBookSoon(2);
      const statusRes = await getBooksByStatus("Active");

      setSummary(summaryRes.data);
      setOverdue(overdueRes.data);
      setDueSoon(dueSoonRes.data);
      setStatusData(statusRes.data);
      console.log("statusres is", statusRes);
    } catch (err) {
      console.error("Borrow dashboard error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: any) => {
    try {
      setStatus(newStatus);
      const res = await getBooksByStatus(newStatus);
      setStatusData(res.data);
    } catch (err) {
      console.error("Status Fetch Error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">📊 Borrow Dashboard</h2>
        <p className="text-gray-400 text-sm">
          Monitor borrowing activity & fines
        </p>
      </div>

      {/* SUMMARY CARDS */}
      {summary && (
        <div className="grid grid-cols-6 gap-4">
          <div className="bg-white/5 p-4 rounded-xl text-center">
            <p className="text-gray-400 text-sm">Total</p>
            <h3 className="text-xl font-bold">{summary.totalBorrowed}</h3>
          </div>

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

          <div className="bg-white/5 p-4 rounded-xl text-center">
            <p className="text-gray-400 text-sm">Late Returns</p>
            <h3 className="text-xl font-bold">{summary.returnedLate}</h3>
          </div>

          <div className="bg-green-500/20 p-4 rounded-xl text-center">
            <p className="text-green-300 text-sm">Fine</p>
            <h3 className="text-xl font-bold text-green-400">
              ₹ {summary.totalFineCollected}
            </h3>
          </div>
        </div>
      )}

      {/* OVERDUE */}
      <div className="bg-white/5 backdrop-blur-xl p-6 rounded-xl">
        <h3 className="mb-4 font-semibold text-red-400">⚠ Overdue Books</h3>

        {overdue.length === 0 ? (
          <p className="text-gray-400">No overdue books 🎉</p>
        ) : (
          <table className="w-full text-left">
            <thead className="text-gray-400">
              <tr>
                <th className="pb-3">User</th>
                <th className="pb-3">Book</th>
                <th className="pb-3">Due Date</th>
              </tr>
            </thead>

            <tbody>
              {overdue.map((item: any) => (
                <tr key={item.borrowId} className="border-t border-white/10">
                  <td className="py-3">
                    {item.firstName} {item.lastName}
                  </td>
                  <td>{item.bookTitle}</td>
                  <td>{new Date(item.dueDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* DUE SOON */}
      <div className="bg-white/5 backdrop-blur-xl p-6 rounded-xl">
        <h3 className="mb-4 font-semibold text-yellow-400">⏳ Due Soon</h3>

        {dueSoon.length === 0 ? (
          <p className="text-gray-400">No books due soon</p>
        ) : (
          <table className="w-full text-left">
            <thead className="text-gray-400">
              <tr>
                <th className="pb-3">User</th>
                <th className="pb-3">Book</th>
                <th className="pb-3">Due Date</th>
              </tr>
            </thead>

            <tbody>
              {dueSoon.map((item: any) => (
                <tr key={item.borrowId} className="border-t border-white/10">
                  <td className="py-3">
                    {item.firstName} {item.lastName}
                  </td>
                  <td>{item.bookTitle}</td>
                  <td>{new Date(item.dueDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* BORROW SECTION */}
      <div className="bg-white/5 backdrop-blur-xl p-6 rounded-xl space-y-4">

        {/* HEADER + TABS */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">📚 Borrow Records</h3>

          <div className="flex gap-2">
            {["Active", "Returned", "Overdue", "ReturnedLate"].map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                className={`px-3 py-1.5 rounded-lg text-sm transition ${
                  status === s
                    ? "bg-blue-500 text-white"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE */}
        {statusData.length === 0 ? (
          <p className="text-gray-400">No records found</p>
        ) : (
          <table className="w-full text-left">
            <thead className="text-gray-400">
              <tr>
                <th className="pb-3">User</th>
                <th className="pb-3">Book</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Due Date</th>
              </tr>
            </thead>

            <tbody>
              {statusData.map((item: any) => (
                <tr key={item.borrowId} className="border-t border-white/10">
                  <td className="py-3">
                    {item.firstName} {item.lastName}
                  </td>
                  <td>{item.bookTitle}</td>
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
    </div>
  );
};

export default AdminBorrowDashboard;
