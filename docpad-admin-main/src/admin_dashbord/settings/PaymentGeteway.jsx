import React, { useEffect, useState } from "react";

const PaymentGateway = () => {
  const [gateways, setGateways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  // 🔹 FETCH ALL GATEWAYS
  const fetchGateways = async () => {
    try {
      setLoading(true);

      // 🔁 Replace with real API later
      const response = await fetch("/api/payment-gateways");
      const data = await response.json();

      setGateways(data);
    } catch (err) {
      console.error("Failed to load gateways", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGateways();
  }, []);

  // 🔹 HANDLE INPUT CHANGE
  const handleChange = (id, field, value) => {
    setGateways((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, [field]: value } : g
      )
    );
  };

  // 🔹 SAVE / UPDATE GATEWAY
  const saveGateway = async (gateway) => {
    try {
      setSavingId(gateway.id);

      await fetch(`/api/payment-gateways/${gateway.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gateway),
      });

      alert(`${gateway.display_name} saved successfully`);
    } catch (err) {
      alert("Failed to save gateway");
    } finally {
      setSavingId(null);
    }
  };

  // 🔹 TOGGLE ACTIVE
  const toggleStatus = async (gateway) => {
    await saveGateway({
      ...gateway,
      is_active: !gateway.is_active,
    });
    fetchGateways();
  };

  // 🔹 SET DEFAULT
  const setDefault = async (gateway) => {
    await fetch(`/api/payment-gateways/set-default/${gateway.id}`, {
      method: "POST",
    });
    fetchGateways();
  };

  if (loading) {
    return <div className="p-4">Loading payment gateways...</div>;
  }

  return (
    <div className="container-fluid">
      <h4 className="page-title mb-4">Payment Gateway Accounts</h4>

      {gateways.length === 0 && (
        <div className="alert alert-warning">
          No payment gateways configured
        </div>
      )}

      {gateways.map((gateway) => (
        <div className="card p-4 mb-4" key={gateway.id}>
          <div className="d-flex justify-content-between mb-3">
            <h5>{gateway.display_name}</h5>

            <div>
              <button
                className={`btn btn-sm me-2 ${
                  gateway.is_active ? "btn-success" : "btn-outline-secondary"
                }`}
                onClick={() => toggleStatus(gateway)}
              >
                {gateway.is_active ? "Active" : "Inactive"}
              </button>

              <button
                className={`btn btn-sm ${
                  gateway.is_default
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => setDefault(gateway)}
              >
                {gateway.is_default ? "Default" : "Set Default"}
              </button>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Key ID</label>
              <input
                type="text"
                className="form-control"
                value={gateway.key_id || ""}
                onChange={(e) =>
                  handleChange(gateway.id, "key_id", e.target.value)
                }
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Secret Key</label>
              <input
                type="password"
                className="form-control"
                value={gateway.secret_key || ""}
                onChange={(e) =>
                  handleChange(gateway.id, "secret_key", e.target.value)
                }
              />
            </div>
          </div>

          <button
            className="btn btn-primary"
            disabled={savingId === gateway.id}
            onClick={() => saveGateway(gateway)}
          >
            {savingId === gateway.id ? "Saving..." : "Save Settings"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default PaymentGateway;
