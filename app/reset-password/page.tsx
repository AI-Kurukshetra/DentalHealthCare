'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Lock } from 'lucide-react';
import { supabaseBrowser } from '../../lib/supabaseClient';

export default function ResetPasswordPage() {
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingRecovery, setCheckingRecovery] = useState(true);
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const client = supabase;

    if (!client) {
      setCheckingRecovery(false);
      setError('Authentication is not configured yet. Add Supabase environment variables and redeploy.');
      return;
    }

    const checkRecovery = async () => {
      const {
        data: { session },
      } = await client.auth.getSession();

      setRecoveryReady(Boolean(session));
      setCheckingRecovery(false);
    };

    checkRecovery();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setRecoveryReady(Boolean(session));
        setCheckingRecovery(false);
        setError('');
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!recoveryReady) {
      setError('Open the password reset link from your email first.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const client = supabase;
    if (!client) {
      setError('Authentication is not configured yet. Add Supabase environment variables and redeploy.');
      return;
    }

    setLoading(true);

    const { error: updateError } = await client.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess('Password updated successfully. You can now log in with your new password.');
    setLoading(false);
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <main>
      <section className="auth-shell login-theme reset-theme">
        <div className="auth-card">
          <div className="auth-media">
            <div className="auth-media-overlay">
              <p className="auth-brand">Dentora Cloud</p>
              <h1>Create a New Password</h1>
              <p>Use the secure recovery link from your email to finish resetting your password.</p>
            </div>
          </div>
          <div className="auth-content">
            <div className="auth-header">
              <p className="auth-title">Reset Password</p>
              <p className="auth-subtitle">Choose a new password for your account</p>
            </div>
            <form className="auth-form" onSubmit={handleSubmit}>
              <label className="input-group">
                <span className="input-icon" aria-hidden>
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  name="password"
                  placeholder="New password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>
              <label className="input-group">
                <span className="input-icon" aria-hidden>
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </label>

              {checkingRecovery ? <p className="auth-helper-text">Checking your recovery link...</p> : null}
              {!checkingRecovery && !recoveryReady && !error ? (
                <p className="auth-helper-text">
                  Open the reset link from your email to activate this form, then come back here if needed.
                </p>
              ) : null}
              {error ? <p className="auth-error">{error}</p> : null}
              {success ? <p className="auth-success">{success}</p> : null}
              <button className="auth-submit" type="submit" disabled={loading || checkingRecovery || !recoveryReady}>
                {loading ? 'Updating password...' : 'Update password'}
              </button>
            </form>
            <div className="auth-footer">
              <span>Back to your account</span>
              <Link href="/login">Return to login</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
