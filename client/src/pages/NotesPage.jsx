import { useState, useEffect } from 'react';
import { Plus, Search, Pin, Edit, Trash2, Sparkles } from 'lucide-react';
import { useNotesStore } from '../stores/notesStore';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Input, { Textarea } from '../components/Input';
import api from '../lib/api';
import { useAuthStore } from '../stores/authStore';

export default function NotesPage() {
  const { notes, fetchNotes, createNote, updateNote, deleteNote } = useNotesStore();
  const { isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
    pinned: false,
  });
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingNote) {
      await updateNote(editingNote.id, formData);
    } else {
      await createNote(formData);
    }
    setIsModalOpen(false);
    resetForm();
    fetchNotes();
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      tags: note.tags || [],
      pinned: note.pinned,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this note?')) {
      await deleteNote(id);
      fetchNotes();
    }
  };

  const resetForm = () => {
    setEditingNote(null);
    setFormData({ title: '', content: '', tags: [], pinned: false });
  };

  const handleAISummarize = async () => {
    if (!isAuthenticated || !formData.content) return;
    setAiLoading(true);
    try {
      const response = await api.post('/ai/summarize', { text: formData.content });
      setFormData({ ...formData, content: response.data.summary });
    } catch (error) {
      console.error('AI summarize failed:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAIImprove = async () => {
    if (!isAuthenticated || !formData.content) return;
    setAiLoading(true);
    try {
      const response = await api.post('/ai/improve', { text: formData.content });
      setFormData({ ...formData, content: response.data.improved });
    } catch (error) {
      console.error('AI improve failed:', error);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Notes</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          New Note
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map((note) => (
          <div key={note.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                {note.pinned && <Pin size={16} className="text-primary-600" />}
                {note.title}
              </h3>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(note)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
              {note.content}
            </p>
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {note.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No notes found</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingNote ? 'Edit Note' : 'New Note'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Note title"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium">Content</label>
              {isAuthenticated && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAISummarize}
                    disabled={aiLoading || !formData.content}
                    className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                  >
                    <Sparkles size={12} />
                    Summarize
                  </button>
                  <button
                    type="button"
                    onClick={handleAIImprove}
                    disabled={aiLoading || !formData.content}
                    className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                  >
                    <Sparkles size={12} />
                    Improve
                  </button>
                </div>
              )}
            </div>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your note..."
              rows={8}
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.pinned}
                onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
              />
              <span className="text-sm">Pin this note</span>
            </label>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {editingNote ? 'Update' : 'Create'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
