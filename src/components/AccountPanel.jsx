import { useState } from 'react';

/**
 * Account Management Panel
 * Handles team members, invites, and account settings
 */
const AccountPanel = ({ onClose, isOpen }) => {
  const [activeTab, setActiveTab] = useState('team'); // 'team', 'invites', 'settings'
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('editor');
  
  // Mock team members data
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'You', email: 'gavin@company.com', role: 'owner', status: 'active', avatar: null },
    { id: 2, name: 'Sarah Chen', email: 'sarah@company.com', role: 'admin', status: 'active', avatar: null },
    { id: 3, name: 'Mike Johnson', email: 'mike@company.com', role: 'editor', status: 'active', avatar: null },
  ]);
  
  // Mock pending invites
  const [pendingInvites, setPendingInvites] = useState([
    { id: 1, email: 'alex@company.com', role: 'editor', sentAt: '2024-12-20', expiresAt: '2024-12-27' },
    { id: 2, email: 'jordan@company.com', role: 'viewer', sentAt: '2024-12-21', expiresAt: '2024-12-28' },
  ]);

  const roles = [
    { id: 'owner', name: 'Owner', desc: 'Full access, billing, team management' },
    { id: 'admin', name: 'Admin', desc: 'Full access, team management' },
    { id: 'editor', name: 'Editor', desc: 'Create and edit projects' },
    { id: 'viewer', name: 'Viewer', desc: 'View only access' },
  ];

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    const newInvite = {
      id: Date.now(),
      email: inviteEmail.trim(),
      role: inviteRole,
      sentAt: new Date().toISOString().split('T')[0],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    setPendingInvites(prev => [...prev, newInvite]);
    setInviteEmail('');
    setShowInviteForm(false);
  };

  const handleResendInvite = (inviteId) => {
    setPendingInvites(prev => prev.map(inv => 
      inv.id === inviteId 
        ? { ...inv, sentAt: new Date().toISOString().split('T')[0], expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
        : inv
    ));
  };

  const handleCancelInvite = (inviteId) => {
    setPendingInvites(prev => prev.filter(inv => inv.id !== inviteId));
  };

  const handleRemoveMember = (memberId) => {
    if (teamMembers.find(m => m.id === memberId)?.role === 'owner') return;
    setTeamMembers(prev => prev.filter(m => m.id !== memberId));
  };

  const handleChangeRole = (memberId, newRole) => {
    if (teamMembers.find(m => m.id === memberId)?.role === 'owner') return;
    setTeamMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
  };

  return (
    <div 
      className={`fixed top-[56px] h-[calc(100%-56px)] w-80 bg-gray-900 border-r border-gray-800 z-40 flex flex-col ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      style={{ left: isOpen ? 64 : -256, transition: 'left 0.3s ease-out' }}
    >
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-800 flex items-center justify-between" style={{ height: 64 }}>
        <h2 className="text-base font-semibold text-white">Account</h2>
        <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex-shrink-0 flex border-b border-gray-800">
        <button 
          type="button"
          onClick={() => setActiveTab('team')}
          className={`flex-1 py-3 text-xs font-medium transition-colors ${activeTab === 'team' ? 'text-white border-b-2 border-gray-500' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Team
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('invites')}
          className={`flex-1 py-3 text-xs font-medium transition-colors relative ${activeTab === 'invites' ? 'text-white border-b-2 border-gray-500' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Invites
          {pendingInvites.length > 0 && (
            <span className="absolute top-2 right-4 w-4 h-4 bg-gray-600 rounded-full text-[10px] flex items-center justify-center text-white">
              {pendingInvites.length}
            </span>
          )}
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-3 text-xs font-medium transition-colors ${activeTab === 'settings' ? 'text-white border-b-2 border-gray-500' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Settings
        </button>
      </div>
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
        
        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="space-y-4">
            {/* Invite Button */}
            <button
              type="button"
              onClick={() => setShowInviteForm(true)}
              className="w-full py-2.5 rounded-lg border border-dashed border-gray-600 text-gray-400 hover:border-gray-500 hover:text-white hover:bg-gray-800/50 transition-all text-sm font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Invite Team Member
            </button>
            
            {/* Invite Form */}
            {showInviteForm && (
              <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 space-y-3">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:border-gray-500"
                >
                  {roles.filter(r => r.id !== 'owner').map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteForm(false)}
                    className="flex-1 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleInvite}
                    disabled={!inviteEmail.trim()}
                    className="flex-1 py-2 rounded-lg bg-white text-gray-900 hover:bg-gray-200 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send Invite
                  </button>
                </div>
              </div>
            )}
            
            {/* Team Members List */}
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Team Members ({teamMembers.length})</h3>
              {teamMembers.map(member => (
                <div key={member.id} className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/50 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-medium text-white">
                    {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{member.name}</p>
                    <p className="text-xs text-gray-500 truncate">{member.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {member.role === 'owner' ? (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-gray-700 text-gray-400">Owner</span>
                    ) : (
                      <>
                        <select
                          value={member.role}
                          onChange={(e) => handleChangeRole(member.id, e.target.value)}
                          className="text-[10px] px-2 py-1 rounded bg-gray-700 border-0 text-gray-300 focus:outline-none cursor-pointer"
                        >
                          {roles.filter(r => r.id !== 'owner').map(role => (
                            <option key={role.id} value={role.id}>{role.name}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(member.id)}
                          className="p-1 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors"
                          title="Remove member"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Invites Tab */}
        {activeTab === 'invites' && (
          <div className="space-y-4">
            {pendingInvites.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-500">No pending invites</p>
                <button
                  type="button"
                  onClick={() => { setActiveTab('team'); setShowInviteForm(true); }}
                  className="mt-3 text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Invite someone →
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pending Invites ({pendingInvites.length})</h3>
                {pendingInvites.map(invite => (
                  <div key={invite.id} className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/50">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-white">{invite.email}</p>
                        <p className="text-xs text-gray-500 capitalize">{invite.role}</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-gray-700 text-gray-400">Pending</span>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      Sent {invite.sentAt} · Expires {invite.expiresAt}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleResendInvite(invite.id)}
                        className="flex-1 py-1.5 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 text-xs font-medium transition-colors"
                      >
                        Resend
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancelInvite(invite.id)}
                        className="flex-1 py-1.5 rounded bg-gray-700 text-gray-300 hover:bg-red-500/20 hover:text-red-400 text-xs font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-5">
            {/* Profile Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Profile</h3>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30 border border-gray-700/50">
                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-lg font-medium text-white">
                  G
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Gavin</p>
                  <p className="text-xs text-gray-500">gavin@company.com</p>
                </div>
                <button type="button" className="text-xs text-gray-400 hover:text-white transition-colors">
                  Edit
                </button>
              </div>
            </div>
            
            {/* Workspace Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Workspace</h3>
              <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/50 space-y-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Workspace Name</label>
                  <input
                    type="text"
                    defaultValue="My Team"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:border-gray-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Danger Zone */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium text-red-400/70 uppercase tracking-wide">Danger Zone</h3>
              <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 space-y-2">
                <p className="text-xs text-gray-400">Permanently delete your account and all associated data.</p>
                <button type="button" className="w-full py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-medium transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountPanel;

