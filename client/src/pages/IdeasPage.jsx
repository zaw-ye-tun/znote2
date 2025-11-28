import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Sparkles } from 'lucide-react';
import { useIdeasStore } from '../stores/ideasStore';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Input, { Textarea } from '../components/Input';
import api from '../lib/api';
import { useAuthStore } from '../stores/authStore';

export default function IdeasPage() {
  const { ideas, fetchIdeas, createIdea, updateIdea, deleteIdea } = useIdeasStore();
  const { isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
  });
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  const filteredIdeas = ideas.filter(
    (idea) =>
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingIdea) {
      await updateIdea(editingIdea.id, formData);
    } else {
      await createIdea(formData);
    }
    setIsModalOpen(false);
    resetForm();
    fetchIdeas();
  };

  const handleEdit = (idea) => {
    setEditingIdea(idea);
    setFormData({
      title: idea.title,
      content: idea.content,
      tags: idea.tags || [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this idea?')) {
      await deleteIdea(id);
      fetchIdeas();
    }
  };

  const resetForm = () => {
    setEditingIdea(null);
    setFormData({ title: '', content: '', tags: [] });
  };

  const handleAIExplain = async () => {
    if (!isAuthenticated || !formData.content) return;
    setAiLoading(true);
    try {
      const response = await api.post('/ai/explain', { text: formData.content });
      setFormData({ ...formData, content: response.data.explanation });
    } catch (error) {
      console.error('AI explain failed:', error);
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
        <h1 className="text-3xl font-bold">Idea Vault</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          New Idea
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          type="text"
          placeholder="Search ideas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIdeas.map((idea) => (
          <div key={idea.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg">{idea.title}</h3>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(idea)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(idea.id)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-4">
              {idea.content}
            </p>
            {idea.tags && idea.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {idea.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredIdeas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No ideas found</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingIdea ? 'Edit Idea' : 'New Idea'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Idea title"
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
                    onClick={handleAIExplain}
                    disabled={aiLoading || !formData.content}
                    className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                  >
                    <Sparkles size={12} />
                    Explain
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
              placeholder="Describe your idea..."
              rows={8}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {editingIdea ? 'Update' : 'Create'}
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
