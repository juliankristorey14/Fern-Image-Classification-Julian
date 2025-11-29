import { getSupabaseClient } from '@/lib/supabaseClient';
import type { User } from '@/types';

export async function loginWithEmail(email: string, password: string): Promise<User | null> {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return null;
    }

    const { user } = data;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    console.log('Login profile data:', { profile, profileError });

    if (profileError || !profile) {
      // Fallback minimal user if profile isn't set up yet
      return {
        id: user.id,
        username: user.email ?? 'user',
        email: user.email ?? '',
        role: 'user',
        createdAt: user.created_at ?? new Date().toISOString(),
      };
    }

    const mappedUser: User = {
      id: profile.id,
      username: profile.username,
      email: user.email ?? profile.email ?? '',
      role: profile.role === 'admin' ? 'admin' : 'user',
      createdAt: profile.created_at,
      profilePicture: profile.profile_picture ?? undefined,
      adminPermissions: profile.admin_permissions ?? undefined,
    };

    return mappedUser;
  } catch (err) {
    console.error('loginWithEmail error', err);
    return null;
  }
}

export async function registerWithEmail(
  username: string,
  email: string,
  password: string,
  profilePicture?: File | null
): Promise<{ user: User | null; error?: string }> {
  try {
    const supabase = getSupabaseClient();
    // First, check if there's already an auth user for this email/password.
    // This lets us recreate a deleted profile instead of always failing with
    // "user already exists" when only the profile row was removed.
    const { data: signInData } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInData?.user) {
      const existingAuthUser = signInData.user;

      const { data: existingProfile, error: existingProfileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', existingAuthUser.id)
        .single();

      // If both auth user and profile already exist, treat this as a true
      // duplicate registration attempt.
      if (!existingProfileError && existingProfile) {
        return {
          user: null,
          error: 'An account with this email already exists. Please log in instead.',
        };
      }

      // Auth user exists but profile row is missing (e.g. profile deleted).
      // Recreate the profile and treat registration as successful.
      let profilePictureUrl: string | undefined;

      if (profilePicture) {
        console.log('Uploading profile picture for existing user:', profilePicture.name);
        const fileExt = profilePicture.name.split('.').pop() || 'jpg';
        const filePath = `avatars/${existingAuthUser.id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, profilePicture);

        console.log('Upload result (existing user):', { filePath, uploadError });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);
          profilePictureUrl = publicUrlData.publicUrl;
          console.log('Profile picture URL (existing user):', profilePictureUrl);
        } else {
          console.error('Upload failed (existing user):', uploadError);
        }
      } else {
        console.log('No profile picture provided for existing user');
      }

      console.log('Inserting profile for existing auth user with picture URL:', profilePictureUrl);
      const { error: recreateProfileError } = await supabase.from('profiles').insert({
        id: existingAuthUser.id,
        username,
        role: 'user',
        created_at: existingAuthUser.created_at ?? new Date().toISOString(),
        profile_picture: profilePictureUrl ?? null,
      });

      if (recreateProfileError) {
        console.error('Profile insert error (existing user):', recreateProfileError);
        return {
          user: null,
          error: 'Account exists but profile setup failed.',
        };
      }

      const mappedExistingUser: User = {
        id: existingAuthUser.id,
        username,
        email: existingAuthUser.email ?? email,
        role: 'user',
        createdAt: existingAuthUser.created_at ?? new Date().toISOString(),
        profilePicture: profilePictureUrl,
      };

      return { user: mappedExistingUser };
    }

    // No existing auth user for these credentials; proceed with normal sign-up.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error || !data.user) {
      return {
        user: null,
        error: error?.message ?? 'Unable to register. Please try again.',
      };
    }

    const { user } = data;

    let profilePictureUrl: string | undefined;

    if (profilePicture) {
      console.log('Uploading profile picture:', profilePicture.name);
      const fileExt = profilePicture.name.split('.').pop() || 'jpg';
      const filePath = `avatars/${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, profilePicture);

      console.log('Upload result:', { filePath, uploadError });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        profilePictureUrl = publicUrlData.publicUrl;
        console.log('Profile picture URL:', profilePictureUrl);
      } else {
        console.error('Upload failed:', uploadError);
      }
    } else {
      console.log('No profile picture provided');
    }

    // Create profile row for this user (optional but recommended)
    console.log('Inserting profile with picture URL:', profilePictureUrl);
    const { error: profileError } = await supabase.from('profiles').insert({
      id: user.id,
      username,
      role: 'user',
      created_at: user.created_at ?? new Date().toISOString(),
      profile_picture: profilePictureUrl ?? null,
    });

    if (profileError) {
      console.error('Profile insert error:', profileError);
      return {
        user: null,
        error: 'Account created but profile setup failed.',
      };
    }

    const mappedUser: User = {
      id: user.id,
      username,
      email: user.email ?? email,
      role: 'user',
      createdAt: user.created_at ?? new Date().toISOString(),
      profilePicture: profilePictureUrl,
    };

    return { user: mappedUser };
  } catch (err) {
    console.error('registerWithEmail error', err);
    return {
      user: null,
      error: 'Unexpected error during registration.',
    };
  }
}
