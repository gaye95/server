import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.js";

dotenv.config(); // Charger les variables d'environnement

const app = express();

// ✅ Activer CORS
app.use(
  cors({
    origin: "http://localhost:5174", // Autoriser uniquement cette origine
    credentials: true, // Autoriser l'envoi de cookies/tokens avec la requête
  })
);

// ✅ Middleware pour parser le JSON et les cookies
app.use(express.json());
app.use(cookieParser());

// ✅ Connexion à MongoDB avec gestion des erreurs

mongoose
  .connect(
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/authentication",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("✅ Connexion MongoDB réussie"))
  .catch((err) => console.error("❌ Erreur de connexion MongoDB:", err));

// ✅ Utiliser le routeur des utilisateurs
app.use("/auth", userRouter);

// ✅ Démarrer le serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
