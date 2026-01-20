import { useEffect, useState } from "react";
import { apiGet, apiDelete, apiPostForm, apiUpdate } from "../../utils/api";
import StatCard from "../dashboard/StatCard";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [menuPos, setMenuPos] = useState(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "customer",
    image: null,
  });

  /* ================= FETCH ================= */
  const fetchUsers = async () => {
    const res = await apiGet("/api/users/list/");
    setUsers(res.users || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  
  /* ================= STATS ================= */
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.is_active).length;
  const blockedUsers = users.filter(u => !u.is_active).length;


  /* ================= FILTER ================= */
  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= CREATE ================= */
  const addUser = async () => {
    const fd = new FormData();
    Object.keys(form).forEach(key => {
      if (form[key]) fd.append(key, form[key]);
    });

    const res = await apiPostForm("/api/users/create/", fd);
    alert(res.message)
    setShowAdd(false);
    resetForm();
    fetchUsers();
  };

  /* ================= UPDATE ================= */
  const updateUser = async () => {
    const fd = new FormData();
    fd.append("username", form.username);
    fd.append("email", form.email);
    fd.append("role", form.role);
    fd.append("is_active", form.is_active ? "1" : "0");
    if (form.password) fd.append("password", form.password);
    if (form.image) fd.append("image", form.image);

    await apiUpdate(`/api/users/update/${selectedUser.id}/`, fd);

    setShowEdit(false);
    resetForm();
    fetchUsers();
  };

  /* ================= DELETE ================= */
  const deleteUser = async (id) => {
    if (!window.confirm("Delete user?")) return;
    const res = await apiDelete(`/api/users/delete/${id}/`);
    console.log(res.message)
    alert(res.message)
    fetchUsers();
  };

  /* ================= HELPERS ================= */
  const resetForm = () => {
    setForm({
      username: "",
      email: "",
      password: "",
      role: "customer",
      image: null,
      is_active: form.is_active,
    });
    setSelectedUser(null);
  };

  const openEdit = (u) => {
    setSelectedUser(u);
    setForm({
      username: u.username,
      email: u.email,
      password: "",
      role: u.role,
      image: null,
      is_active: u.is_active,
    });
    setShowEdit(true);
  };

  return (
    <div className="space-y-6">

    {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Users" value={totalUsers} icon="👥" type="pending" />
        <StatCard title="Active Users" value={activeUsers} icon="✅" type="delivered"/>
        <StatCard title="Blocked Users" value={blockedUsers} icon="🚫" type="cancelled" />
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-gray-500">Admin user management</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add User
        </button>
      </div>
      <div className="text-center">
        <h2 className=" text-blue-700"> _______________<u>All Users List</u>________________</h2>
      </div>
      {/* SEARCH */}
      <input
        className="w-full p-3 border rounded-lg"
        placeholder="Search user..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3">Image</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-right pr-4">Action</th>
            </tr>
          </thead>

          <tbody className="text-black">
            {filtered.map(u => (
              <tr key={u.id} className="border-b relative">
                <td className="p-2">
                  {u.image ? (
                    <img
                      src={u.image}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full" />
                  )}
                </td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td className="capitalize">{u.role}</td>
                <td>
                  <span className={`px-2 py-1 text-xs text-white rounded
                    ${u.is_active ? "bg-green-500" : "bg-red-500"}`}>
                    {u.is_active ? "Active" : "Blocked"}
                  </span>
                </td>

                {/* ACTION MENU */}
                <td className="text-right pr-4 relative ">
                  <button
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setMenuPos({
                        x: rect.right,
                        y: rect.bottom,
                        user: u,
                      });
                    }}
                    className="px-2 text-xl"
                  >
                    ⋮
                  </button>

                  {menuPos && (
                    <div
                      className="fixed inset-0 z-[9999]"
                      onClick={() => setMenuPos(null)}
                    >
                      <div
                        className="fixed bg-white border rounded-lg shadow-lg w-36"
                        style={{
                          top: menuPos.y + 6,
                          left: menuPos.x - 140,
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                          onClick={() => {
                            setSelectedUser(menuPos.user);
                            setShowView(true);
                            setMenuPos(null);
                          }}
                        >
                          View
                        </button>

                        <button
                          className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                          onClick={() => {
                            openEdit(menuPos.user);
                            setMenuPos(null);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                          onClick={() => {
                            deleteUser(menuPos.user.id);
                            setMenuPos(null);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}

                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT / VIEW MODALS */}
      {(showAdd || showEdit) && (
        <UserModal
          title={showAdd ? "Add User" : "Edit User"}
          form={form}
          setForm={setForm}
          onClose={() => {
            setShowAdd(false);
            setShowEdit(false);
            resetForm();
          }}
          onSave={showAdd ? addUser : updateUser}
        />
      )}

      {showView && selectedUser && (
        <UserDetails user={selectedUser} onClose={() => setShowView(false)} />
      )}
    </div>
  );
}

/* ================= MODAL COMPONENT ================= */
function UserModal({ title, form, setForm, onClose, onSave }) {
  return (
    <div className="fixed inset-0 bg-black/40  text-black flex items-center justify-center">
      <div className="bg-white w-96 p-6 rounded-xl space-y-4">
        <h2 className="font-semibold">{title}</h2>

        <input className="w-full p-2 border" placeholder="Username"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })} />

        <input className="w-full p-2 border" placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} />

        <input type="password" className="w-full p-2 border" placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })} />

        <select className="w-full p-2 border"
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={e => setForm({ ...form, is_active: e.target.checked })}
          />
          Is Active
        </label>

        <input type="file" onChange={e => setForm({ ...form, image: e.target.files[0] })} />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="border px-4 py-2">Cancel</button>
          <button onClick={onSave} className="bg-blue-600 text-white px-4 py-2">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= DETAILS MODAL ================= */

function UserDetails({ user, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

      {/* Modal Card */}
      <div className="w-[340px] rounded-2xl bg-white shadow-2xl p-6 relative animate-scaleIn">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-5">

          {user.image ?
            <img src={user.image} className="w-14 h-14 mx-auto rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl" />
            :
            <div className="w-14 h-14 mx-auto rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
              {user.username?.charAt(0).toUpperCase()}
            </div>
          }

          <h2 className="mt-3 text-lg font-semibold text-gray-800">
            User Details
          </h2>
        </div>

        {/* Details */}
        <div className="space-y-3 text-sm text-gray-700">
          <Detail label="Username" value={user.username} />
          <Detail label="Email" value={user.email} />
          <Detail label="Role" value={user.role} />

          {/* Status Badge */}
          <div className="flex justify-between items-center">
            <span className="font-medium">Status</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold
                ${user.is_active
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
                }`}
            >
              {user.is_active ? "Active" : "Blocked"}
            </span>
          </div>
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-indigo-600 text-white py-2 font-medium hover:bg-indigo-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* Reusable Row */
function Detail({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="font-medium">{label}</span>
      <span className="text-gray-600">{value}</span>
    </div>
  );
}
