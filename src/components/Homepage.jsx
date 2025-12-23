/**
 * Homepage Component - Project Browser
 * Displays existing projects and allows creating new ones
 */
const Homepage = ({ projects, onOpenProject, onCreateNew }) => {
  return (
    <div className="w-full h-full p-8 overflow-y-auto">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Carousel Studio</h1>
            <p className="text-gray-500 text-sm">Design beautiful social media carousels</p>
          </div>
        </div>
      </div>
      
      {/* Projects Section */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Your Projects</h2>
          <button 
            type="button"
            onClick={onCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors border border-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </button>
        </div>
        
        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div 
              key={project.id}
              onClick={() => onOpenProject(project.id)}
              className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 hover:bg-gray-800/50 transition-all cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="h-40 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
                {project.hasContent ? (
                  <div className="flex gap-2 transform group-hover:scale-105 transition-transform">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-16 h-20 bg-gray-700/50 rounded-lg border border-gray-600 flex items-center justify-center">
                        <div className="w-8 h-1 bg-gray-500 rounded" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-600">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}
                
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
                <h3 className="text-white font-semibold mb-1 group-hover:text-gray-300 transition-colors">
                  {project.name}
                </h3>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{project.hasContent ? `${project.frameCount || 5} frames` : 'Empty'}</span>
                  <span>•</span>
                  <span>Updated {project.updatedAt}</span>
                </div>
              </div>
            </div>
          ))}
          
          {/* Create New Project Card */}
          <div 
            onClick={onCreateNew}
            className="group bg-gray-900/50 border-2 border-dashed border-gray-700 rounded-xl overflow-hidden hover:border-gray-500 hover:bg-gray-800/30 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[240px]"
          >
            <div className="w-16 h-16 rounded-full bg-gray-800 group-hover:bg-gray-700 flex items-center justify-center transition-colors mb-3">
              <svg className="w-8 h-8 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-gray-500 group-hover:text-orange-400 font-medium transition-colors">Create New Project</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;

