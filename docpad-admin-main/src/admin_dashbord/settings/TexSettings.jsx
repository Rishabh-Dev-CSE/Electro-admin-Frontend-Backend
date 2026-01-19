export default function TaxSettings() {
  return (
    <form className="space-y-4">
      <select className="input">
        <option>GST Enabled</option>
        <option>GST Disabled</option>
      </select>
      <input className="input" placeholder="GST %" />
      <input className="input" placeholder="HSN Code (optional)" />
      <button className="btn-primary">Save</button>
    </form>
  );
}
