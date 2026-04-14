import { useEffect, useState } from "react";
import {
  getUserBorrowHistory,
  payFine,
} from "../../../borrow/api/borrowApi";
import {
  createReturnRequest,
  createRenewRequest,
} from "../../../borrow/api/borrowRequest";
import { getUserFromToken } from "../../../../utils/auth";

const UserMyBooksPage = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const user = getUserFromToken();
  const userId =
    user?.decodedToken[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ];

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await getUserBorrowHistory(userId);
      setBooks(res.data);
    } catch (err) {
      console.error("Fetch history failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleReturn = async (borrowId: number) => {
    try {
      await createReturnRequest({ borrowRecordId: borrowId });
      showToast("Return request sent for approval");
      fetchBooks();
    } catch (err) {
      console.error("Return failed", err);
    }
  };

  const handleRenew = async (borrowId: number) => {
    try {
      await createRenewRequest({ borrowRecordId: borrowId });
      showToast("Renew request sent for approval");
      fetchBooks();
    } catch (err) {
      console.error("Renew failed", err);
    }
  };

  const handlePayFine = async (borrowId: number) => {
    try {
      await payFine({ borrowId });
      showToast("Fine paid successfully");
      fetchBooks();
    } catch (err) {
      console.error("Payment failed", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-green-400";
      case "Returned":
        return "text-gray-400";
      case "Overdue":
        return "text-red-400";
      case "ReturnedLate":
        return "text-yellow-400";
      default:
        return "text-white";
    }
  };

  return (
    <div className="space-y-6">
      {/* TOAST */}
      {toast && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">📖 My Books</h2>
        <p className="text-gray-400 text-sm">
          Manage your borrowed books
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-white/10 text-gray-300">
              <tr>
                <th className="p-4">Book</th>
                <th className="p-4">Borrowed</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Fine</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {books.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-400">
                    📭 No borrowed books yet
                  </td>
                </tr>
              ) : (
                books.map((item: any) => (
                  <tr
                    key={item.borrowId}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="p-4 font-medium">
                      {item.bookTitle}
                    </td>

                    <td className="p-4">
                      {new Date(item.borrowedAt).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      {new Date(item.dueDate).toLocaleDateString()}
                    </td>

                    <td className={`p-4 font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </td>

                    <td className="p-4">
                      {item.fineAmount > 0 ? (
                        <span className="text-red-400">
                          ₹{item.fineAmount}{" "}
                          {!item.finePaid && "(Unpaid)"}
                        </span>
                      ) : (
                        <span className="text-green-400">₹0</span>
                      )}
                    </td>

                    <td className="p-4 flex gap-2">
                      {item.status === "Active" && (
                        <>
                          <button
                            onClick={() => handleRenew(item.borrowId)}
                            className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-lg text-sm"
                          >
                            Renew
                          </button>

                          <button
                            onClick={() => handleReturn(item.borrowId)}
                            className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded-lg text-sm"
                          >
                            Return
                          </button>
                        </>
                      )}

                      {item.status === "Overdue" && (
                        <>
                          <button
                            onClick={() => handleReturn(item.borrowId)}
                            className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded-lg text-sm"
                          >
                            Return
                          </button>

                          {item.fineAmount > 0 && !item.finePaid && (
                            <button
                              onClick={() => handlePayFine(item.borrowId)}
                              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-sm"
                            >
                              Pay Fine
                            </button>
                          )}
                        </>
                      )}

                      {item.status === "Returned" && (
                        <span className="text-gray-400 text-sm">
                          Completed
                        </span>
                      )}
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

export default UserMyBooksPage;