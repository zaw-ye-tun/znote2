import { prisma } from '../../server.js';
import { XP_REWARDS, calculateLevel } from '../utils/xp.js';

export const getEvents = async (req, res) => {
  try {
    const { start, end } = req.query;

    const whereClause = {
      userId: req.userId,
    };

    if (start && end) {
      whereClause.startDate = {
        gte: new Date(start),
        lte: new Date(end),
      };
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: { startDate: 'asc' },
    });

    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { title, description, startDate, endDate, allDay, color } = req.body;

    if (!title || !startDate) {
      return res.status(400).json({ error: 'Title and start date required' });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        allDay: allDay || false,
        color: color || '#3b82f6',
        userId: req.userId,
      },
    });

    // Award XP
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    const newXp = user.xp + XP_REWARDS.ADD_EVENT;
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
        action: 'add_event',
        xpGained: XP_REWARDS.ADD_EVENT,
      },
    });

    res.status(201).json({ 
      event,
      xpGained: XP_REWARDS.ADD_EVENT,
      newXp,
      newLevel,
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, startDate, endDate, allDay, color } = req.body;

    // Verify ownership
    const existingEvent = await prisma.event.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : null,
        allDay,
        color,
      },
    });

    res.json(event);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const existingEvent = await prisma.event.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await prisma.event.delete({
      where: { id },
    });

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};
