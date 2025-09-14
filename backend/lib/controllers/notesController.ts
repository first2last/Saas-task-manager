import { Response } from 'express';
import { Note } from '../models/Note';
import { AuthenticatedRequest } from '../middleware/tenantMiddleware';

export const createNote = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      res.status(400).json({ error: 'Title and content are required' });
      return;
    }

    // Check subscription limits
    const noteCount = await Note.countDocuments({ tenantId: req.tenant._id });
    if (req.tenant.plan === 'free' && noteCount >= req.tenant.noteLimit) {
      res.status(403).json({ 
        error: 'Note limit reached',
        message: 'Upgrade to Pro to create unlimited notes',
        upgradeRequired: true
      });
      return;
    }

    const note = new Note({
      tenantId: req.tenant._id,
      userId: req.user._id,
      title,
      content
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getNotes = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const notes = await Note.find({ tenantId: req.tenant._id })
      .populate('userId', 'email')
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getNote = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const note = await Note.findOne({ 
      _id: id, 
      tenantId: req.tenant._id 
    }).populate('userId', 'email');

    if (!note) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateNote = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: id, tenantId: req.tenant._id },
      { title, content },
      { new: true }
    );

    if (!note) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteNote = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const note = await Note.findOneAndDelete({ 
      _id: id, 
      tenantId: req.tenant._id 
    });

    if (!note) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
