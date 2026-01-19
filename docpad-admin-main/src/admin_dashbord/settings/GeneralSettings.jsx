import { useEffect, useState } from "react";

export default function GeneralSettings() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/settings/general")
      .then(r => r.json())
      .then(setData);
  }, []);

  if (!data) return "Loading...";

  return (
    <form className="space-y-5">
      <input className="input" value={data.storeName} />
      <input className="input" value={data.storeUrl} />
      <select className="input">
        <option>INR</option>
        <option>USD</option>
      </select>
      <button className="btn-primary">Save</button>
    </form>
  );
}
