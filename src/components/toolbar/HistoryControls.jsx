import { useCarouselsContext } from '../../context';

/**
 * History Controls Component
 * Undo/Redo buttons for the Toolbar
 *
 * Now connected to the carousels reducer's built-in undo/redo system
 */
const HistoryControls = ({ className = '' }) => {
  const { canUndo, canRedo, handleUndo, handleRedo, historyLength, futureLength } = useCarouselsContext();

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* Undo Button */}
      <button
        type="button"
        onClick={handleUndo}
        disabled={!canUndo}
        className={`p-2 rounded-[--radius-md] border transition-all duration-200 ${
          canUndo
            ? 'border-[--border-default] text-[--text-tertiary] hover:bg-[--surface-overlay] hover:border-[--border-emphasis] hover:text-white'
            : 'border-transparent text-[--text-disabled] cursor-not-allowed'
        }`}
        title={`Undo (${historyLength} steps back available)`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h10a4 4 0 014 4v2M3 10l4-4m-4 4l4 4"
          />
        </svg>
      </button>

      {/* Redo Button */}
      <button
        type="button"
        onClick={handleRedo}
        disabled={!canRedo}
        className={`p-2 rounded-[--radius-md] border transition-all duration-200 ${
          canRedo
            ? 'border-[--border-default] text-[--text-tertiary] hover:bg-[--surface-overlay] hover:border-[--border-emphasis] hover:text-white'
            : 'border-transparent text-[--text-disabled] cursor-not-allowed'
        }`}
        title={`Redo (${futureLength} steps forward available)`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 10H11a4 4 0 00-4 4v2m14-6l-4-4m4 4l-4 4"
          />
        </svg>
      </button>
    </div>
  );
};

export default HistoryControls;
