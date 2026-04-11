import { useEffect, useState } from "react";
import { getAllBooks, deleteBook, addBook, updateBook, getBookById } from "../api/booksApi";

const BooksPage = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [obj, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    genre: "",
    publishedYear: 0,
    totalCopies: 0,
    availableCopies: 0,
  });

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await getAllBooks();
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

  const handleDelete = async (id: number) => {
    try {
      await deleteBook(id);
      fetchBooks();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleSaveBook = async () => {
    try {
      if (editMode && selectedId !== null) {
        await updateBook({ ...obj, id: selectedId });
      } else {
        await addBook(obj);
      }
      setShowForm(false);
      setEditMode(false);
      setSelectedId(null);
      setFormData({
        title: "",
        author: "",
        isbn: "",
        genre: "",
        publishedYear: 0,
        totalCopies: 0,
        availableCopies: 0,
      });
      fetchBooks();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const res = await getBookById(id);
      console.log("Edit API response", res);
      console.log("Parsed book", res.data);
      const book = res.data.data ?? res.data;

      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        genre: book.genre,
        publishedYear: book.publishedYear,
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies,
      });

      setSelectedId(book.id);
      setEditMode(true);
      setShowForm(true);
    } catch (err) {
      console.error("Fetch book failed", err);
    }
  };

  return (
  <div className="space-y-6">

    {/* HEADER */}
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">📚 Books</h2>
        <p className="text-gray-400 text-sm">
          Manage your library collection
        </p>
      </div>

      <button
        onClick={() => setShowForm(true)}
        className="bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-2 rounded-lg font-semibold hover:scale-105 transition shadow-lg"
      >
        + Add Book
      </button>
    </div>

    {/* FORM (MODERN CARD STYLE) */}
    {showForm && (
      <div className="bg-white/5 backdrop-blur-xl p-6 rounded-xl border border-white/10 shadow-xl space-y-4">

        <h3 className="text-lg font-semibold">
          {editMode ? "✏️ Update Book" : "➕ Add New Book"}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <input
            value={obj.title}
            placeholder="Title"
            className="input"
            onChange={(e) => setFormData({ ...obj, title: e.target.value })}
          />
          <input
            value={obj.author}
            placeholder="Author"
            className="input"
            onChange={(e) => setFormData({ ...obj, author: e.target.value })}
          />
          <input
            value={obj.isbn}
            placeholder="ISBN"
            className="input"
            onChange={(e) => setFormData({ ...obj, isbn: e.target.value })}
          />
          <input
            value={obj.genre}
            placeholder="Genre"
            className="input"
            onChange={(e) => setFormData({ ...obj, genre: e.target.value })}
          />
          <input
            type="number"
            value={obj.publishedYear}
            placeholder="Year"
            className="input"
            onChange={(e) =>
              setFormData({ ...obj, publishedYear: Number(e.target.value) })
            }
          />
          <input
            type="number"
            value={obj.totalCopies}
            placeholder="Total Copies"
            className="input"
            onChange={(e) =>
              setFormData({ ...obj, totalCopies: Number(e.target.value) })
            }
          />
          <input
            type="number"
            value={obj.availableCopies}
            placeholder="Available Copies"
            className="input"
            onChange={(e) =>
              setFormData({
                ...obj,
                availableCopies: Number(e.target.value),
              })
            }
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSaveBook}
            className={`px-5 py-2 rounded-lg font-semibold shadow ${
              editMode
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {editMode ? "Update Book" : "Save Book"}
          </button>

          <button
            onClick={() => {
              setShowForm(false);
              setEditMode(false);
            }}
            className="px-5 py-2 rounded-lg bg-gray-600 hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    )}

    {/* TABLE CARD */}
    <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 shadow-lg overflow-hidden">

      {loading ? (
        <div className="p-6 text-center text-gray-400">Loading...</div>
      ) : (
        <table className="w-full text-left">
          <thead className="bg-white/10 text-gray-300">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Author</th>
              <th className="p-4">Genre</th>
              <th className="p-4">Available</th>
              <th className="p-4">Total</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {books.map((book: any) => (
              <tr
                key={book.id}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
                <td className="p-4 font-medium">{book.title}</td>
                <td className="p-4">{book.author}</td>
                <td className="p-4 text-gray-400">{book.genre}</td>
                <td className="p-4">{book.availableCopies}</td>
                <td className="p-4">{book.totalCopies}</td>

                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(book.id)}
                    className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded-lg text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(book.id)}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-sm"
                  >
                    Delete
                  </button>
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

export default BooksPage;