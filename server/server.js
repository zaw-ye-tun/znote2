import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';

// Import routes
import authRoutes from './src/routes/auth.js';
import notesRoutes from './src/routes/notes.js';
import tasksRoutes from './src/routes/tasks.js';
import ideasRoutes from './src/routes/ideas.js';
import eventsRoutes from './src/routes/events.js';
import userRoutes from './src/routes/user.js';
import aiRoutes from './src/routes/ai.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Auto-run Prisma migrations on startup (for Render free plan)
exec('npx prisma migrate deploy', (err, stdout, stderr) => {
  if (err) {
    console.error('Migration error:', stderr);
  } else {
    console.log('Migration complete:', stdout);
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'ZNOTE API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/ideas', ideasRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 ZNOTE Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Prisma migrations running automatically on startup`);
});

export { prisma };
