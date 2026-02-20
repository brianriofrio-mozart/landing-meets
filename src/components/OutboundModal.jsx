import { useState } from "react";

const OutboundModal = () => {
  const [formData, setFormData] = useState({
    agent_id: "",
    agent_phone_number_id: "",
    to_number: "",
    pin_meet: ""
  });

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setResponse(null);

  try {
    const res = await fetch("/api/llamadaMeet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setResponse(data);
  } catch (error) {
    setResponse({ error: "Error calling API" });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="modal modal--visible">
      <div className="modal__overlay"></div>

      <div className="modal__content">
        <h2 className="modal__title">Crear Llamada Outbound</h2>

        <form className="modal__form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="agent_id"
            placeholder="Agent ID"
            className="modal__input"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="agent_phone_number_id"
            placeholder="Agent Phone Number ID"
            className="modal__input"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="to_number"
            placeholder="+1234567890"
            className="modal__input"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="pin_meet"
            placeholder="PIN"
            className="modal__input"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="modal__submit"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Iniciar Llamada"}
          </button>
        </form>

        {response && (
          <pre className="modal__response">
            {JSON.stringify(response, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default OutboundModal;