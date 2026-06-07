// lib/mongodb.ts — MongoDB connection with caching

import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  console.warn('MONGODB_URI not set. Database features will be disabled.')
}

interface Cached {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: Cached
}

let cached: Cached = global.mongoose || { conn: null, promise: null }
if (!global.mongoose) global.mongoose = cached

export async function connectDB() {
  if (!MONGODB_URI) return null
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    })
  }
  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }
  return cached.conn
}

// ── Schemas ──────────────────────────────────────────────────

const DirectiveSchema = new mongoose.Schema({
  input: String,
  responses: [{
    role: String,
    content: String,
    timestamp: { type: Date, default: Date.now },
  }],
  status: { type: String, enum: ['running', 'complete', 'error'], default: 'running' },
  createdAt: { type: Date, default: Date.now },
})

const BlueprintSchema = new mongoose.Schema({
  idea: String,
  content: String,
  gitlabProject: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
})

const ProjectSchema = new mongoose.Schema({
  name: String,
  description: String,
  status: String,
  progress: Number,
  gitlabProjectId: Number,
  createdAt: { type: Date, default: Date.now },
})

export const Directive = mongoose.models.Directive || mongoose.model('Directive', DirectiveSchema)
export const Blueprint = mongoose.models.Blueprint || mongoose.model('Blueprint', BlueprintSchema)
export const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema)
