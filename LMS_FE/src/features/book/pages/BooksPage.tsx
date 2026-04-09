import { useEffect, useState } from "react";
import { getAllBooks } from "../api/booksApi";


const BooksPage = () => {
  const [books, setBooks] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await getAllBooks();
      console.log("getallbooks called", data)
      setBooks(data.data);
    } catch (err) {
      console.error("Error fetching books", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);


  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">📚 Books</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-white/10">
            <thead className="bg-white/10">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Author</th>
                <th className="p-3">Genre</th>
                <th className="p-3">Available Copies </th>
                <th className="p-3">Total Copies</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {books.map((book : any) => (
                <tr
                  key={book.id}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="p-3">{book.title}</td>
                  <td className="p-3">{book.author}</td>
                  <td className="p-3">{book.genre || "-"}</td>
                  <td className="p-3">{book.availableCopies}</td>
                  <td className="p-3">{book.totalCopies}</td>

                  <td className="p-3 space-x-2">
                    <button className="bg-blue-500 px-3 py-1 rounded">
                      Edit
                    </button>

                    <button className="bg-red-500 px-3 py-1 rounded opacity-50 cursor-not-allowed">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BooksPage;