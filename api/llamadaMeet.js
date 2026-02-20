export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      agent_id,
      agent_phone_number_id,
      to_number,
      pin_meet
    } = req.body;

    // 🔒 Validaciones mínimas
    const phoneRegex = /^\+[1-9]\d{7,14}$/;

    if (!agent_id || !agent_phone_number_id) {
      return res.status(400).json({ error: "Missing agent data" });
    }

    if (!phoneRegex.test(to_number)) {
      return res.status(400).json({ error: "Invalid phone format" });
    }

    if (!pin_meet || pin_meet.length < 3) {
      return res.status(400).json({ error: "Invalid PIN" });
    }

    const body = {
        agent_id,
        agent_phone_number_id,
        to_number,
        "conversation_initiation_client_data": {
            "dynamic_variables": {
            "pin_meet": pin_meet
            }
        }
    };

    const response = await fetch(
      "https://api.elevenlabs.io/v1/convai/sip-trunk/outbound-call",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Call failed" });
  }
}