import { prisma } from '../../server.js';

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        username: true,
        xp: true,
        level: true,
        streak: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username required' });
    }

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { username },
      select: {
        id: true,
        email: true,
        username: true,
        xp: true,
        level: true,
        streak: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const getXpHistory = async (req, res) => {
  try {
    const history = await prisma.xpHistory.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json(history);
  } catch (error) {
    console.error('Get XP history error:', error);
    res.status(500).json({ error: 'Failed to fetch XP history' });
  }
};

export const getStats = async (req, res) => {
  try {
    const [notesCount, tasksCount, completedTasksCount, ideasCount, eventsCount] = await Promise.all([
      prisma.note.count({ where: { userId: req.userId } }),
      prisma.task.count({ where: { userId: req.userId } }),
      prisma.task.count({ where: { userId: req.userId, completed: true } }),
      prisma.idea.count({ where: { userId: req.userId } }),
      prisma.event.count({ where: { userId: req.userId } }),
    ]);

    res.json({
      notes: notesCount,
      tasks: tasksCount,
      completedTasks: completedTasksCount,
      ideas: ideasCount,
      events: eventsCount,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
