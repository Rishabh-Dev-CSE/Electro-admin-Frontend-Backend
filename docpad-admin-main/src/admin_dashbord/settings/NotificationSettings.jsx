export default function NotificationSettings() {
  return (
    <div className="space-y-3">
      <label><input type="checkbox" /> Email</label>
      <label><input type="checkbox" /> SMS</label>
      <label><input type="checkbox" /> WhatsApp</label>
      <button className="btn-primary">Save</button>
    </div>
  );
}
