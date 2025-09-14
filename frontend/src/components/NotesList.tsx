import React, { useState, useEffect } from 'react';
import api from '../api';

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  userId: {
    email: string;
  };
}

interface NotesListProps {
  refreshTrigger: number;
}

export const NotesList: React.FC<NotesListProps> = ({ refreshTrigger }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchNotes();
  }, [refreshTrigger]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notes');
      setNotes(response.data);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await api.delete(`/notes/${id}`);
      fetchNotes();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to delete note');
    }
  };

  const startEditing = (note: Note) => {
    setEditingId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
    setEditContent('');
  };

  const saveEdit = async (id: string) => {
    try {
      await api.put(`/notes/${id}`, {
        title: editTitle,
        content: editContent
      });
      setEditingId(null);
      fetchNotes();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update note');
    }
  };

  if (loading) {
    return <div className="text-center">Loading notes...</div>;
  }

  if (error) {
    return <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Your Notes ({notes.length})</h3>
      
      {notes.length === 0 ? (
        <p className="text-gray-500">No notes yet. Create your first note above!</p>
      ) : (
        notes.map((note) => (
          <div key={note._id} className="bg-white p-6 rounded-lg shadow-md">
            {editingId === note._id ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => saveEdit(note._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h4 className="text-xl font-semibold mb-2">{note.title}</h4>
                <p className="text-gray-700 mb-4 whitespace-pre-wrap">{note.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Created by: {note.userId.email}</span>
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => startEditing(note)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteNote(note._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};
