import { PosterConfig, UserUsage } from '@shared/schema';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface IStorage {
  // Poster configurations
  createPosterConfig(config: Omit<PosterConfig, 'id' | 'createdAt'>): Promise<PosterConfig>;
  getPosterConfig(id: string): Promise<PosterConfig | null>;
  updatePosterConfig(id: string, updates: Partial<PosterConfig>): Promise<PosterConfig>;
  deletePosterConfig(id: string): Promise<void>;
  
  // User usage tracking
  getUserUsage(userId: string): Promise<UserUsage | null>;
  updateUserUsage(userId: string, updates: Partial<UserUsage>): Promise<UserUsage>;
  
  // Session tracking
  getSessionPosterCount(sessionId: string): Promise<number>;
  incrementSessionPosterCount(sessionId: string): Promise<void>;
  
  // Credits management
  deductCredits(userId: string, amount: number): Promise<UserUsage>;
  addCredits(userId: string, amount: number): Promise<UserUsage>;
}

export class MemStorage implements IStorage {
  private posterConfigs: Map<string, PosterConfig> = new Map();
  private userUsages: Map<string, UserUsage> = new Map();
  private sessionCounts: Map<string, number> = new Map();

  async createPosterConfig(config: Omit<PosterConfig, 'id' | 'createdAt'>): Promise<PosterConfig> {
    const id = Math.random().toString(36).substring(2, 15);
    const posterConfig: PosterConfig = {
      ...config,
      id,
      createdAt: new Date()
    };
    this.posterConfigs.set(id, posterConfig);
    return posterConfig;
  }

  async getPosterConfig(id: string): Promise<PosterConfig | null> {
    return this.posterConfigs.get(id) || null;
  }

  async updatePosterConfig(id: string, updates: Partial<PosterConfig>): Promise<PosterConfig> {
    const existing = this.posterConfigs.get(id);
    if (!existing) {
      throw new Error('Poster config not found');
    }
    const updated = { ...existing, ...updates };
    this.posterConfigs.set(id, updated);
    return updated;
  }

  async deletePosterConfig(id: string): Promise<void> {
    this.posterConfigs.delete(id);
  }

  async getUserUsage(userId: string): Promise<UserUsage | null> {
    return this.userUsages.get(userId) || null;
  }

  async updateUserUsage(userId: string, updates: Partial<UserUsage>): Promise<UserUsage> {
    const existing = this.userUsages.get(userId);
    const updated: UserUsage = existing 
      ? { ...existing, ...updates }
      : { 
          userId, 
          postersCreated: 0, 
          lastPosterCreated: new Date(),
          credits: 5, // Default 5 credits for new users
          plan: 'free',
          ...updates 
        };
    this.userUsages.set(userId, updated);
    return updated;
  }

  async getSessionPosterCount(sessionId: string): Promise<number> {
    return this.sessionCounts.get(sessionId) || 0;
  }

  async incrementSessionPosterCount(sessionId: string): Promise<void> {
    const current = this.sessionCounts.get(sessionId) || 0;
    this.sessionCounts.set(sessionId, current + 1);
  }

  // Credits management methods
  async deductCredits(userId: string, amount: number): Promise<UserUsage> {
    const usage = await this.getUserUsage(userId);
    const currentCredits = usage?.credits || 0;
    return this.updateUserUsage(userId, {
      credits: Math.max(0, currentCredits - amount)
    });
  }

  async addCredits(userId: string, amount: number): Promise<UserUsage> {
    const usage = await this.getUserUsage(userId);
    const currentCredits = usage?.credits || 0;
    return this.updateUserUsage(userId, {
      credits: currentCredits + amount
    });
  }

  // Test helper methods
  async clearSessionData(sessionId: string): Promise<void> {
    this.sessionCounts.delete(sessionId);
    // Also clear any poster configs for this session
    const configsToDelete: string[] = [];
    this.posterConfigs.forEach((config, id) => {
      if (config.sessionId === sessionId) {
        configsToDelete.push(id);
      }
    });
    configsToDelete.forEach(id => this.posterConfigs.delete(id));
  }

  async clearAllData(): Promise<void> {
    this.posterConfigs.clear();
    this.userUsages.clear();
    this.sessionCounts.clear();
  }
}

export class FileStorage implements IStorage {
  private dataDir: string;

  constructor() {
    this.dataDir = join(process.cwd(), '.storage');
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
  }

  private writeData(filename: string, data: any): void {
    const filepath = join(this.dataDir, filename);
    writeFileSync(filepath, JSON.stringify(data, null, 2));
  }

  private readData(filename: string): any {
    const filepath = join(this.dataDir, filename);
    if (!existsSync(filepath)) {
      return null;
    }
    try {
      return JSON.parse(readFileSync(filepath, 'utf-8'));
    } catch {
      return null;
    }
  }

  async createPosterConfig(config: Omit<PosterConfig, 'id' | 'createdAt'>): Promise<PosterConfig> {
    const id = Math.random().toString(36).substring(2, 15);
    const posterConfig: PosterConfig = {
      ...config,
      id,
      createdAt: new Date()
    };
    this.writeData(`poster-${id}.json`, posterConfig);
    console.log('💾 Saved poster config to file:', id);
    return posterConfig;
  }

  async getPosterConfig(id: string): Promise<PosterConfig | null> {
    const data = this.readData(`poster-${id}.json`);
    console.log('📖 Read poster config from file:', id, data ? 'Found' : 'Not found');
    return data;
  }

  async updatePosterConfig(id: string, updates: Partial<PosterConfig>): Promise<PosterConfig> {
    const existing = await this.getPosterConfig(id);
    if (!existing) {
      throw new Error('Poster config not found');
    }
    const updated = { ...existing, ...updates };
    this.writeData(`poster-${id}.json`, updated);
    console.log('📝 Updated poster config in file:', id);
    return updated;
  }

  async deletePosterConfig(id: string): Promise<void> {
    // Implementation not needed for now
  }

  async getUserUsage(userId: string): Promise<UserUsage | null> {
    return this.readData(`user-${userId}.json`);
  }

  async updateUserUsage(userId: string, updates: Partial<UserUsage>): Promise<UserUsage> {
    const existing = await this.getUserUsage(userId) || {
      userId,
      postersCreated: 0,
      lastPosterCreated: new Date(),
      credits: 5,
      plan: 'free'
    };
    const updated = { ...existing, ...updates };
    this.writeData(`user-${userId}.json`, updated);
    return updated;
  }

  async getSessionPosterCount(sessionId: string): Promise<number> {
    const data = this.readData(`session-${sessionId}.json`);
    return data?.count || 0;
  }

  async incrementSessionPosterCount(sessionId: string): Promise<void> {
    const count = await this.getSessionPosterCount(sessionId);
    this.writeData(`session-${sessionId}.json`, { count: count + 1 });
  }

  async deductCredits(userId: string, amount: number): Promise<UserUsage> {
    const usage = await this.getUserUsage(userId);
    if (!usage) {
      throw new Error('User not found');
    }
    const newCredits = Math.max(0, usage.credits - amount);
    return this.updateUserUsage(userId, { credits: newCredits });
  }

  async addCredits(userId: string, amount: number): Promise<UserUsage> {
    const usage = await this.getUserUsage(userId) || {
      userId,
      postersCreated: 0,
      lastPosterCreated: new Date(),
      credits: 5,
      plan: 'free'
    };
    const newCredits = usage.credits + amount;
    return this.updateUserUsage(userId, { credits: newCredits });
  }

  async clearSessionData(sessionId: string): Promise<void> {
    // Implementation not needed for now
  }

  async clearAllData(): Promise<void> {
    // Implementation not needed for now
  }
}

export const storage = new FileStorage();
