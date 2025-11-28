import { prisma } from '../../server.js';
import { XP_REWARDS, calculateLevel } from '../utils/xp.js';

export const getNotes = async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      where: { userId: req.userId },
      orderBy: [
        { pinned: 'desc' },
        { updatedAt: 'desc' },
      ],
    });

    res.json(notes);
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

export const createNote = async (req, res) => {
  try {
    const { title, content, tags, pinned } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content required' });
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        tags: tags || [],
        pinned: pinned || false,
        userId: req.userId,
      },
    });

    // Award XP
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    const newXp = user.xp + XP_REWARDS.CREATE_NOTE;
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
        action: 'create_note',
        xpGained: XP_REWARDS.CREATE_NOTE,
      },
    });

    res.status(201).json({ 
      note, 
      xpGained: XP_REWARDS.CREATE_NOTE,
      newXp,
      newLevel,
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags, pinned } = req.body;

    // Verify ownership
    const existingNote = await prisma.note.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const note = await prisma.note.update({
      where: { id },
      data: {
        title,
        content,
        tags,
        pinned,
      },
    });

    res.json(note);
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const existingNote = await prisma.note.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    await prisma.note.delete({
      where: { id },
    });

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
};
