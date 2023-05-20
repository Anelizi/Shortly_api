import { nanoid } from "nanoid";
import { db } from "../database/database.connection";

export async function postUrl(req, res) {
  const { url } = req.body;
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", '');
  const shortUrl = nanoid();

  try {
    const user = await db.query(`SELECT "userId" FROM sessions WHERE token = $1;`, [token]);

    await db.query(`INSERT INTO urls (url, "shortUrl", "userId")
      VALUES ($1, $2, $3);`,
      [url, shortUrl, user.rows[0].userId]
    );

    const urls = await db.query(`SELECT id, "shortUrl"
      FROM urls WHERE "shortUrl" = $1 AND "userId" = $2;`,
      [shortUrl, user.rows[0].userId]
    );

    res.status(201).send(urls.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getId(req, res) {
  try {
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getOpen(req, res) {
  try {
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function deleteUrl(req, res) {
  try {
  } catch (error) {
    res.status(500).send(error.message);
  }
}
