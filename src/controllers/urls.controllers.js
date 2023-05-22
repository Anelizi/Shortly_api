import { nanoid } from "nanoid";
import { db } from "../database/database.connection.js";

export async function postUrl(req, res) {
  const { url } = req.body;
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  const shortUrl = nanoid();

  try {
    const user = await db.query(
      `SELECT "userId" FROM sessions WHERE token = $1;`,
      [token]
    );

    await db.query(
      `INSERT INTO urls (url, "shortUrl", "userId")
      VALUES ($1, $2, $3);`,
      [url, shortUrl, user.rows[0].userId]
    );

    const urls = await db.query(
      `SELECT id, "shortUrl"
      FROM urls WHERE "shortUrl" = $1 AND "userId" = $2;`,
      [shortUrl, user.rows[0].userId]
    );

    res.status(201).send("ok");
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getId(req, res) {
  const { id } = req.params;

  if (!parseInt(id)) return res.sendStatus(404);

  try {
    const url = await db.query(`SELECT id, url, "shortUrl" 
       FROM urls WHERE id = $1;`,
      [id]
    );

    if (url.rowCount === 0) return res.sendStatus(404);

    res.status(200).send(url.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getOpen(req, res) {
  const { shortUrl } = req.params;
  try {
    const open = await db.query(`SELECT * FROM urls WHERE "shortUrl" = $1;`, [shortUrl])

    if (open.rowCount === 0) return res.sendStatus(404)

    await db.query(`UPDATE urls SET "visitCount" = "visitCount" + 1 WHERE "shortUrl" = $1;`, [shortUrl]);

    res.status(200).redirect(open.rows[0].url);
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
