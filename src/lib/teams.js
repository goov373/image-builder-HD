import { supabase, isSupabaseConfigured } from './supabase';
import { logger } from '../utils';

/**
 * Team Management API
 * Handles team members and invites with Supabase
 *
 * Required Supabase Tables:
 *
 * -- Team members table
 * CREATE TABLE team_members (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   user_id UUID REFERENCES auth.users(id),
 *   owner_id UUID REFERENCES auth.users(id) NOT NULL,
 *   email TEXT NOT NULL,
 *   name TEXT,
 *   role TEXT DEFAULT 'editor' CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
 *   status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 *
 * -- Pending invites table
 * CREATE TABLE team_invites (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   owner_id UUID REFERENCES auth.users(id) NOT NULL,
 *   email TEXT NOT NULL,
 *   role TEXT DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'viewer')),
 *   token TEXT UNIQUE DEFAULT gen_random_uuid()::text,
 *   sent_at TIMESTAMPTZ DEFAULT NOW(),
 *   expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
 *   accepted_at TIMESTAMPTZ,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 *
 * -- Enable RLS
 * ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE team_invites ENABLE ROW LEVEL SECURITY;
 *
 * -- RLS Policies (users can only see their own team)
 * CREATE POLICY "Users can view their team" ON team_members
 *   FOR SELECT USING (owner_id = auth.uid() OR user_id = auth.uid());
 *
 * CREATE POLICY "Owners can manage their team" ON team_members
 *   FOR ALL USING (owner_id = auth.uid());
 *
 * CREATE POLICY "Users can view their invites" ON team_invites
 *   FOR SELECT USING (owner_id = auth.uid() OR email = auth.email());
 *
 * CREATE POLICY "Owners can manage invites" ON team_invites
 *   FOR ALL USING (owner_id = auth.uid());
 */

/**
 * Organization email domain for auto-team membership
 */
const TEAM_EMAIL_DOMAIN = 'hellodata.ai';

/**
 * Owner email - only this user can manage team members and invites
 */
const OWNER_EMAIL = 'gmaxwell@hellodata.ai';

/**
 * Check if the current user is the team owner
 * @returns {Promise<boolean>}
 */
export async function isTeamOwner() {
  if (!isSupabaseConfigured()) return false;

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.email?.toLowerCase() === OWNER_EMAIL.toLowerCase();
  } catch {
    return false;
  }
}

/**
 * Check if a given email is the team owner
 * @param {string} email
 * @returns {boolean}
 */
export function isOwnerEmail(email) {
  return email?.toLowerCase() === OWNER_EMAIL.toLowerCase();
}

/**
 * Get all team members - auto-includes all users with matching email domain
 * @returns {Promise<{members: Array, error: Error|null}>}
 */
export async function getTeamMembers() {
  if (!isSupabaseConfigured()) {
    return { members: [], error: new Error('Supabase not configured') };
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { members: [], error: new Error('Not authenticated') };
    }

    // Get all organization users from profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .ilike('email', `%@${TEAM_EMAIL_DOMAIN}`)
      .order('created_at', { ascending: true });

    if (profilesError) {
      logger.warn('Profiles query failed, showing current user only:', profilesError.message);
      return {
        members: [
          {
            id: user.id,
            user_id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'You',
            role: 'owner',
            status: 'active',
            isCurrentUser: true,
          },
        ],
        error: null,
      };
    }

    // Transform profiles to team member format
    let members = (profiles || []).map((profile) => ({
      id: profile.id,
      user_id: profile.id,
      email: profile.email,
      name: profile.full_name || profile.email?.split('@')[0] || 'Unknown',
      role: profile.role || (profile.email === user.email ? 'owner' : 'editor'),
      status: 'active',
      isCurrentUser: profile.id === user.id || profile.email === user.email,
      avatar_url: profile.avatar_url,
    }));

    // Ensure current user is in the list (in case they don't match domain)
    const currentUserInList = members.some((m) => m.isCurrentUser);
    if (!currentUserInList) {
      members = [
        {
          id: user.id,
          user_id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'You',
          role: 'owner',
          status: 'active',
          isCurrentUser: true,
        },
        ...members,
      ];
    }

    // Sort: current user first, then by name
    members.sort((a, b) => {
      if (a.isCurrentUser) return -1;
      if (b.isCurrentUser) return 1;
      return (a.name || '').localeCompare(b.name || '');
    });

    return { members, error: null };
  } catch (error) {
    logger.error('Error fetching team members:', error);
    return { members: [], error };
  }
}

/**
 * Get all pending invites for the current user's team
 * @returns {Promise<{invites: Array, error: Error|null}>}
 */
export async function getPendingInvites() {
  if (!isSupabaseConfigured()) {
    return { invites: [], error: new Error('Supabase not configured') };
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { invites: [], error: new Error('Not authenticated') };
    }

    const { data, error } = await supabase
      .from('team_invites')
      .select('*')
      .eq('owner_id', user.id)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('sent_at', { ascending: false });

    if (error) throw error;

    return { invites: data || [], error: null };
  } catch (error) {
    logger.error('Error fetching invites:', error);
    return { invites: [], error };
  }
}

/**
 * Send an invite to a new team member
 * @param {string} email - Email to invite
 * @param {string} role - Role to assign ('admin', 'editor', 'viewer')
 * @returns {Promise<{invite: Object|null, error: Error|null}>}
 */
export async function sendInvite(email, role = 'editor') {
  if (!isSupabaseConfigured()) {
    return { invite: null, error: new Error('Supabase not configured') };
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { invite: null, error: new Error('Not authenticated') };
    }

    // Check if invite already exists
    const { data: existing } = await supabase
      .from('team_invites')
      .select('id')
      .eq('owner_id', user.id)
      .eq('email', email.toLowerCase())
      .is('accepted_at', null)
      .single();

    if (existing) {
      return { invite: null, error: new Error('Invite already sent to this email') };
    }

    // Check if already a team member
    const { data: existingMember } = await supabase
      .from('team_members')
      .select('id')
      .eq('owner_id', user.id)
      .eq('email', email.toLowerCase())
      .single();

    if (existingMember) {
      return { invite: null, error: new Error('This person is already a team member') };
    }

    // Create invite
    const { data, error } = await supabase
      .from('team_invites')
      .insert({
        owner_id: user.id,
        email: email.toLowerCase(),
        role,
        sent_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // TODO: Send actual invite email via Supabase Edge Function or email service

    return { invite: data, error: null };
  } catch (error) {
    logger.error('Error sending invite:', error);
    return { invite: null, error };
  }
}

/**
 * Resend an existing invite
 * @param {string} inviteId - Invite ID to resend
 * @returns {Promise<{invite: Object|null, error: Error|null}>}
 */
export async function resendInvite(inviteId) {
  if (!isSupabaseConfigured()) {
    return { invite: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('team_invites')
      .update({
        sent_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq('id', inviteId)
      .select()
      .single();

    if (error) throw error;

    return { invite: data, error: null };
  } catch (error) {
    logger.error('Error resending invite:', error);
    return { invite: null, error };
  }
}

/**
 * Cancel/delete an invite
 * @param {string} inviteId - Invite ID to cancel
 * @returns {Promise<{success: boolean, error: Error|null}>}
 */
export async function cancelInvite(inviteId) {
  if (!isSupabaseConfigured()) {
    return { success: false, error: new Error('Supabase not configured') };
  }

  try {
    const { error } = await supabase.from('team_invites').delete().eq('id', inviteId);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    logger.error('Error canceling invite:', error);
    return { success: false, error };
  }
}

/**
 * Update a team member's role
 * @param {string} memberId - Member ID to update
 * @param {string} newRole - New role ('admin', 'editor', 'viewer')
 * @returns {Promise<{member: Object|null, error: Error|null}>}
 */
export async function updateMemberRole(memberId, newRole) {
  if (!isSupabaseConfigured()) {
    return { member: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('team_members')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', memberId)
      .neq('role', 'owner') // Can't change owner role
      .select()
      .single();

    if (error) throw error;

    return { member: data, error: null };
  } catch (error) {
    logger.error('Error updating member role:', error);
    return { member: null, error };
  }
}

/**
 * Remove a team member
 * @param {string} memberId - Member ID to remove
 * @returns {Promise<{success: boolean, error: Error|null}>}
 */
export async function removeMember(memberId) {
  if (!isSupabaseConfigured()) {
    return { success: false, error: new Error('Supabase not configured') };
  }

  try {
    const { error } = await supabase.from('team_members').delete().eq('id', memberId).neq('role', 'owner'); // Can't remove owner

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    logger.error('Error removing member:', error);
    return { success: false, error };
  }
}

export default {
  getTeamMembers,
  getPendingInvites,
  sendInvite,
  resendInvite,
  cancelInvite,
  updateMemberRole,
  removeMember,
  isTeamOwner,
  isOwnerEmail,
};
