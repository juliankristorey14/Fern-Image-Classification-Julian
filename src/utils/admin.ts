import { getSupabaseClient } from '@/lib/supabaseClient';
import type { User, AdminPermissions } from '@/types';

// Helper: map profiles row to our app User type
function mapProfileRow(row: any): User {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    role: row.role === 'admin' ? 'admin' : 'user',
    createdAt: row.created_at,
    profilePicture: row.profile_picture ?? undefined,
    adminPermissions: row.admin_permissions ?? undefined,
  };
}

// Fetch all users (admin only)
export async function getAllUsers(): Promise<User[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getAllUsers error', error);
    return [];
  }

  return (data ?? []).map(mapProfileRow);
}

// Promote a user to admin (admin only)
export async function promoteUser(
  userId: string,
  permissions: Partial<AdminPermissions> = {}
): Promise<boolean> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('profiles')
    .update({
      role: 'admin',
      admin_permissions: {
        manageUsers: permissions.manageUsers ?? false,
        manageContent: permissions.manageContent ?? false,
        viewAnalytics: permissions.viewAnalytics ?? false,
        systemSettings: permissions.systemSettings ?? false,
      },
    })
    .eq('id', userId);

  if (error) {
    console.error('promoteUser error', error);
    return false;
  }
  return true;
}

// Demote admin to user (admin only)
export async function demoteUser(userId: string): Promise<boolean> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('profiles')
    .update({ role: 'user', admin_permissions: null })
    .eq('id', userId);

  if (error) {
    console.error('demoteUser error', error);
    return false;
  }
  return true;
}

// Update a user's role (admin only)
export async function updateUserRole(userId: string, role: 'admin' | 'user'): Promise<boolean> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);

  if (error) {
    console.error('updateUserRole error', error);
    return false;
  }
  return true;
}

// Delete a user (admin only)
export async function deleteUser(userId: string): Promise<boolean> {
  const supabase = getSupabaseClient();

  // First, delete all scans belonging to this user
  const { error: scansDeleteError } = await supabase
    .from('scans')
    .delete()
    .eq('user_id', userId);

  if (scansDeleteError) {
    console.error('deleteUser: failed to delete scans', scansDeleteError);
    return false;
  }

  // Then delete the profile row
  const { error: profileDeleteError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);

  if (profileDeleteError) {
    console.error('deleteUser: failed to delete profile', profileDeleteError);
    return false;
  }

  // Optionally: delete the auth user (requires service role key or admin API)
  // For now, we only delete the profile row.

  return true;
}
