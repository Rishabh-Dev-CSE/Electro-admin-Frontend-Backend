export default function SecuritySettings() {
  return (
    <form className="space-y-4">
      <input className="input" placeholder="Max login attempts" />
      <select className="input">
        <option>OTP Enabled</option>
        <option>OTP Disabled</option>
      </select>
      <button className="btn-primary">Save</button>
    </form>
  );
}
