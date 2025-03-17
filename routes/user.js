import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Enregistrer l'utilisateur dans la base de données
    await newUser.save();

    res
      .status(201)
      .json({ status: true, message: "Utilisateur créé avec succès." });
  } catch (error) {   
    console.error(error);
    res.status(500).json({ message: "Une erreur s'est produite." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Rechercher l'utilisateur dans la base de données
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Identifiant ou mot de passe incorrect." });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Identifiant ou mot de passe incorrect." });
    }

    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
    res.status(200).json({ status: true, message: "Connexion reussie." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur s'est produite." });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // forgot password
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: "erreur" });
    }
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "youremail@gmail.com",
        pass: "yourpassword",
      },
    });

    var mailOptions = {
      from: "youremail@gmail.com",
      to: "myfriend@yahoo.com",
      subject: "Sending Email using Node.js",
      text: "That was easy!",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur s'est produite." });
  }
});

export default router;
