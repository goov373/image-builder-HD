import { useEffect } from 'react';

/**
 * Keyboard Shortcuts Modal
 * Shows all available keyboard shortcuts in a categorized overlay
 */
const KeyboardShortcutsModal = ({ isOpen, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const cmdKey = isMac ? '⌘' : 'Ctrl';

  const shortcutCategories = [
    {
      title: 'General',
      shortcuts: [
        { keys: ['?'], description: 'Show keyboard shortcuts' },
        { keys: ['Esc'], description: 'Close panel / Deselect' },
        { keys: [cmdKey, 'E'], description: 'Open export panel' },
      ],
    },
    {
      title: 'Editing',
      shortcuts: [
        { keys: [cmdKey, 'Z'], description: 'Undo' },
        { keys: [cmdKey, 'Shift', 'Z'], description: 'Redo' },
        { keys: ['Delete'], description: 'Remove selected frame' },
        { keys: [cmdKey, 'D'], description: 'Duplicate frame' },
      ],
    },
    {
      title: 'Text Formatting',
      shortcuts: [
        { keys: [cmdKey, 'B'], description: 'Bold' },
        { keys: [cmdKey, 'I'], description: 'Italic' },
        { keys: [cmdKey, 'U'], description: 'Underline' },
      ],
    },
    {
      title: 'View',
      shortcuts: [
        { keys: [cmdKey, '+'], description: 'Zoom in' },
        { keys: [cmdKey, '-'], description: 'Zoom out' },
        { keys: [cmdKey, '0'], description: 'Reset zoom to 100%' },
      ],
    },
    {
      title: 'Navigation',
      shortcuts: [
        { keys: ['←', '→'], description: 'Navigate between frames' },
        { keys: ['Tab'], description: 'Next text field' },
        { keys: ['Shift', 'Tab'], description: 'Previous text field' },
      ],
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none">
        <div
          className="bg-[--surface-canvas] border border-[--border-default] rounded-[--radius-lg] shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[--border-default]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[--radius-md] bg-[--surface-raised] flex items-center justify-center">
                <svg className="w-5 h-5 text-[--text-tertiary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[--text-primary]">Keyboard Shortcuts</h2>
                <p className="text-xs text-[--text-tertiary]">Quick actions to speed up your workflow</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-[--radius-md] flex items-center justify-center text-[--text-tertiary] hover:text-[--text-primary] hover:bg-[--surface-raised] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {shortcutCategories.map((category) => (
                <div key={category.title}>
                  <h3 className="text-xs font-medium text-[--text-tertiary] uppercase tracking-wide mb-3">
                    {category.title}
                  </h3>
                  <div className="space-y-2">
                    {category.shortcuts.map((shortcut, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-2 px-3 rounded-[--radius-md] bg-[--surface-default] border border-[--border-default]"
                      >
                        <span className="text-sm text-[--text-secondary]">{shortcut.description}</span>
                        <div className="flex items-center gap-1">
                          {shortcut.keys.map((key, keyIdx) => (
                            <span key={keyIdx}>
                              <kbd className="px-2 py-1 text-xs font-mono font-medium text-[--text-secondary] bg-[--surface-raised] border border-[--border-emphasis] rounded-[--radius-sm] shadow-sm">
                                {key}
                              </kbd>
                              {keyIdx < shortcut.keys.length - 1 && (
                                <span className="text-[--text-quaternary] mx-0.5">+</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-[--border-default] bg-[--surface-default]">
            <p className="text-xs text-[--text-quaternary] text-center">
              Press{' '}
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-[--surface-raised] border border-[--border-default] rounded-[--radius-sm]">
                ?
              </kbd>{' '}
              anytime to show this menu
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default KeyboardShortcutsModal;
