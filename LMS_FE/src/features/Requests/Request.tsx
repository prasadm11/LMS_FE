import { useEffect, useState } from "react";
import { getAllPendingRequests,approveRequest,rejectRequest, } from "../borrow/api/borrowRequest";

const Request = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await getAllPendingRequests();
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const res = await approveRequest(id);
      setToast(res?.data?.message );
      fetchRequests();
    } catch (err) {
      console.error("Approve failed", err);
    }
  };

  const handleReject = async (id: number) => {
    try {
      const res = await rejectRequest(id);
      setToast(res?.data?.message );
      fetchRequests();
    } catch (err) {
      console.error("Reject failed", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">📩 Request Management</h2>
        <p className="text-gray-400 text-sm">
          Approve or reject borrow, return and renew requests
        </p>
      </div>

      {/* Table */}
      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-white/10 text-gray-300">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Book</th>
                <th className="p-4">Type</th>
                <th className="p-4">Date</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400">
                    No pending requests
                  </td>
                </tr>
              ) : (
                requests.map((req: any) => (
                  <tr key={req.id} className="border-t border-white/10">
                    <td className="p-4">{req.userId}</td>
                    <td className="p-4">
                      {req.bookId || req.borrowRecordId}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          req.type === "Borrow"
                            ? "bg-blue-500/20 text-blue-400"
                            : req.type === "Return"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-purple-500/20 text-purple-400"
                        }`}
                      >
                        {req.type}
                      </span>
                    </td>
                    <td className="p-4">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Request;