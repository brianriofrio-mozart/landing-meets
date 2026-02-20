import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import llamadaMeetHandler from "./api/llamadaMeet.js";

const app = express();
const PORT = 3001;

// ⚡ Permitir solicitudes desde tu Vite dev server
app.use(cors({
  origin: "http://localhost:5173", // el puerto de Vite
  methods: ["POST"]
}));

app.use(bodyParser.json());

// Ruta del handler
app.post("/api/llamadaMeet", llamadaMeetHandler);

app.listen(PORT, () => {
  console.log(`Servidor de pruebas corriendo en http://localhost:${PORT}`);
});