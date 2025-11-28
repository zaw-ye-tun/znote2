import { prisma } from '../../server.js';
import { XP_REWARDS, calculateLevel } from '../utils/xp.js';

export const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.userId },
      orderBy: [
        { completed: 'asc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title required' });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || 'medium',
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: req.userId,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed, priority, dueDate } = req.body;

    // Verify ownership
    const existingTask = await prisma.task.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if task is being completed
    const wasCompleted = existingTask.completed;
    const isNowCompleted = completed === true;
    let xpData = null;

    if (!wasCompleted && isNowCompleted) {
      // Award XP for completing task
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
      });

      const newXp = user.xp + XP_REWARDS.COMPLETE_TASK;
      const newLevel = calculateLevel(newXp);

      await prisma.user.update({
        where: { id: req.userId },
        data: {
          xp: newXp,
          level: newLevel,
        },
      });

      await prisma.xpHistory.create({
        data: {
          userId: req.userId,
          action: 'complete_task',
          xpGained: XP_REWARDS.COMPLETE_TASK,
        },
      });

      xpData = {
        xpGained: XP_REWARDS.COMPLETE_TASK,
        newXp,
        newLevel,
      };
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        completed,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    res.json({ task, ...xpData });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const existingTask = await prisma.task.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await prisma.task.delete({
      where: { id },
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
