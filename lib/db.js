// lib/db.js
import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: "root",          // ton user MySQL
  password: "",          // ton mot de passe (si tu en as un)
  database: "gestion" // ⚠️ adapte au nom réel de ta base
});
