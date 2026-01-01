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
          <label className="block text-xs font-medium text-[--text-tertiary] mb-1.5">Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name..."
            className="w-full px-3 py-2.5 bg-[--surface-raised] border border-[--border-default] rounded-[--radius-md] text-[--text-primary] text-sm placeholder-[--text-quaternary] focus:outline-none focus:border-[--border-strong] focus:ring-1 focus:ring-[--border-emphasis] transition-all"
          />
        </div>

        {/* Project Type Grid - 2 columns */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Carousel */}
          <button
            type="button"
            onClick={() => setSelectedType('carousel')}
            className={`p-3 rounded-[--radius-md] border text-left transition-all duration-200 flex items-center gap-3 ${
              selectedType === 'carousel'
                ? 'border-[--border-strong] bg-[--surface-raised]'
                : 'border-[--border-default] bg-[--surface-default] hover:border-[--border-emphasis] hover:bg-[--surface-raised]'
            }`}
          >
            <div className="w-[104px] flex-shrink-0 flex gap-1 justify-center">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-8 h-11 rounded-[--radius-sm] bg-[--surface-overlay] border border-[--border-default] ${i > 0 ? 'opacity-50' : ''}`}
                />
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`text-xs font-semibold ${selectedType === 'carousel' ? 'text-[--text-primary]' : 'text-[--text-secondary]'}`}>
                Carousel
              </h3>
              <p className="text-[10px] text-[--text-quaternary] leading-relaxed">
                Multi-slide posts for LinkedIn & Instagram. Ideal for storytelling.
              </p>
            </div>
          </button>

          {/* Single Image / Product Mockup */}
          <button
            type="button"
            onClick={() => setSelectedType('singleImage')}
            className={`p-3 rounded-[--radius-md] border text-left transition-all duration-200 flex items-center gap-3 ${
              selectedType === 'singleImage'
                ? 'border-[--border-strong] bg-[--surface-raised]'
                : 'border-[--border-default] bg-[--surface-default] hover:border-[--border-emphasis] hover:bg-[--surface-raised]'
            }`}
          >
            <div className="w-[104px] flex-shrink-0 flex justify-center">
              <div
                className={`w-14 h-10 rounded-[--radius-sm] border relative overflow-hidden ${
                  selectedType === 'singleImage' ? 'bg-[--surface-overlay] border-[--border-strong]' : 'bg-[--surface-overlay] border-[--border-default]'
                }`}
              >
                {/* Mini dashboard mockup icon */}
                <div className="absolute inset-1 rounded-[--radius-sm] bg-[--surface-raised]">
                  <div className="flex gap-0.5 p-1">
                    <div
                      className={`w-1.5 h-full rounded-sm ${selectedType === 'singleImage' ? 'bg-[--text-tertiary]' : 'bg-[--surface-elevated]'}`}
                    />
                    <div className="flex-1 flex flex-col gap-0.5">
                      <div
                        className={`h-1 rounded-full ${selectedType === 'singleImage' ? 'bg-[--text-quaternary]' : 'bg-[--text-quaternary]'}`}
                      />
                      <div className="flex-1 flex gap-0.5">
                        {[1, 2].map((i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-sm ${selectedType === 'singleImage' ? 'bg-[--surface-overlay]' : 'bg-[--surface-overlay]'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className={`text-xs font-semibold ${selectedType === 'singleImage' ? 'text-[--text-primary]' : 'text-[--text-secondary]'}`}
              >
                Single Image
              </h3>
              <p className="text-[10px] text-[--text-quaternary] leading-relaxed">
                Product mockups for landing pages and marketing.
              </p>
            </div>
          </button>

          {/* Eblast Images */}
          <button
            type="button"
            onClick={() => setSelectedType('eblast')}
            className={`p-3 rounded-[--radius-md] border text-left transition-all duration-200 flex items-center gap-3 ${
              selectedType === 'eblast'
                ? 'border-[--border-strong] bg-[--surface-raised]'
                : 'border-[--border-default] bg-[--surface-default] hover:border-[--border-emphasis] hover:bg-[--surface-raised]'
            }`}
          >
            <div className="w-[104px] flex-shrink-0 flex justify-center">
              <div
                className={`w-16 h-12 rounded-[--radius-sm] border p-2 flex flex-col gap-1 ${
                  selectedType === 'eblast' ? 'bg-[--surface-overlay] border-[--border-strong]' : 'bg-[--surface-overlay] border-[--border-default]'
                }`}
              >
                <div
                  className={`h-1.5 rounded-full w-1/2 ${selectedType === 'eblast' ? 'bg-[--text-tertiary]' : 'bg-[--text-quaternary]'}`}
                />
                <div className={`flex-1 rounded-[--radius-sm] ${selectedType === 'eblast' ? 'bg-[--surface-elevated]' : 'bg-[--surface-elevated]'}`} />
                <div
                  className={`h-1 rounded-full w-2/3 ${selectedType === 'eblast' ? 'bg-[--text-quaternary]' : 'bg-[--surface-elevated]'}`}
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`text-xs font-semibold ${selectedType === 'eblast' ? 'text-[--text-primary]' : 'text-[--text-secondary]'}`}>
                Eblast Images
              </h3>
              <p className="text-[10px] text-[--text-quaternary] leading-relaxed">Email marketing graphics and hero banners.</p>
            </div>
          </button>

          {/* Video Cover */}
          <button
            type="button"
            onClick={() => setSelectedType('videoCover')}
            className={`p-3 rounded-[--radius-md] border text-left transition-all duration-200 flex items-center gap-3 ${
              selectedType === 'videoCover'
                ? 'border-[--border-strong] bg-[--surface-raised]'
                : 'border-[--border-default] bg-[--surface-default] hover:border-[--border-emphasis] hover:bg-[--surface-raised]'
            }`}
          >
            <div className="w-[104px] flex-shrink-0 flex justify-center">
              <div
                className={`w-16 h-11 rounded-[--radius-sm] border flex items-center justify-center ${
                  selectedType === 'videoCover' ? 'bg-[--surface-overlay] border-[--border-strong]' : 'bg-[--surface-overlay] border-[--border-default]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    selectedType === 'videoCover' ? 'bg-[--text-tertiary]' : 'bg-[--surface-elevated]'
                  }`}
                >
                  <svg className="w-3 h-3 text-[--text-primary] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`text-xs font-semibold ${selectedType === 'videoCover' ? 'text-[--text-primary]' : 'text-[--text-secondary]'}`}>
                Video Cover
              </h3>
              <p className="text-[10px] text-[--text-quaternary] leading-relaxed">YouTube thumbnails and social video covers.</p>
            </div>
          </button>

          {/* Website Sections - Coming Soon */}
          <button
            type="button"
            disabled
            className="col-span-2 p-4 rounded-[--radius-md] border text-left flex items-center gap-4 border-[--border-subtle] bg-[--surface-default] opacity-40 cursor-not-allowed"
          >
            {/* Multiple wireframe illustrations - Much bigger */}
            <div className="flex gap-2.5 flex-shrink-0">
              {/* Hero layout */}
              <div className="w-[85px] h-[74px] rounded-[--radius-sm] border border-[--border-default] bg-[--surface-canvas] p-1.5 flex flex-col gap-1">
                <div className="h-6 rounded-[--radius-sm] bg-[--surface-overlay]" />
                <div className="flex-1 rounded-[--radius-sm] bg-[--surface-raised]" />
              </div>
              {/* 3-column layout */}
              <div className="w-[85px] h-[74px] rounded-[--radius-sm] border border-[--border-default] bg-[--surface-canvas] p-1.5 flex flex-col gap-1">
                <div className="h-2.5 rounded-[--radius-sm] bg-[--surface-overlay]" />
                <div className="flex gap-1 flex-1">
                  <div className="flex-1 rounded-[--radius-sm] bg-[--surface-raised]" />
                  <div className="flex-1 rounded-[--radius-sm] bg-[--surface-raised]" />
                  <div className="flex-1 rounded-[--radius-sm] bg-[--surface-raised]" />
                </div>
              </div>
              {/* CTA layout */}
              <div className="w-[85px] h-[74px] rounded-[--radius-sm] border border-[--border-default] bg-[--surface-canvas] p-1.5 flex flex-col justify-center items-center gap-1">
                <div className="w-10 h-2 rounded-[--radius-sm] bg-[--surface-overlay]" />
                <div className="w-12 h-4 rounded-[--radius-sm] bg-[--surface-elevated]" />
              </div>
              {/* Split layout */}
              <div className="w-[85px] h-[74px] rounded-[--radius-sm] border border-[--border-default] bg-[--surface-canvas] p-1.5 flex gap-1">
                <div className="flex-1 rounded-[--radius-sm] bg-[--surface-raised]" />
                <div className="flex-1 flex flex-col gap-1">
                  <div className="h-2 rounded-[--radius-sm] bg-[--surface-overlay]" />
                  <div className="h-1.5 rounded-[--radius-sm] bg-[--surface-overlay]/50" />
                  <div className="flex-1" />
                  <div className="h-3 w-10 rounded-[--radius-sm] bg-[--surface-elevated]" />
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-semibold text-[--text-quaternary]">Website Sections</h3>
              <p className="text-[10px] text-[--text-disabled] leading-relaxed">Coming soon</p>
            </div>
          </button>
        </div>

        {/* Create Button */}
        <button
          type="button"
          onClick={handleCreate}
          disabled={!selectedType}
          className={`w-full py-3 rounded-[--radius-md] font-medium text-sm transition-all duration-200 ${
            selectedType
              ? 'bg-[--surface-overlay] hover:bg-[--surface-elevated] text-[--text-primary] border border-[--border-emphasis]'
              : 'bg-[--surface-default] text-[--text-disabled] cursor-not-allowed border border-[--border-default]'
          }`}
        >
          {selectedType ? 'Create Project' : 'Select a format'}
        </button>
      </div>
    </div>
  );
};

export default NewProjectView;
