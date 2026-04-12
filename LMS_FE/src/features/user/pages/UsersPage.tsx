import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../api/userApi";

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">👤 Users</h2>

        <button className="bg-green-500 px-4 py-2 rounded">
          + Add User
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-white/5 p-4 rounded-xl">
          <table className="w-full text-left">
            <thead className="text-gray-400">
              <tr>
                <th className="p-3">Name</th>
                <th>Email</th>
                <th>City</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-white/10"
                >
                  <td className="p-3">
                    {user.firstName} {user.lastName}
                  </td>
                  <td>{user.email}</td>
                  <td>{user.city}</td>
                  <td>{user.role}</td>

                  <td className="space-x-2">
                    <button className="bg-yellow-500 px-3 py-1 rounded">
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 px-3 py-1 rounded"
                    >
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

export default UsersPage;