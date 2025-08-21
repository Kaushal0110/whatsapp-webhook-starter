const express = require("express");
const app = express();

// Set your verify token in Render's Environment as WHATSAPP_VERIFY_TOKEN
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "apitest";

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

// GET: Webhook verification
app.get("/whatsapp", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN && challenge) {
    return res.status(200).type("text/plain").send(challenge);
  }
  return res.sendStatus(403);
});

// POST: Incoming events
app.post("/whatsapp", (req, res) => {
  // Acknowledge immediately
  res.sendStatus(200);
  // Log payload for debugging
  try {
    console.log("Webhook event:", JSON.stringify(req.body, null, 2));
  } catch (e) {
    console.log("Webhook event (raw):", req.body);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server listening on port ${PORT}`);
});
