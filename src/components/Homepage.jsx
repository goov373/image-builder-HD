import { useState, useRef, useEffect } from 'react';

/**
 * Homepage Component - Project Browser
 * Displays existing projects and allows creating new ones
 */
const Homepage = ({ 
  projects, 
  onOpenProject, 
  onCreateNew,
  onDeleteProject,
  onDuplicateProject,
  onRenameProject 
}) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [renameError, setRenameError] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all', 'carousel', 'singleImage', 'eblast', 'videoCover'
  const [sortBy, setSortBy] = useState('updated'); // 'updated', 'created', 'name'
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Content Builder</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded-full text-xs text-gray-300">social carousels</span>
              <span className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded-full text-xs text-gray-300">product images</span>
              <span className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded-full text-xs text-gray-300">eblast graphics</span>
              <span className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded-full text-xs text-gray-300">animated gifs</span>
              <span className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded-full text-xs text-gray-300">website snippets</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Projects Section */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-white">Your Projects</h2>
            
            {/* Filter by Type */}
            <div className="flex items-center gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-300 hover:border-gray-600 focus:border-gray-500 focus:outline-none transition-colors cursor-pointer"
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
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-300 hover:border-gray-600 focus:border-gray-500 focus:outline-none transition-colors cursor-pointer"
              >
                <option value="updated">Last Updated</option>
                <option value="created">Date Created</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={onCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors border border-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </button>
        </div>
        
        {/* Project Grid - filtered and sorted */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...projects]
            .filter(p => p.hasContent) // Only show completed projects, not drafts
            .filter(p => filterType === 'all' || p.projectType === filterType)
            .sort((a, b) => {
              if (sortBy === 'updated') return new Date(b.updatedAt) - new Date(a.updatedAt);
              if (sortBy === 'created') return new Date(b.createdAt) - new Date(a.createdAt);
              if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
              return 0;
            })
            .map(project => (
            <div 
              key={project.id}
              role="button"
              tabIndex={0}
              onClick={() => onOpenProject(project.id)}
              onKeyDown={(e) => e.key === 'Enter' && onOpenProject(project.id)}
              className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 hover:bg-gray-800/50 transition-all cursor-pointer"
            >
              {/* Thumbnail - Project Type Icon */}
              <div className="h-40 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
                <div className="transform group-hover:scale-105 transition-transform">
                  {/* Carousel Icon */}
                  {(project.projectType === 'carousel' || !project.projectType) && (
                    <div className="flex gap-2">
                      {[0, 1, 2].map(i => (
                        <div key={i} className={`w-12 h-16 rounded-lg bg-gray-700 border border-gray-600 ${i > 0 ? 'opacity-50' : ''}`} />
                      ))}
                    </div>
                  )}
                  
                  {/* Single Image Icon */}
                  {project.projectType === 'singleImage' && (
                    <div className="w-20 h-14 rounded-lg border border-gray-600 bg-gray-700 relative overflow-hidden">
                      <div className="absolute inset-1.5 rounded bg-gray-800">
                        <div className="flex gap-1 p-1.5 h-full">
                          <div className="w-2 h-full rounded-sm bg-gray-600" />
                          <div className="flex-1 flex flex-col gap-1">
                            <div className="h-1.5 rounded-full bg-gray-500" />
                            <div className="flex-1 flex gap-1">
                              <div className="flex-1 rounded-sm bg-gray-700" />
                              <div className="flex-1 rounded-sm bg-gray-700" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Eblast Icon */}
                  {project.projectType === 'eblast' && (
                    <div className="w-20 h-14 rounded-lg border border-gray-600 bg-gray-700 p-2.5 flex flex-col gap-1.5">
                      <div className="h-2 rounded-full w-1/2 bg-gray-500" />
                      <div className="flex-1 rounded bg-gray-600" />
                      <div className="h-1.5 rounded-full w-2/3 bg-gray-600" />
                    </div>
                  )}
                  
                  {/* Video Cover Icon */}
                  {project.projectType === 'videoCover' && (
                    <div className="w-20 h-14 rounded-lg border border-gray-600 bg-gray-700 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gray-700/0 group-hover:bg-gray-700/20 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="px-4 py-2 bg-gray-700 border border-gray-500 rounded-lg text-white text-sm font-medium">
                      Open Project
                    </div>
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
                          onChange={(e) => { setRenameValue(e.target.value); setRenameError(null); }}
                          onBlur={(e) => handleRenameSubmit(e, project.id)}
                          onKeyDown={(e) => handleRenameKeyDown(e, project.id)}
                          className={`w-full text-white font-semibold bg-transparent border-b-2 outline-none py-0.5 ${
                            renameError ? 'border-red-500' : 'border-gray-400'
                          }`}
                        />
                        {renameError && (
                          <p className="text-red-400 text-[10px] mt-1">{renameError}</p>
                        )}
                      </div>
                    ) : (
                      <h3 className="text-white font-semibold mb-1 group-hover:text-gray-300 transition-colors truncate">
                        {project.name}
                      </h3>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{project.hasContent ? `${project.frameCount || 5} frames` : 'Empty'}</span>
                      <span>•</span>
                      <span>Updated {project.updatedAt}</span>
                    </div>
                    {project.lastEditedBy && (
                      <div className="text-[10px] text-gray-600 mt-1.5 truncate">
                        Last edited by: {project.lastEditedBy}
                      </div>
                    )}
                  </div>
                  
                  {/* Three-dot Menu - spans full height */}
                  <div className="relative flex items-center" ref={openMenuId === project.id ? menuRef : null}>
                    <button
                      type="button"
                      onClick={(e) => handleMenuClick(e, project.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
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
                        className="absolute right-0 bottom-full mb-1 py-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 min-w-[160px]"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={(e) => handleOpenInNewTab(e, project.id)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-left"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Open in New Tab
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleStartRename(e, project)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-left"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Rename
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDuplicate(e, project.id)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-left"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Duplicate
                        </button>
                        <div className="my-1 border-t border-gray-700" />
                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, project.id)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors text-left"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
            className="group bg-gray-900/50 border-2 border-dashed border-gray-700 rounded-xl overflow-hidden hover:border-gray-500 hover:bg-gray-800/30 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[240px]"
          >
            <div className="w-16 h-16 rounded-full bg-gray-800 group-hover:bg-gray-700 flex items-center justify-center transition-colors mb-3">
              <svg className="w-8 h-8 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-gray-500 group-hover:text-white font-medium transition-colors">Create New Project</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;


