import { prisma } from '../../server.js';

export const getIdeas = async (req, res) => {
  try {
    const ideas = await prisma.idea.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(ideas);
  } catch (error) {
    console.error('Get ideas error:', error);
    res.status(500).json({ error: 'Failed to fetch ideas' });
  }
};

export const createIdea = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content required' });
    }

    const idea = await prisma.idea.create({
      data: {
        title,
        content,
        tags: tags || [],
        userId: req.userId,
      },
    });

    res.status(201).json(idea);
  } catch (error) {
    console.error('Create idea error:', error);
    res.status(500).json({ error: 'Failed to create idea' });
  }
};

export const updateIdea = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;

    // Verify ownership
    const existingIdea = await prisma.idea.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingIdea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    const idea = await prisma.idea.update({
      where: { id },
      data: {
        title,
        content,
        tags,
      },
    });

    res.json(idea);
  } catch (error) {
    console.error('Update idea error:', error);
    res.status(500).json({ error: 'Failed to update idea' });
  }
};

export const deleteIdea = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const existingIdea = await prisma.idea.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingIdea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    await prisma.idea.delete({
      where: { id },
    });

    res.json({ message: 'Idea deleted successfully' });
  } catch (error) {
    console.error('Delete idea error:', error);
    res.status(500).json({ error: 'Failed to delete idea' });
  }
};
