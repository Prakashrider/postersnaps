import { sql } from '../../client/src/lib/db';

export default async function handler(req, res) {
  // Add CORS headers for safety
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  const { id } = req.query;
  if (!id) {
    res.status(400).json({ error: "Missing poster ID" });
    return;
  }
  try {
    const posterId = typeof id === "string" ? id : id[0];
    const result = await sql`SELECT * FROM poster_configs WHERE id = ${posterId}`;
    const poster = result[0];
    if (!poster) {
      res.status(404).json({ error: "Poster not found" });
      return;
    }
    // Only include relevant fields in the response
    const response = {
      id: poster.id,
      status: poster.status,
      posterUrls: poster.poster_urls,
      errorMessage: poster.error_message,
    };
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ error: "Internal server error" });
  }
}