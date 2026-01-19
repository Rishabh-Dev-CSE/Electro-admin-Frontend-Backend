export default function RoleSettings() {
  return (
    <div>
      <h3 className="font-semibold mb-3">Admin Permissions</h3>
      <label><input type="checkbox" /> Manage Products</label><br/>
      <label><input type="checkbox" /> Manage Orders</label><br/>
      <label><input type="checkbox" /> Manage Payments</label><br/>
      <label><input type="checkbox" /> Edit Settings</label>
    </div>
  );
}
