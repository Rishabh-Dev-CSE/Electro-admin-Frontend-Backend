export default function ShippingSettings() {
  return (
    <form className="space-y-4">
      <input className="input" placeholder="Flat Shipping Charge" />
      <input className="input" placeholder="Free Shipping Above ₹" />
      <select className="input">
        <option>Weight Based</option>
        <option>Flat Rate</option>
      </select>
      <button className="btn-primary">Save</button>
    </form>
  );
}
