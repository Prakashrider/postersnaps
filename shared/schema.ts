import { z } from 'zod';

export const posterStyleSchema = z.enum(['narrative', 'quote', 'pointers']);
export const contentTypeSchema = z.enum(['trending', 'awareness', 'informative']);
export const outputFormatSchema = z.enum(['square', 'portrait', 'story']);
export const inputModeSchema = z.enum(['keyword', 'url']);

export const posterConfigSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  sessionId: z.string(),
  inputMode: inputModeSchema,
  inputValue: z.string(),
  style: posterStyleSchema,
  contentType: contentTypeSchema,
  outputFormat: outputFormatSchema,
  minPages: z.number().min(1).max(5),
  maxPages: z.number().min(1).max(5),
  createdAt: z.date(),
  status: z.enum(['processing', 'completed', 'failed']),
  posterUrls: z.array(z.string()).optional(),
  errorMessage: z.string().optional()
});

export const aiContentSchema = z.object({
  headline: z.string(),
  subtitle: z.string(),
  bulletPoints: z.array(z.string()),
  pages: z.number()
});

export const metadataSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  url: z.string().optional(),
  image: z.string().optional(),
  author: z.string().optional()
});

export const userUsageSchema = z.object({
  userId: z.string(),
  postersCreated: z.number(),
  lastPosterCreated: z.date()
});

export type PosterStyle = z.infer<typeof posterStyleSchema>;
export type ContentType = z.infer<typeof contentTypeSchema>;
export type OutputFormat = z.infer<typeof outputFormatSchema>;
export type InputMode = z.infer<typeof inputModeSchema>;
export type PosterConfig = z.infer<typeof posterConfigSchema>;
export type AIContent = z.infer<typeof aiContentSchema>;
export type Metadata = z.infer<typeof metadataSchema>;
export type UserUsage = z.infer<typeof userUsageSchema>;

export const createPosterConfigSchema = posterConfigSchema.omit({
  id: true,
  createdAt: true,
  status: true,
  posterUrls: true,
  errorMessage: true
});

export type CreatePosterConfig = z.infer<typeof createPosterConfigSchema>;
