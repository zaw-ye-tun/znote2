import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../server.js';
import { calculateStreak, XP_REWARDS } from '../utils/xp.js';

export const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
    });

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Calculate streak
    const daysSinceLastLogin = calculateStreak(user.lastLogin);
    let newStreak = user.streak;
    let xpBonus = 0;

    if (daysSinceLastLogin === 1) {
      // Consecutive day - increment streak
      newStreak = user.streak + 1;
      xpBonus += XP_REWARDS.DAILY_LOGIN;
      
      // Weekly bonus
      if (newStreak % 7 === 0) {
        xpBonus += XP_REWARDS.WEEKLY_STREAK;
      }
    } else if (daysSinceLastLogin > 1) {
      // Streak broken - reset
      newStreak = 1;
      xpBonus += XP_REWARDS.DAILY_LOGIN;
    }
    // Same day login - no change

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
        streak: newStreak,
        xp: user.xp + xpBonus,
      },
    });

    // Record XP if gained
    if (xpBonus > 0) {
      await prisma.xpHistory.create({
        data: {
          userId: user.id,
          action: daysSinceLastLogin === 1 && newStreak % 7 === 0 ? 'weekly_streak' : 'daily_login',
          xpGained: xpBonus,
        },
      });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.json({
      token,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        xp: updatedUser.xp,
        level: updatedUser.level,
        streak: updatedUser.streak,
      },
      xpGained: xpBonus,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const syncGuestData = async (req, res) => {
  try {
    const { notes, tasks, ideas, events } = req.body;
    const userId = req.userId;

    // Create notes
    if (notes && notes.length > 0) {
      await prisma.note.createMany({
        data: notes.map(note => ({
          title: note.title,
          content: note.content,
          tags: note.tags || [],
          pinned: note.pinned || false,
          userId,
        })),
      });
    }

    // Create tasks
    if (tasks && tasks.length > 0) {
      await prisma.task.createMany({
        data: tasks.map(task => ({
          title: task.title,
          description: task.description,
          completed: task.completed || false,
          priority: task.priority || 'medium',
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
          userId,
        })),
      });
    }

    // Create ideas
    if (ideas && ideas.length > 0) {
      await prisma.idea.createMany({
        data: ideas.map(idea => ({
          title: idea.title,
          content: idea.content,
          tags: idea.tags || [],
          userId,
        })),
      });
    }

    // Create events
    if (events && events.length > 0) {
      await prisma.event.createMany({
        data: events.map(event => ({
          title: event.title,
          description: event.description,
          startDate: new Date(event.startDate),
          endDate: event.endDate ? new Date(event.endDate) : null,
          allDay: event.allDay || false,
          color: event.color || '#3b82f6',
          userId,
        })),
      });
    }

    res.json({ message: 'Guest data synced successfully' });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Failed to sync guest data' });
  }
};
