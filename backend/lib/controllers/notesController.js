"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.updateNote = exports.getNote = exports.getNotes = exports.createNote = void 0;
const Note_1 = require("../models/Note");
const createNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            res.status(400).json({ error: 'Title and content are required' });
            return;
        }
        // Check subscription limits
        const noteCount = await Note_1.Note.countDocuments({ tenantId: req.tenant._id });
        if (req.tenant.plan === 'free' && noteCount >= req.tenant.noteLimit) {
            res.status(403).json({
                error: 'Note limit reached',
                message: 'Upgrade to Pro to create unlimited notes',
                upgradeRequired: true
            });
            return;
        }
        const note = new Note_1.Note({
            tenantId: req.tenant._id,
            userId: req.user._id,
            title,
            content
        });
        await note.save();
        res.status(201).json(note);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.createNote = createNote;
const getNotes = async (req, res) => {
    try {
        const notes = await Note_1.Note.find({ tenantId: req.tenant._id })
            .populate('userId', 'email')
            .sort({ createdAt: -1 });
        res.json(notes);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getNotes = getNotes;
const getNote = async (req, res) => {
    try {
        const { id } = req.params;
        const note = await Note_1.Note.findOne({
            _id: id,
            tenantId: req.tenant._id
        }).populate('userId', 'email');
        if (!note) {
            res.status(404).json({ error: 'Note not found' });
            return;
        }
        res.json(note);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getNote = getNote;
const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const note = await Note_1.Note.findOneAndUpdate({ _id: id, tenantId: req.tenant._id }, { title, content }, { new: true });
        if (!note) {
            res.status(404).json({ error: 'Note not found' });
            return;
        }
        res.json(note);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.updateNote = updateNote;
const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const note = await Note_1.Note.findOneAndDelete({
            _id: id,
            tenantId: req.tenant._id
        });
        if (!note) {
            res.status(404).json({ error: 'Note not found' });
            return;
        }
        res.json({ message: 'Note deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.deleteNote = deleteNote;
