import { db } from "../database/database.connection.js";

export async function getUser(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", '');
  const user = await db.query(`SELECT "userId" FROM sessions WHERE token = $1;`, [token]);

  if(!user.rowCount) return res.sendStatus(401);

  try {
    const result = await db.query(`SELECT users.id, users.name,
      SUM(urls."visitCount") AS "visitCount",
      json_agg(JSON_BUILD_OBJECT('id', urls.id, 'shortUrl', urls."shortUrl", 'url', urls.url, 'visitCount', urls."visitCount")) AS "shortenedUrls"
      FROM users
      JOIN urls ON users.id = urls."userId"
      WHERE users.id = $1
      GROUP BY users.id;`,
      [user.rows[0].userId]
    );
  
    res.status(200).send(result.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getRanking(req, res) {
  try {
    const ranking = await db.query(`SELECT users.id, users.name,
      COUNT(urls.id) AS "linksCount",
      SUM(urls."visitCount") AS "visitCount"
      FROM users
      LEFT JOIN urls ON users.id = urls."userId"
      GROUP BY users.id
      ORDER BY "visitCount" DESC
      LIMIT 10;`
    ); 

    res.status(200).send(ranking.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
