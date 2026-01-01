import { useState, useRef, useEffect } from 'react';
import Button from './ui/Button';

/**
 * Homepage Component - Project Browser
 * Displays existing projects and allows creating new ones
 * Uses UI primitives for consistent styling
 */
const Homepage = ({
  projects,
  onOpenProject,
  onCreateNew,
  onDeleteProject,
  onDuplicateProject,
  onRenameProject,
  onQuickExport,
}) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [renameError, setRenameError] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all', 'carousel', 'singleImage', 'eblast', 'videoCover'
  const [sortBy, setSortBy] = useState('updated'); // 'updated', 'created', 'name'
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef(null);
  const renameInputRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus rename input when it appears
  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  const handleMenuClick = (e, projectId) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === projectId ? null : projectId);
  };

  const handleDelete = (e, projectId) => {
    e.stopPropagation();
    if (onDeleteProject) {
      onDeleteProject(projectId);
    }
    setOpenMenuId(null);
  };

  const handleDuplicate = (e, projectId) => {
    e.stopPropagation();
    if (onDuplicateProject) {
      onDuplicateProject(projectId);
    }
    setOpenMenuId(null);
  };

  const handleStartRename = (e, project) => {
    e.stopPropagation();
    setRenamingId(project.id);
    setRenameValue(project.name);
    setRenameError(null);
    setOpenMenuId(null);
  };

  const handleRenameSubmit = (e, projectId) => {
    e.stopPropagation();
    if (!renameValue.trim()) {
      setRenamingId(null);
      setRenameError(null);
      return;
    }

    if (onRenameProject) {
      const result = onRenameProject(projectId, renameValue.trim());
      if (result && !result.success) {
        setRenameError(result.error);
        return;
      }
    }
    setRenamingId(null);
    setRenameError(null);
  };

  const handleRenameKeyDown = (e, projectId) => {
    if (e.key === 'Enter') {
      handleRenameSubmit(e, projectId);
    } else if (e.key === 'Escape') {
      setRenamingId(null);
      setRenameError(null);
    }
  };

  const handleOpenInNewTab = (e, projectId) => {
    e.stopPropagation();
    if (onOpenProject) {
      onOpenProject(projectId);
    }
    setOpenMenuId(null);
  };

  return (
    <div className="w-full h-full p-8 overflow-y-auto">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-[--radius-md] bg-[--surface-raised] border border-[--border-default] flex items-center justify-center">
            <svg
              className="w-7 h-7 text-[--text-tertiary]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[--text-primary]">Content Builder</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-[--surface-raised] border border-[--border-default] rounded-full text-xs text-[--text-tertiary]">
                social carousels
              </span>
              <span className="px-2 py-0.5 bg-[--surface-raised] border border-[--border-default] rounded-full text-xs text-[--text-tertiary]">
                product images
              </span>
              <span className="px-2 py-0.5 bg-[--surface-raised] border border-[--border-default] rounded-full text-xs text-[--text-tertiary]">
                eblast graphics
              </span>
              <span className="px-2 py-0.5 bg-[--surface-raised] border border-[--border-default] rounded-full text-xs text-[--text-tertiary]">
                animated gifs
              </span>
              <span className="px-2 py-0.5 bg-[--surface-raised] border border-[--border-default] rounded-full text-xs text-[--text-tertiary]">
                website snippets
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects Section - shows 6 most recent */}
      {projects.filter((p) => p.hasContent).length > 0 && (
        <div className="max-w-6xl mx-auto mb-10">
          <h2 className="text-sm font-medium text-[--text-tertiary] uppercase tracking-wide mb-4">Recent</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...projects]
              .filter((p) => p.hasContent)
              .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
              .slice(0, 6)
              .map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => onOpenProject(project.id)}
                  className="group flex items-center gap-3 p-3 bg-[--surface-default] hover:bg-[--surface-raised] border border-[--border-default] hover:border-[--border-emphasis] rounded-[--radius-md] transition-all text-left"
                >
                  {/* Mini thumbnail icon */}
                  <div className="w-10 h-10 rounded-[--radius-md] bg-[--surface-raised] flex items-center justify-center flex-shrink-0">
                    {(project.projectType === 'carousel' || !project.projectType) && (
                      <div className="flex gap-0.5">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className={`w-2 h-3 rounded-[2px] bg-[--text-quaternary] ${i > 0 ? 'opacity-40' : ''}`} />
                        ))}
                      </div>
                    )}
                    {project.projectType === 'singleImage' && (
                      <div className="w-5 h-4 rounded-sm border border-[--border-emphasis] bg-[--surface-overlay]" />
                    )}
                    {project.projectType === 'eblast' && (
                      <svg className="w-4 h-4 text-[--text-tertiary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                    {project.projectType === 'videoCover' && (
                      <svg className="w-4 h-4 text-[--text-tertiary]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </div>
                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[--text-primary] truncate group-hover:text-[--text-secondary]">
                      {project.name}
                    </div>
                    <div className="text-[10px] text-[--text-quaternary]">{project.updatedAt}</div>
                  </div>
                  {/* Arrow */}
                  <svg
                    className="w-4 h-4 text-[--text-quaternary] group-hover:text-[--text-tertiary] transition-colors flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* All Projects Section */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-[--text-primary]">All Projects</h2>

            {/* Search and Filter Controls */}
            <div className="flex items-center gap-2">
              {/* Search Bar */}
              <div className="relative">
                <svg
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[--text-quaternary]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  className="w-40 bg-[--surface-raised] border border-[--border-default] rounded-[--radius-md] pl-8 pr-3 py-1.5 text-xs text-[--text-secondary] placeholder-[--text-quaternary] hover:border-[--border-emphasis] focus:border-[--border-strong] focus:outline-none transition-colors"
                />
              </div>

              {/* Filter by Type */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-[--surface-raised] border border-[--border-default] rounded-[--radius-md] px-3 py-1.5 text-xs text-[--text-secondary] hover:border-[--border-emphasis] focus:border-[--border-strong] focus:outline-none transition-colors cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="carousel">Carousels</option>
                <option value="singleImage">Single Images</option>
                <option value="eblast">Eblast Graphics</option>
                <option value="videoCover">Video Covers</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[--surface-raised] border border-[--border-default] rounded-[--radius-md] px-3 py-1.5 text-xs text-[--text-secondary] hover:border-[--border-emphasis] focus:border-[--border-strong] focus:outline-none transition-colors cursor-pointer"
              >
                <option value="updated">Last Updated</option>
                <option value="created">Date Created</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>

          <Button
            variant="secondary"
            size="lg"
            onClick={onCreateNew}
            className="flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </Button>
        </div>

        {/* Project Grid - filtered and sorted */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...projects]
            .filter((p) => p.hasContent) // Only show completed projects, not drafts
            .filter((p) => filterType === 'all' || p.projectType === filterType)
            .filter((p) => !searchQuery || (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a, b) => {
              if (sortBy === 'updated') return new Date(b.updatedAt) - new Date(a.updatedAt);
              if (sortBy === 'created') return new Date(b.createdAt) - new Date(a.createdAt);
              if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
              return 0;
            })
            .map((project) => (
              <div
                key={project.id}
                role="button"
                tabIndex={0}
                onClick={() => onOpenProject(project.id)}
                onKeyDown={(e) => e.key === 'Enter' && onOpenProject(project.id)}
                className="group bg-[--surface-default] border border-[--border-default] rounded-[--radius-md] overflow-hidden hover:border-[--border-emphasis] hover:bg-[--surface-raised] transition-all cursor-pointer"
              >
                {/* Thumbnail - Project Type Icon */}
                <div className="h-40 bg-[--surface-raised] flex items-center justify-center relative overflow-hidden">
                  <div className="transform group-hover:scale-105 transition-transform">
                    {/* Carousel Icon */}
                    {(project.projectType === 'carousel' || !project.projectType) && (
                      <div className="flex gap-2">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className={`w-12 h-16 rounded-[--radius-sm] bg-[--surface-overlay] border border-[--border-default] ${i > 0 ? 'opacity-50' : ''}`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Single Image Icon */}
                    {project.projectType === 'singleImage' && (
                      <div className="w-20 h-14 rounded-[--radius-sm] border border-[--border-default] bg-[--surface-overlay] relative overflow-hidden">
                        <div className="absolute inset-1.5 rounded-[--radius-sm] bg-[--surface-raised]">
                          <div className="flex gap-1 p-1.5 h-full">
                            <div className="w-2 h-full rounded-sm bg-[--surface-elevated]" />
                            <div className="flex-1 flex flex-col gap-1">
                              <div className="h-1.5 rounded-full bg-[--text-quaternary]" />
                              <div className="flex-1 flex gap-1">
                                <div className="flex-1 rounded-sm bg-[--surface-overlay]" />
                                <div className="flex-1 rounded-sm bg-[--surface-overlay]" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Eblast Icon */}
                    {project.projectType === 'eblast' && (
                      <div className="w-20 h-14 rounded-[--radius-sm] border border-[--border-default] bg-[--surface-overlay] p-2.5 flex flex-col gap-1.5">
                        <div className="h-2 rounded-full w-1/2 bg-[--text-quaternary]" />
                        <div className="flex-1 rounded-[--radius-sm] bg-[--surface-elevated]" />
                        <div className="h-1.5 rounded-full w-2/3 bg-[--surface-elevated]" />
                      </div>
                    )}

                    {/* Video Cover Icon */}
                    {project.projectType === 'videoCover' && (
                      <div className="w-20 h-14 rounded-[--radius-sm] border border-[--border-default] bg-[--surface-overlay] flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-[--surface-elevated] flex items-center justify-center">
                          <svg className="w-4 h-4 text-[--text-primary] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[--surface-overlay]/0 group-hover:bg-[--surface-overlay]/30 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                      <div className="px-4 py-2 bg-[--surface-overlay] border border-[--border-emphasis] rounded-[--radius-md] text-[--text-primary] text-sm font-medium">
                        Open Project
                      </div>
                      {onQuickExport && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuickExport(project.id);
                          }}
                          className="px-3 py-2 bg-[--surface-raised] hover:bg-[--surface-elevated] border border-[--border-default] rounded-[--radius-md] text-[--text-primary] text-sm font-medium transition-colors flex items-center gap-1.5"
                          title="Export with last-used settings"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                            />
                          </svg>
                          Export
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-stretch justify-between gap-3">
                    {/* Text content */}
                    <div className="flex-1 min-w-0">
                      {renamingId === project.id ? (
                        <div role="presentation" onClick={(e) => e.stopPropagation()}>
                          <input
                            ref={renameInputRef}
                            type="text"
                            value={renameValue}
                            onChange={(e) => {
                              setRenameValue(e.target.value);
                              setRenameError(null);
                            }}
                            onBlur={(e) => handleRenameSubmit(e, project.id)}
                            onKeyDown={(e) => handleRenameKeyDown(e, project.id)}
                            className={`w-full text-[--text-primary] font-semibold bg-transparent border-b-2 outline-none py-0.5 ${
                              renameError ? 'border-red-500' : 'border-[--border-strong]'
                            }`}
                          />
                          {renameError && <p className="text-red-400 text-[10px] mt-1">{renameError}</p>}
                        </div>
                      ) : (
                        <h3 className="text-[--text-primary] font-semibold mb-1 group-hover:text-[--text-secondary] transition-colors truncate">
                          {project.name}
                        </h3>
                      )}
                      <div className="flex items-center gap-3 text-xs text-[--text-quaternary]">
                        <span>{project.hasContent ? `${project.frameCount || 5} frames` : 'Empty'}</span>
                        <span>•</span>
                        <span>Updated {project.updatedAt}</span>
                      </div>
                      {project.lastEditedBy && (
                        <div className="text-[10px] text-[--text-quaternary] mt-1.5 truncate">
                          Last edited by: {project.lastEditedBy}
                        </div>
                      )}
                    </div>

                    {/* Three-dot Menu - spans full height */}
                    <div className="relative flex items-center" ref={openMenuId === project.id ? menuRef : null}>
                      <button
                        type="button"
                        onClick={(e) => handleMenuClick(e, project.id)}
                        className="w-8 h-8 rounded-[--radius-sm] flex items-center justify-center text-[--text-quaternary] hover:text-[--text-primary] hover:bg-[--surface-overlay] transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <circle cx="12" cy="5" r="2" />
                          <circle cx="12" cy="12" r="2" />
                          <circle cx="12" cy="19" r="2" />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuId === project.id && (
                        <div
                          role="menu"
                          className="absolute right-0 bottom-full mb-1 py-1 bg-[--surface-raised] border border-[--border-default] rounded-[--radius-md] shadow-xl z-50 min-w-[160px]"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={(e) => handleOpenInNewTab(e, project.id)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[--text-secondary] hover:bg-[--surface-overlay] hover:text-[--text-primary] transition-colors text-left"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                            Open in New Tab
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleStartRename(e, project)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[--text-secondary] hover:bg-[--surface-overlay] hover:text-[--text-primary] transition-colors text-left"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                            Rename
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDuplicate(e, project.id)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[--text-secondary] hover:bg-[--surface-overlay] hover:text-[--text-primary] transition-colors text-left"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                            Duplicate
                          </button>
                          <div className="my-1 border-t border-[--border-default]" />
                          <button
                            type="button"
                            onClick={(e) => handleDelete(e, project.id)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors text-left"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {/* Create New Project Card */}
          <div
            role="button"
            tabIndex={0}
            onClick={onCreateNew}
            onKeyDown={(e) => e.key === 'Enter' && onCreateNew()}
            className="group bg-[--surface-default] border-2 border-dashed border-[--border-default] rounded-[--radius-md] overflow-hidden hover:border-[--border-emphasis] hover:bg-[--surface-raised] transition-all cursor-pointer flex flex-col items-center justify-center min-h-[240px]"
          >
            <div className="w-16 h-16 rounded-full bg-[--surface-raised] group-hover:bg-[--surface-overlay] flex items-center justify-center transition-colors mb-3">
              <svg
                className="w-8 h-8 text-[--text-quaternary] group-hover:text-[--text-primary] transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-[--text-tertiary] group-hover:text-[--text-primary] font-medium transition-colors">
              Create New Project
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
