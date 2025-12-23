import { useState } from 'react';

/**
 * New Project View Component
 * Project creation form with type selection
 */
const NewProjectView = ({ onCreateProject }) => {
  const [projectName, setProjectName] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  
  const handleCreate = () => {
    if (selectedType) {
      onCreateProject(selectedType, projectName || 'Untitled Project');
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] p-6">
      <div className="max-w-xl w-full">
        {/* Project Name Input */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name..."
            className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
          />
        </div>
        
        {/* Project Type Grid - 2 columns */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Carousel */}
          <button
            type="button"
            onClick={() => setSelectedType('carousel')}
            className={`p-3 rounded-xl border text-left transition-all duration-200 flex items-center gap-3 ${
              selectedType === 'carousel'
                ? 'border-gray-500 bg-gray-800'
                : 'border-gray-700/50 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50'
            }`}
          >
            <div className="w-[104px] flex-shrink-0 flex gap-1 justify-center">
              {[0, 1, 2].map(i => (
                <div key={i} className={`w-8 h-11 rounded bg-gray-700 border border-gray-600 ${i > 0 ? 'opacity-50' : ''}`} />
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`text-xs font-semibold ${selectedType === 'carousel' ? 'text-white' : 'text-gray-300'}`}>Carousel</h3>
              <p className="text-[10px] text-gray-500 leading-relaxed">Multi-slide posts for LinkedIn & Instagram. Ideal for storytelling.</p>
            </div>
          </button>

          {/* Single Post - Coming Soon */}
          <button
            type="button"
            disabled
            className="p-3 rounded-xl border text-left flex items-center gap-3 border-gray-700/30 bg-gray-800/20 opacity-40 cursor-not-allowed"
          >
            <div className="w-[104px] flex-shrink-0 flex justify-center">
              <div className="w-14 h-14 rounded-lg bg-gray-700 border border-gray-600 flex items-center justify-center">
                <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-semibold text-gray-500">Single Post</h3>
              <p className="text-[10px] text-gray-600 leading-relaxed">Coming soon</p>
            </div>
          </button>

          {/* Eblast Images - Coming Soon */}
          <button
            type="button"
            disabled
            className="p-3 rounded-xl border text-left flex items-center gap-3 border-gray-700/30 bg-gray-800/20 opacity-40 cursor-not-allowed"
          >
            <div className="w-[104px] flex-shrink-0 flex justify-center">
              <div className="w-16 h-12 rounded-lg bg-gray-700 border border-gray-600 p-2 flex flex-col gap-1">
                <div className="h-1.5 rounded-full bg-gray-500 w-1/2" />
                <div className="flex-1 rounded bg-gray-600" />
                <div className="h-1 rounded-full bg-gray-600 w-2/3" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-semibold text-gray-500">Eblast Images</h3>
              <p className="text-[10px] text-gray-600 leading-relaxed">Coming soon</p>
            </div>
          </button>

          {/* Video Cover - Coming Soon */}
          <button
            type="button"
            disabled
            className="p-3 rounded-xl border text-left flex items-center gap-3 border-gray-700/30 bg-gray-800/20 opacity-40 cursor-not-allowed"
          >
            <div className="w-[104px] flex-shrink-0 flex justify-center">
              <div className="w-16 h-11 rounded-lg bg-gray-700 border border-gray-600 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-semibold text-gray-500">Video Cover</h3>
              <p className="text-[10px] text-gray-600 leading-relaxed">Coming soon</p>
            </div>
          </button>
          
          {/* Website Sections - Coming Soon */}
          <button
            type="button"
            disabled
            className="col-span-2 p-4 rounded-xl border text-left flex items-center gap-4 border-gray-700/30 bg-gray-800/20 opacity-40 cursor-not-allowed"
          >
            {/* Multiple wireframe illustrations - Much bigger */}
            <div className="flex gap-2.5 flex-shrink-0">
              {/* Hero layout */}
              <div className="w-[85px] h-[74px] rounded-lg border border-gray-600 bg-gray-900/50 p-1.5 flex flex-col gap-1">
                <div className="h-6 rounded bg-gray-700" />
                <div className="flex-1 rounded bg-gray-800" />
              </div>
              {/* 3-column layout */}
              <div className="w-[85px] h-[74px] rounded-lg border border-gray-600 bg-gray-900/50 p-1.5 flex flex-col gap-1">
                <div className="h-2.5 rounded bg-gray-700" />
                <div className="flex gap-1 flex-1">
                  <div className="flex-1 rounded bg-gray-800" />
                  <div className="flex-1 rounded bg-gray-800" />
                  <div className="flex-1 rounded bg-gray-800" />
                </div>
              </div>
              {/* CTA layout */}
              <div className="w-[85px] h-[74px] rounded-lg border border-gray-600 bg-gray-900/50 p-1.5 flex flex-col justify-center items-center gap-1">
                <div className="w-10 h-2 rounded bg-gray-700" />
                <div className="w-12 h-4 rounded bg-gray-600" />
              </div>
              {/* Split layout */}
              <div className="w-[85px] h-[74px] rounded-lg border border-gray-600 bg-gray-900/50 p-1.5 flex gap-1">
                <div className="flex-1 rounded bg-gray-800" />
                <div className="flex-1 flex flex-col gap-1">
                  <div className="h-2 rounded bg-gray-700" />
                  <div className="h-1.5 rounded bg-gray-700/50" />
                  <div className="flex-1" />
                  <div className="h-3 w-10 rounded bg-gray-600" />
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-semibold text-gray-500">Website Sections</h3>
              <p className="text-[10px] text-gray-600 leading-relaxed">Coming soon</p>
            </div>
          </button>
        </div>
        
        {/* Create Button */}
        <button
          type="button"
          onClick={handleCreate}
          disabled={!selectedType}
          className={`w-full py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
            selectedType
              ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600'
              : 'bg-gray-800/50 text-gray-600 cursor-not-allowed border border-gray-700/50'
          }`}
        >
          {selectedType ? 'Create Project' : 'Select a format'}
        </button>
        
      </div>
    </div>
  );
};

export default NewProjectView;


