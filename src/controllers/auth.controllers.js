import { db } from "../database/database.connection.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

export async function signUp(req, res) {
  const { name, email, password} = req.body;

  try {
    const user = await db.query(`SELECT * FROM users WHERE email = $1;`, [email]);

    if (user.rowCount > 0){
     return res.status(409).send("E-mail já foi cadastrado!");
    }

    const hash = bcrypt.hashSync(password, 10);

    await db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`, [name, email, hash]);

    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);

    if (user.rowCount === 0) {
    return res.status(401).send("Usuário/senha inválidos");
    }

    const isPasswordCorrect = bcrypt.compareSync(password, user.rows[0].password);

    if (!isPasswordCorrect) return res.status(401).send("Usuário/senha inválidos");

    const token = uuid();

    await db.query(`INSERT INTO sessions (token, "userId") VALUES ($1, $2);`, [token, user.rows[0].id]);

    res.send({ token });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

