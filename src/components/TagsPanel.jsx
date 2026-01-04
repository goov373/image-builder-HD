import { useState } from 'react';
import { useTagsContext } from '../context';

/**
 * Tags Panel
 * Sidebar panel for viewing and managing preset tags
 * Supports editing, adding, and deleting tags
 * Matches the styling of DesignSystemPanel and ExportPanel
 */

// Editable Tag Row Component
const TagRow = ({ tag, onUpdate, onDelete, isEditing, setEditingId }) => {
  const [editLabel, setEditLabel] = useState(tag.label);
  const [editDescription, setEditDescription] = useState(tag.description || '');

  const handleSave = () => {
    if (!editLabel.trim()) return;
    onUpdate(tag.id, { label: editLabel.trim(), description: editDescription.trim() });
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditLabel(tag.label);
    setEditDescription(tag.description || '');
    setEditingId(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="py-2 px-1 space-y-1.5 border-b border-[--border-subtle]/30">
        <input
          type="text"
          value={editLabel}
          onChange={(e) => setEditLabel(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tag name"
          className="w-full px-0 py-0.5 text-xs bg-transparent border-0 border-b border-[--border-subtle]/50 text-[--text-primary] placeholder-[--text-quaternary]/50 focus:outline-none focus:border-[--text-tertiary]"
          autoFocus
        />
        <input
          type="text"
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Description"
          className="w-full px-0 py-0.5 text-[10px] bg-transparent border-0 text-[--text-quaternary]/70 placeholder-[--text-quaternary]/30 focus:outline-none"
        />
        <div className="flex justify-end gap-3 pt-0.5">
          <button
            type="button"
            onClick={handleCancel}
            className="text-[10px] text-[--text-quaternary]/50 hover:text-[--text-secondary] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!editLabel.trim()}
            className="text-[10px] text-[--text-tertiary] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-start gap-2 py-2 px-1 border-b border-[--border-subtle]/30 hover:bg-white/[0.02] transition-colors">
      <div className="flex-1 min-w-0">
        <span className="text-xs text-[--text-secondary] font-medium">
          {tag.label}
        </span>
        {tag.description && (
          <p className="text-[10px] text-[--text-quaternary]/70 leading-relaxed mt-0.5">
            {tag.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => setEditingId(tag.id)}
          className="w-5 h-5 flex items-center justify-center rounded text-[--text-quaternary]/50 hover:text-[--text-secondary] transition-colors"
          title="Edit tag"
        >
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onDelete(tag.id)}
          className="w-5 h-5 flex items-center justify-center rounded text-[--text-quaternary]/50 hover:text-red-400 transition-colors"
          title="Delete tag"
        >
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Add New Tag Form
const AddTagForm = ({ onAdd, onCancel }) => {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!label.trim()) return;
    onAdd({ label: label.trim(), description: description.trim() });
    setLabel('');
    setDescription('');
    onCancel();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="py-2 px-1 space-y-1.5 border-b border-[--border-subtle]/30 mb-1">
      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="New tag name"
        className="w-full px-0 py-0.5 text-xs bg-transparent border-0 border-b border-[--border-subtle]/50 text-[--text-primary] placeholder-[--text-quaternary]/50 focus:outline-none focus:border-[--text-tertiary]"
        autoFocus
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Description"
        className="w-full px-0 py-0.5 text-[10px] bg-transparent border-0 text-[--text-quaternary]/70 placeholder-[--text-quaternary]/30 focus:outline-none"
      />
      <div className="flex justify-end gap-3 pt-0.5">
        <button
          type="button"
          onClick={onCancel}
          className="text-[10px] text-[--text-quaternary]/50 hover:text-[--text-secondary] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!label.trim()}
          className="text-[10px] text-[--text-tertiary] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>
    </form>
  );
};

const TagsPanel = ({ onClose, isOpen }) => {
  const {
    audienceTags,
    featureTags,
    addAudienceTag,
    updateAudienceTag,
    deleteAudienceTag,
    addFeatureTag,
    updateFeatureTag,
    deleteFeatureTag,
    resetToDefaults,
  } = useTagsContext();

  const [editingAudienceId, setEditingAudienceId] = useState(null);
  const [editingFeatureId, setEditingFeatureId] = useState(null);
  const [isAddingAudience, setIsAddingAudience] = useState(false);
  const [isAddingFeature, setIsAddingFeature] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleDeleteAudience = (id) => {
    if (window.confirm('Delete this audience tag? This cannot be undone.')) {
      deleteAudienceTag(id);
    }
  };

  const handleDeleteFeature = (id) => {
    if (window.confirm('Delete this feature tag? This cannot be undone.')) {
      deleteFeatureTag(id);
    }
  };

  const handleReset = () => {
    resetToDefaults();
    setShowResetConfirm(false);
  };

  return (
    <div
      className={`fixed top-[56px] h-[calc(100%-56px)] w-72 bg-[--surface-canvas] border-r border-t border-[--border-default] z-40 flex flex-col ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      style={{ left: isOpen ? 64 : -224, transition: 'left 0.3s ease-out' }}
    >
      {/* Fixed Header */}
      <div
        className="flex-shrink-0 px-4 border-b border-[--border-default] flex items-center justify-between"
        style={{ height: 64 }}
      >
        <h2 className="text-sm font-semibold text-white">Content Tags</h2>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded flex items-center justify-center text-[--text-quaternary] hover:text-white hover:bg-[--surface-overlay] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-scroll overflow-x-hidden">
        <div className="p-4 space-y-4">
          {/* Audience Tags Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] font-medium text-[--text-quaternary]/60 uppercase tracking-wider">Audience</h3>
              <button
                type="button"
                onClick={() => setIsAddingAudience(true)}
                className="text-[10px] text-[--text-quaternary]/50 hover:text-[--text-secondary] transition-colors"
                title="Add audience tag"
              >
                + Add
              </button>
            </div>
            <div className="flex flex-col">
              {isAddingAudience && (
                <AddTagForm
                  onAdd={addAudienceTag}
                  onCancel={() => setIsAddingAudience(false)}
                />
              )}
              {audienceTags.map((tag) => (
                <TagRow
                  key={tag.id}
                  tag={tag}
                  onUpdate={updateAudienceTag}
                  onDelete={handleDeleteAudience}
                  isEditing={editingAudienceId === tag.id}
                  setEditingId={setEditingAudienceId}
                />
              ))}
              {audienceTags.length === 0 && !isAddingAudience && (
                <p className="text-[10px] text-[--text-quaternary]/50 py-2 italic">
                  No tags defined
                </p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[--border-subtle]/30 my-4" />

          {/* Feature Tags Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] font-medium text-[--text-quaternary]/60 uppercase tracking-wider">Feature / Topic</h3>
              <button
                type="button"
                onClick={() => setIsAddingFeature(true)}
                className="text-[10px] text-[--text-quaternary]/50 hover:text-[--text-secondary] transition-colors"
                title="Add feature tag"
              >
                + Add
              </button>
            </div>
            <div className="flex flex-col">
              {isAddingFeature && (
                <AddTagForm
                  onAdd={addFeatureTag}
                  onCancel={() => setIsAddingFeature(false)}
                />
              )}
              {featureTags.map((tag) => (
                <TagRow
                  key={tag.id}
                  tag={tag}
                  onUpdate={updateFeatureTag}
                  onDelete={handleDeleteFeature}
                  isEditing={editingFeatureId === tag.id}
                  setEditingId={setEditingFeatureId}
                />
              ))}
              {featureTags.length === 0 && !isAddingFeature && (
                <p className="text-[10px] text-[--text-quaternary]/50 py-2 italic">
                  No tags defined
                </p>
              )}
            </div>
          </div>

          {/* Reset Section */}
          <div className="border-t border-[--border-subtle]/30 pt-4 mt-4">
            {showResetConfirm ? (
              <div className="text-[10px] text-[--text-quaternary]/70">
                <span>Reset to defaults? </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-red-400/80 hover:text-red-400 transition-colors"
                >
                  Confirm
                </button>
                <span className="mx-1.5 text-[--text-quaternary]/30">|</span>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="text-[--text-quaternary]/50 hover:text-[--text-secondary] transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="text-[10px] text-[--text-quaternary]/40 hover:text-[--text-quaternary] transition-colors"
              >
                Reset to defaults
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagsPanel;
