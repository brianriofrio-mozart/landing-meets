import { useState } from "react";
import { Phone, Hash, Bot, Radio, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const OutboundModal = () => {
  const [formData, setFormData] = useState({
    agent_id: '',
    agent_phone_number_id: '',
    to_number: '', 
    pin: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCall = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/llamadaMeet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Error en la conexión SIP');

      // AJUSTE: ElevenLabs SIP Trunk devuelve 'conversation_id' o 'call_id'
      const idLlamada = data.conversation_id || data.call_id || 'Iniciada';

      setStatus({ 
        type: 'success', 
        msg: `Llamada en curso`, 
        subMsg: `ID: ${idLlamada}` 
      });
    } catch (error) {
      setStatus({ 
        type: 'error', 
        msg: 'Fallo al conectar', 
        subMsg: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
          <div className={`icon-container ${loading ? 'pulse' : ''}`}>
            <Bot size={40} color="#60a5fa" />
          </div>
        </div>
        
        <h1>Meet Connector AI</h1>
        <p className="subtitle">Infraestructura SIP Trunk Activa</p>

        <form onSubmit={handleCall}>
          <div className="input-group">
            <label><Bot size={14}/> ID del Agente</label>
            <input 
              type="text" 
              name="agent_id" 
              placeholder="Agent ID" 
              value={formData.agent_id}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label><Bot size={14}/> ID del Telefono</label>
            <input 
              type="text" 
              name="agent_phone_number_id" 
              placeholder="Agent Phone Number ID" 
              value={formData.agent_phone_number_id}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label><Phone size={14}/> Número Google Meet</label>
            <input 
              type="tel" 
              name="to_number" 
              placeholder="+57..." 
              required 
              value={formData.to_number}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label><Hash size={14}/> PIN de Reunión</label>
            <input 
              type="text" 
              name="pin" 
              placeholder="000 000#..." 
              required 
              value={formData.pin}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn-call" disabled={loading}>
            {loading ? <Loader2 className="spin" size={20} /> : <Radio size={20} />}
            {loading ? 'Estableciendo enlace SIP...' : 'Llamar a la Reunión'}
          </button>
        </form>

        {status && (
          <div className={`status-msg ${status.type === 'success' ? 'status-success' : 'status-error'}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {status.type === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
              <div>
                <strong>{status.msg}</strong>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{status.subMsg}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


export default OutboundModal;