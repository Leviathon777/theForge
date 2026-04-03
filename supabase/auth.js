import { supabase } from "./config";

/**
 * Sign up a new user with email + password.
 * Supabase sends a 6-digit OTP code to their email for verification.
 */
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Use OTP code instead of email redirect
      emailRedirectTo: undefined,
    },
  });

  if (error) throw error;
  return data;
};

/**
 * Sign in with email + password.
 */
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

/**
 * Sign in with OTP code sent to email (passwordless option).
 * Step 1: Request the code.
 */
export const sendOTP = async (email) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
    },
  });

  if (error) throw error;
  return data;
};

/**
 * Verify the 6-digit OTP code.
 * Works for both sign-up confirmation and OTP sign-in.
 */
export const verifyOTP = async (email, token, type = "email") => {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type,
  });

  if (error) throw error;
  return data;
};

/**
 * Sign out the current user.
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * Get the current session (null if not authenticated).
 */
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};

/**
 * Get the current user (null if not authenticated).
 */
export const getUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error && error.message !== "Auth session missing!") throw error;
  return user;
};

/**
 * Listen for auth state changes.
 * Returns an unsubscribe function.
 */
export const onAuthStateChange = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      callback(event, session);
    }
  );
  return subscription.unsubscribe;
};

/**
 * Reset password — sends a reset email with OTP code.
 */
export const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
  return data;
};

/**
 * Update the user's password (must be authenticated).
 */
export const updatePassword = async (newPassword) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) throw error;
  return data;
};

/**
 * Link a Supabase auth user to their forger_accounts record.
 * Called after sign-up + verification during profile creation.
 */
export const linkAuthToWallet = async (walletAddress) => {
  const user = await getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("forger_accounts")
    .update({
      auth_user_id: user.id,
      email_verified: true,
    })
    .eq("wallet_address", walletAddress);

  if (error) throw error;
  return user.id;
};

/**
 * Check if a wallet address has an existing account.
 * Returns { account_exists, email_hint, has_auth } without needing auth.
 * Used to determine if returning user needs to sign in or new user needs to register.
 */
export const lookupWallet = async (walletAddress) => {
  const { data, error } = await supabase.rpc("lookup_wallet", { wallet: walletAddress });
  if (error) throw error;
  return data?.[0] || { account_exists: false, email_hint: null, has_auth: false };
};
