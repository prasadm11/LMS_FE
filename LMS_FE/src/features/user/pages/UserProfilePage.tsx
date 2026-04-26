import { useEffect, useState } from "react";
import { getUserById, updateUser } from "../api/userApi";
import { getUserFromToken } from "../../../utils/auth";

const UserProfilePage = () => {
  const [userData, setUserData] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const user = getUserFromToken();
  const userId =
    user?.decodedToken[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ];

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await getUserById(userId);
      setUserData(res.data);
      setFormData(res.data);
    } catch (err) {
      console.error("User fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    try {
      await updateUser(formData);
      showToast("Profile updated successfully");
      setEditMode(false);
      fetchUser();
    } catch (err) {
      console.error("Update failed", err);
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
        <h2 className="text-2xl font-bold">👤 Profile</h2>
        <p className="text-gray-400 text-sm">
          Manage your account details
        </p>
      </div>

      {loading || !userData ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {/* CARD */}
          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-xl border border-white/10 space-y-4">

            {/* NAME */}
            <div>
              <label className="text-gray-400 text-sm">Full Name</label>
              {editMode ? (
                <input
                  className="input mt-1"
                  value={formData.firstName + " " + formData.lastName}
                  onChange={(e) => {
                    const [firstName, lastName] = e.target.value.split(" ");
                    setFormData({ ...formData, firstName, lastName });
                  }}
                />
              ) : (
                <p className="mt-1">
                  {userData.firstName} {userData.lastName}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-gray-400 text-sm">Email</label>
              {editMode ? (
                <input
                  className="input mt-1"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              ) : (
                <p className="mt-1">{userData.email}</p>
              )}
            </div>

            {/* CITY */}
            <div>
              <label className="text-gray-400 text-sm">City</label>
              {editMode ? (
                <input
                  className="input mt-1"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
              ) : (
                <p className="mt-1">{userData.city}</p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <label className="text-gray-400 text-sm">Phone</label>
              {editMode ? (
                <input
                  className="input mt-1"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                />
              ) : (
                <p className="mt-1">{userData.phoneNumber}</p>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 pt-4">
              {editMode ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => {
                      setEditMode(false);
                      setFormData(userData);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
                >
                  Edit Profile
                </button>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default UserProfilePage;