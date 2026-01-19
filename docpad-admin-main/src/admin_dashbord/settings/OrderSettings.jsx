export default function OrderSettings() {
  return (
    <form className="space-y-4">
      <input className="input" placeholder="Auto cancel (minutes)" />
      <input className="input" placeholder="Return window (days)" />
      <select className="input">
        <option>Manual Approval</option>
        <option>Auto Approval</option>
      </select>
      <button className="btn-primary">Save</button>
    </form>
  );
}
