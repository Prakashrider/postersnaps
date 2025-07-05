import { sql } from './db';
import { PosterConfig, UserUsage } from '@shared/schema';

// Neon/Postgres-based storage implementation
export const neonStorage = {
  // Poster Configs CRUD
  async createPosterConfig(config: Omit<PosterConfig, 'id' | 'createdAt'>): Promise<PosterConfig> {
    const id = Math.random().toString(36).substring(2, 15);
    const createdAt = new Date();
    const status = 'processing';
    await sql`
      INSERT INTO poster_configs (
        id, user_id, session_id, input_mode, input_value, style, content_type, output_format, min_pages, max_pages, created_at, status
      ) VALUES (
        ${id}, ${config.userId || null}, ${config.sessionId}, ${config.inputMode}, ${config.inputValue},
        ${config.style}, ${config.contentType}, ${config.outputFormat}, ${config.minPages}, ${config.maxPages}, ${createdAt.toISOString()}, ${status}
      )
    `;
    return {
      ...config,
      id,
      createdAt,
      status: status as PosterConfig['status'],
      posterUrls: [],
    };
  },

  async getPosterConfig(id: string): Promise<PosterConfig | null> {
    const [row] = await sql`SELECT * FROM poster_configs WHERE id = ${id}`;
    if (!row) return null;
    return {
      id: row.id,
      userId: row.user_id || undefined,
      sessionId: row.session_id,
      inputMode: row.input_mode,
      inputValue: row.input_value,
      style: row.style,
      contentType: row.content_type,
      outputFormat: row.output_format,
      minPages: row.min_pages,
      maxPages: row.max_pages,
      createdAt: new Date(row.created_at),
      status: row.status,
      posterUrls: row.poster_urls || [],
      errorMessage: row.error_message || undefined,
    };
  },

  async updatePosterConfig(id: string, updates: Partial<PosterConfig>): Promise<PosterConfig> {
    // Only update allowed fields
    const allowed = [
      'userId','sessionId','inputMode','inputValue','style','contentType','outputFormat','minPages','maxPages','status','posterUrls','errorMessage'
    ];
    const fields = Object.entries(updates).filter(([k]) => allowed.includes(k));
    if (fields.length === 0) throw new Error('No valid fields to update');
    const columns = fields.map(([k]) => k === 'posterUrls' ? 'poster_urls' : k.replace(/[A-Z]/g, m => '_' + m.toLowerCase()));
    const values = fields.map(([,v]) => Array.isArray(v) ? v : v instanceof Date ? v.toISOString() : v);
    const setSql = columns.map((col, i) => `${col} = $${i+2}`).join(', ');
    // Use Function constructor to build a parameterized query
    const query = `UPDATE poster_configs SET ${setSql} WHERE id = $1`;
    await sql(query, [id, ...values]);
    return (await this.getPosterConfig(id))!;
  },

  // User Usage CRUD
  async getUserUsage(userId: string): Promise<UserUsage | null> {
    const [row] = await sql`SELECT * FROM user_usages WHERE user_id = ${userId}`;
    if (!row) return null;
    return {
      userId: row.user_id,
      postersCreated: row.posters_created,
      lastPosterCreated: row.last_poster_created ? new Date(row.last_poster_created) : new Date(),
      credits: row.credits,
      plan: row.plan,
    };
  },

  async updateUserUsage(userId: string, updates: Partial<UserUsage>): Promise<UserUsage> {
    const allowed = ['postersCreated','lastPosterCreated','credits','plan'];
    const fields = Object.entries(updates).filter(([k]) => allowed.includes(k));
    if (fields.length === 0) throw new Error('No valid fields to update');
    const columns = fields.map(([k]) => k.replace(/[A-Z]/g, m => '_' + m.toLowerCase()));
    const values = fields.map(([,v]) => v instanceof Date ? v.toISOString() : v);
    const setSql = columns.map((col, i) => `${col} = $${i+2}`).join(', ');
    const query = `UPDATE user_usages SET ${setSql} WHERE user_id = $1`;
    await sql(query, [userId, ...values]);
    return (await this.getUserUsage(userId))!;
  },

  async addCredits(userId: string, amount: number): Promise<UserUsage> {
    await sql`UPDATE user_usages SET credits = credits + ${amount} WHERE user_id = ${userId}`;
    return (await this.getUserUsage(userId))!;
  },

  async deductCredits(userId: string, amount: number): Promise<UserUsage> {
    await sql`UPDATE user_usages SET credits = GREATEST(0, credits - ${amount}) WHERE user_id = ${userId}`;
    return (await this.getUserUsage(userId))!;
  },

  // Session tracking
  async getSessionPosterCount(sessionId: string): Promise<number> {
    const [row] = await sql`SELECT * FROM session_counts WHERE session_id = ${sessionId}`;
    return row?.count || 0;
  },

  async incrementSessionPosterCount(sessionId: string): Promise<void> {
    await sql`
      INSERT INTO session_counts (session_id, count)
      VALUES (${sessionId}, 1)
      ON CONFLICT (session_id) DO UPDATE SET count = session_counts.count + 1
    `;
  },
};
