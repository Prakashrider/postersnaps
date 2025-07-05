import { neon } from '@netlify/neon';

// This exports a Neon SQL client instance using the NETLIFY_DATABASE_URL env variable
export const sql = neon();

// Example usage:
// const result = await sql`SELECT * FROM poster_configs WHERE id = ${id}`;
