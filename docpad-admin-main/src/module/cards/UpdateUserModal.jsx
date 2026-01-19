import React from "react";

function UpdateUserModal({ open, userData, onClose, onSubmit, loading }) {
  const [form, setForm] = React.useState({
    username: userData.username,
    email: userData.email,
    role: userData.role,
  });

  React.useEffect(() => {
    setForm({
      username: userData.username,
      email: userData.email,
      role: userData.role,
    });
  }, [userData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center
      transition-opacity duration-300
      ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      bg-black/40 backdrop-blur-sm`}
      aria-hidden={!open}
    >
      <div
        className={`
          bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl border border-gray-200
          transform transition-all duration-300
          ${open ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
      >
        <h2 className="text-2xl font-semibold mb-5 text-center text-gray-800">
          Update User
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600 font-medium">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-900 
              focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600 font-medium">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-900 
              focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Role */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600 font-medium">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-900 
              focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            >
              <option value="owner">Restaurant Owner</option>
              <option value="staff">Kitchen Staff</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`
              w-full py-2 rounded-lg text-white font-medium 
              bg-blue-600 shadow-md transition-all duration-200 
              ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700 hover:scale-[1.02]"}
            `}
          >
            {loading ? "Updating..." : "Update User"}
          </button>

          {/* Cancel */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-lg border text-gray-700 bg-gray-200 
            hover:bg-gray-300 shadow-sm transition"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateUserModal;
