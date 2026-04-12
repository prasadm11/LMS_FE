import { useEffect, useState, useRef } from "react";
import { getAllBooks } from "../../api/booksApi";
import {
  borrowBook,
  checkBorrowEligibility,
  searchBooks
} from "../../../borrow/api/borrowApi";
import { getUserFromToken } from "../../../../utils/auth";

const UserBrowseBooksPage = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [eligibility, setEligibility] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const debounceRef = useRef<any>(null);

  const user = getUserFromToken();
  const userId = user?.decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await getAllBooks();
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching books", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      try {
        if (!value) {
          fetchBooks();
          return;
        }

        const res = await searchBooks(value);
        setBooks(res.data);
      } catch (err) {
        console.error("Search failed", err);
      }
    }, 1000);
  };

  const fetchEligibility = async () => {
    try {
      const res = await checkBorrowEligibility(userId);
      setEligibility(res.data);
    } catch (err) {
      console.error("Eligibility error", err);
    }
  };

  const handleBorrow = async (bookId: number) => {
    try {
      const res = await borrowBook({
        userId,
        bookId,
        notes: "Borrowed via UI",
      });

      setToast(res.data.message);

      setTimeout(() => setToast(null), 3000);

      fetchBooks();
      fetchEligibility();
    } catch (err) {
      console.error("Borrow failed", err);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchEligibility();

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">📚 Browse Books</h2>
        <p className="text-gray-400 text-sm">
          Explore and borrow books from library
        </p>
      </div>

      {/* SEARCH */}
      <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center gap-2">
        <span>🔍</span>
        <input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search books by title or author..."
          className="bg-transparent outline-none w-full text-sm"
        />
      </div>

      {/* ELIGIBILITY */}
      {eligibility && (
        <div
          className={`p-4 rounded-xl text-sm ${
            eligibility.isEligible
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {eligibility.message}
        </div>
      )}

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
                <th className="p-4">Title</th>
                <th className="p-4">Author</th>
                <th className="p-4">Genre</th>
                <th className="p-4">Available</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {books.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400">
                    No books found
                  </td>
                </tr>
              ) : (
                books.map((book: any) => (
                  <tr
                    key={book.id}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="p-4 font-medium">{book.title}</td>
                    <td className="p-4">{book.author}</td>
                    <td className="p-4 text-gray-400">{book.genre}</td>
                    <td className="p-4">
                      {book.availableCopies > 0 ? (
                        <span className="text-green-400">Available ({book.availableCopies})</span>
                      ) : (
                        <span className="text-red-400">Out of Stock</span>
                      )}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleBorrow(book.id)}
                        disabled={
                          book.availableCopies === 0 || !eligibility?.isEligible
                        }
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                          book.availableCopies === 0 || !eligibility?.isEligible
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        Borrow
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

export default UserBrowseBooksPage;