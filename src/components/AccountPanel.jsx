import { useState, useEffect } from 'react';
import {
  getTeamMembers,
  getPendingInvites,
  sendInvite,
  resendInvite,
  cancelInvite,
  updateMemberRole,
  removeMember,
  isTeamOwner,
  isOwnerEmail,
} from '../lib/teams';
import { isSupabaseConfigured } from '../lib/supabase';
import { logger } from '../utils';

/**
 * Account Management Panel
 * Handles team members, invites, and account settings
 * Connected to Supabase for real data persistence
 */
const AccountPanel = ({ onClose, isOpen, onSignOut = null, user = null }) => {
  const [activeTab, setActiveTab] = useState('team'); // 'team', 'invites', 'settings'
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('editor');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [isOwner, setIsOwner] = useState(false);

  // Initialize profile name from user data
  useEffect(() => {
    if (user) {
      setProfileName(user.user_metadata?.full_name || user.email?.split('@')[0] || '');
    }
  }, [user]);

  // Team members from Supabase
  const [teamMembers, setTeamMembers] = useState([]);

  // Pending invites from Supabase
  const [pendingInvites, setPendingInvites] = useState([]);

  const roles = [
    { id: 'owner', name: 'Owner', desc: 'Full access, billing, team management' },
    { id: 'admin', name: 'Admin', desc: 'Full access, team management' },
    { id: 'editor', name: 'Editor', desc: 'Create and edit projects' },
    { id: 'viewer', name: 'Viewer', desc: 'View only access' },
  ];

  // Load team data from Supabase on mount and when panel opens
  useEffect(() => {
    if (isOpen && isSupabaseConfigured()) {
      loadTeamData();
    }
  }, [isOpen]);

  const loadTeamData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if current user is owner
      const ownerStatus = await isTeamOwner();
      setIsOwner(ownerStatus);

      const [membersResult, invitesResult] = await Promise.all([getTeamMembers(), getPendingInvites()]);

      if (membersResult.error) {
        logger.error('Error loading members:', membersResult.error);
      } else {
        // Mark owner in members list
        const membersWithOwner = membersResult.members.map((m) => ({
          ...m,
          role: isOwnerEmail(m.email) ? 'owner' : m.role,
        }));
        setTeamMembers(membersWithOwner);
      }

      if (invitesResult.error) {
        logger.error('Error loading invites:', invitesResult.error);
      } else {
        setPendingInvites(invitesResult.invites);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;

    setError(null);
    const { invite, error } = await sendInvite(inviteEmail.trim(), inviteRole);

    if (error) {
      setError(error.message);
      return;
    }

    if (invite) {
      setPendingInvites((prev) => [invite, ...prev]);
    }

    setInviteEmail('');
    setShowInviteForm(false);
  };

  const handleResendInvite = async (inviteId) => {
    const { invite, error } = await resendInvite(inviteId);

    if (error) {
      setError(error.message);
      return;
    }

    if (invite) {
      setPendingInvites((prev) => prev.map((inv) => (inv.id === inviteId ? invite : inv)));
    }
  };

  const handleCancelInvite = async (inviteId) => {
    const { success, error } = await cancelInvite(inviteId);

    if (error) {
      setError(error.message);
      return;
    }

    if (success) {
      setPendingInvites((prev) => prev.filter((inv) => inv.id !== inviteId));
    }
  };

  const handleRemoveMember = async (memberId) => {
    const member = teamMembers.find((m) => m.id === memberId);
    if (member?.role === 'owner' || member?.isCurrentUser) return;

    const { success, error } = await removeMember(memberId);

    if (error) {
      setError(error.message);
      return;
    }

    if (success) {
      setTeamMembers((prev) => prev.filter((m) => m.id !== memberId));
    }
  };

  const handleChangeRole = async (memberId, newRole) => {
    const member = teamMembers.find((m) => m.id === memberId);
    if (member?.role === 'owner' || member?.isCurrentUser) return;

    const { member: updatedMember, error } = await updateMemberRole(memberId, newRole);

    if (error) {
      setError(error.message);
      return;
    }

    if (updatedMember) {
      setTeamMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)));
    }
  };

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Update user profile
  const handleUpdateProfile = async () => {
    if (!isSupabaseConfigured() || !user) return;

    try {
      const { supabase } = await import('../lib/supabase');
      const { error } = await supabase.auth.updateUser({
        data: { full_name: profileName },
      });

      if (error) throw error;
      setIsEditingProfile(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Get user display info
  const userDisplayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || 'No email';
  const userInitials = userDisplayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`fixed top-[56px] h-[calc(100%-56px)] w-72 bg-[--surface-canvas] border-r border-[--border-default] z-40 flex flex-col ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      style={{ left: isOpen ? 64 : -224, transition: 'left 0.3s ease-out' }}
    >
      {/* Fixed Header */}
      <div
        className="flex-shrink-0 p-4 border-b border-default flex items-center justify-between"
        style={{ height: 64 }}
      >
        <h2 className="text-base font-semibold text-white">Account</h2>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded hover:bg-surface-raised text-tertiary hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex-shrink-0 flex border-b border-default">
        <button
          type="button"
          onClick={() => setActiveTab('team')}
          className={`flex-1 py-3 text-xs font-medium transition-colors ${activeTab === 'team' ? 'text-white border-b-2 border-strong' : 'text-quaternary hover:text-secondary'}`}
        >
          Team
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('invites')}
          className={`flex-1 py-3 text-xs font-medium transition-colors relative ${activeTab === 'invites' ? 'text-white border-b-2 border-strong' : 'text-quaternary hover:text-secondary'}`}
        >
          Invites
          {pendingInvites.length > 0 && (
            <span className="absolute top-2 right-4 w-4 h-4 bg-surface-elevated rounded-full text-[10px] flex items-center justify-center text-white">
              {pendingInvites.length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-3 text-xs font-medium transition-colors ${activeTab === 'settings' ? 'text-white border-b-2 border-strong' : 'text-quaternary hover:text-secondary'}`}
        >
          Settings
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="space-y-4">
            {/* Invite Button - Owner only */}
            {isOwner && (
              <button
                type="button"
                onClick={() => setShowInviteForm(true)}
                className="w-full py-2.5 rounded border border-dashed border-emphasis text-tertiary hover:border-strong hover:text-white hover:bg-surface-raised/50 transition-all text-sm font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Invite Team Member
              </button>
            )}

            {/* Invite Form */}
            {showInviteForm && (
              <div className="p-3 rounded bg-surface-raised/50 border border-default space-y-3">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full px-3 py-2 bg-surface-raised border border-emphasis rounded text-sm text-white placeholder-quaternary focus:outline-none focus:border-strong"
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-raised border border-emphasis rounded text-sm text-white focus:outline-none focus:border-strong"
                >
                  {roles
                    .filter((r) => r.id !== 'owner')
                    .map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                </select>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteForm(false)}
                    className="flex-1 py-2 rounded bg-surface-overlay text-secondary hover:bg-surface-elevated text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleInvite}
                    disabled={!inviteEmail.trim()}
                    className="flex-1 py-2 rounded bg-white text-black hover:bg-gray-100 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send Invite
                  </button>
                </div>
              </div>
            )}

            {/* Team Members List */}
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-quaternary uppercase tracking-wide">
                Team Members ({teamMembers.length})
              </h3>

              {/* Error message */}
              {error && (
                <div className="p-2 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                  {error}
                </div>
              )}

              {/* Loading state */}
              {isLoading ? (
                <div className="py-6 text-center">
                  <div className="w-6 h-6 mx-auto mb-2 border-2 border-emphasis border-t-strong rounded-full animate-spin" />
                  <p className="text-xs text-quaternary">Loading team...</p>
                </div>
              ) : teamMembers.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-xs text-quaternary">No team members yet</p>
                  <p className="text-[10px] text-disabled mt-1">Invite someone to get started</p>
                </div>
              ) : (
                teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-3 rounded bg-surface-raised/30 border border-default/50 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-surface-overlay flex items-center justify-center text-xs font-medium text-white">
                      {(member.name || member.email || '?')
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {member.isCurrentUser ? 'You' : member.name || member.email?.split('@')[0]}
                      </p>
                      <p className="text-xs text-quaternary truncate">{member.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Always show role badge for owner or if current user is viewing themselves */}
                      {member.role === 'owner' || member.isCurrentUser || !isOwner ? (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-surface-overlay text-tertiary capitalize">
                          {member.role}
                        </span>
                      ) : (
                        /* Owner can manage other team members */
                        <>
                          <select
                            value={member.role}
                            onChange={(e) => handleChangeRole(member.id, e.target.value)}
                            className="text-[10px] px-2 py-1 rounded bg-surface-overlay border-0 text-secondary focus:outline-none cursor-pointer"
                          >
                            {roles
                              .filter((r) => r.id !== 'owner')
                              .map((role) => (
                                <option key={role.id} value={role.id}>
                                  {role.name}
                                </option>
                              ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(member.id)}
                            className="p-1 rounded hover:bg-red-500/20 text-quaternary hover:text-red-400 transition-colors"
                            title="Remove member"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Invites Tab */}
        {activeTab === 'invites' && (
          <div className="space-y-4">
            {!isOwner ? (
              /* Non-owners see a message */
              <div className="text-center py-8">
                <svg
                  className="w-12 h-12 mx-auto text-disabled mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <p className="text-sm text-quaternary">Owner access required</p>
                <p className="text-xs text-disabled mt-1">Only the team owner can manage invites</p>
              </div>
            ) : pendingInvites.length === 0 ? (
              <div className="text-center py-8">
                <svg
                  className="w-12 h-12 mx-auto text-disabled mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm text-quaternary">No pending invites</p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('team');
                    setShowInviteForm(true);
                  }}
                  className="mt-3 text-xs text-tertiary hover:text-white transition-colors"
                >
                  Invite someone →
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-quaternary uppercase tracking-wide">
                  Pending Invites ({pendingInvites.length})
                </h3>
                {pendingInvites.map((invite) => (
                  <div key={invite.id} className="p-3 rounded bg-surface-raised/30 border border-default/50">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-white">{invite.email}</p>
                        <p className="text-xs text-quaternary capitalize">{invite.role}</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-surface-overlay text-tertiary">Pending</span>
                    </div>
                    <div className="text-xs text-quaternary mb-2">
                      Sent {formatDate(invite.sent_at)} · Expires {formatDate(invite.expires_at)}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleResendInvite(invite.id)}
                        className="flex-1 py-1.5 rounded bg-surface-overlay text-secondary hover:bg-surface-elevated text-xs font-medium transition-colors"
                      >
                        Resend
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancelInvite(invite.id)}
                        className="flex-1 py-1.5 rounded bg-surface-overlay text-secondary hover:bg-red-500/20 hover:text-red-400 text-xs font-medium transition-colors"
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
              <h3 className="text-xs font-medium text-quaternary uppercase tracking-wide">Profile</h3>

              {isEditingProfile ? (
                /* Edit Mode */
                <div className="p-3 rounded bg-surface-raised/30 border border-default/50 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-surface-overlay flex items-center justify-center text-lg font-medium text-white">
                      {userInitials}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-quaternary mb-1">Display Name</p>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full px-3 py-2 bg-surface-raised border border-emphasis rounded text-sm text-white focus:outline-none focus:border-strong"
                        placeholder="Your name"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-quaternary mb-1">Email (cannot be changed)</p>
                    <p className="text-sm text-tertiary px-3 py-2 bg-surface-raised/50 rounded">{userEmail}</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingProfile(false);
                        setProfileName(userDisplayName);
                      }}
                      className="flex-1 py-2 rounded bg-surface-overlay text-secondary hover:bg-surface-elevated text-xs font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleUpdateProfile}
                      className="flex-1 py-2 rounded bg-white text-black hover:bg-gray-100 text-xs font-medium transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="flex items-center gap-3 p-3 rounded bg-surface-raised/30 border border-default/50">
                  <div className="w-12 h-12 rounded-full bg-surface-overlay flex items-center justify-center text-lg font-medium text-white">
                    {userInitials}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{userDisplayName}</p>
                    <p className="text-xs text-quaternary">{userEmail}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(true)}
                    className="text-xs text-tertiary hover:text-white transition-colors"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Workspace Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium text-quaternary uppercase tracking-wide">Workspace</h3>
              <div className="p-3 rounded bg-surface-raised/30 border border-default/50 space-y-3">
                <div>
                  <label className="text-xs text-tertiary block mb-1">Workspace Name</label>
                  <input
                    type="text"
                    defaultValue="My Team"
                    className="w-full px-3 py-2 bg-surface-raised border border-emphasis rounded text-sm text-white focus:outline-none focus:border-strong"
                  />
                </div>
              </div>
            </div>

            {/* Sign Out */}
            {onSignOut && (
              <div className="space-y-3">
                <h3 className="text-xs font-medium text-quaternary uppercase tracking-wide">Session</h3>
                <div className="p-3 rounded bg-surface-raised/50 border border-default space-y-2">
                  {user?.email && (
                    <p className="text-xs text-tertiary">
                      Signed in as <span className="text-white">{user.email}</span>
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="w-full py-2 rounded bg-surface-overlay hover:bg-surface-elevated text-white text-xs font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}

            {/* Danger Zone */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium text-red-400/70 uppercase tracking-wide">Danger Zone</h3>
              <div className="p-3 rounded bg-red-500/5 border border-red-500/20 space-y-2">
                <p className="text-xs text-tertiary">Permanently delete your account and all associated data.</p>
                <button
                  type="button"
                  className="w-full py-2 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-medium transition-colors"
                >
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
