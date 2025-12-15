import { pool } from "@/lib/db";
import bcrypt from "bcrypt";

async function seed() {
  const email = "admin@admin.com";
  const password = "admin123";

  const exists = await pool.query("SELECT * FROM users WHERE email=$1", [
    email,
  ]);

  if (exists.rows.length === 0) {
    await pool.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, 'admin')",
      [email, await bcrypt.hash(password, 10)]
    );

    console.log("Admin criado!");
  } else {
    console.log("Admin já existe.");
  }

  process.exit();
}

seed();
