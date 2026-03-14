'use client';

import Link from 'next/link';
import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Lock, Mail } from 'lucide-react';
import { supabaseBrowser } from '../../lib/supabaseClient';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = {
  email?: string;
  password?: string;
};

function LoginPageContent() {
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirectedFrom') || '/dashboard';
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [mode, setMode] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  });

  const validateEmailOnly = () => {
    const nextErrors: FieldErrors = {};

    if (!email || !emailRegex.test(email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    setErrors((current) => ({ ...current, email: nextErrors.email, password: undefined }));
    return Object.keys(nextErrors).length === 0;
  };

  const validateLogin = () => {
    const nextErrors: FieldErrors = {};

    if (!email || !emailRegex.test(email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      nextErrors.password = 'Please enter your password.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');
    setSuccess('');
    setTouched({ email: true, password: true });

    if (!validateLogin()) {
      return;
    }

    const client = supabase;
    if (!client) {
      setFormError('Authentication is not configured yet. Add Supabase environment variables and redeploy.');
      return;
    }

    setLoading(true);

    const { error: authError } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setFormError(authError.message);
      setLoading(false);
      return;
    }

    const {
      data: { session },
    } = await client.auth.getSession();

    if (!session) {
      setFormError('Login succeeded but the session was not established. Please try again.');
      setLoading(false);
      return;
    }

    setSuccess('Login successful. Redirecting...');
    window.location.assign(redirectTarget.startsWith('/') ? redirectTarget : '/dashboard');
  };

  const handleForgotPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');
    setSuccess('');
    setTouched((current) => ({ ...current, email: true }));

    if (!validateEmailOnly()) {
      return;
    }

    const client = supabase;
    if (!client) {
      setFormError('Authentication is not configured yet. Add Supabase environment variables and redeploy.');
      return;
    }

    setForgotLoading(true);

    const redirectTo =
      typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined;

    const { error } = await client.auth.resetPasswordForEmail(email.trim(), redirectTo ? { redirectTo } : undefined);

    if (error) {
      setFormError(error.message);
      setForgotLoading(false);
      return;
    }

    setSuccess('Password reset link sent. Check your email and open the link to create a new password.');
    setForgotLoading(false);
  };

  return (
    <main>
      <section className="auth-shell login-theme">
        <div className="auth-card">
          <div className="auth-media">
            <div className="auth-media-overlay">
              <p className="auth-brand">Dentora Cloud</p>
              <h1>{mode === 'login' ? 'Welcome Back' : 'Reset Your Password'}</h1>
              <p>
                {mode === 'login'
                  ? 'Log in to manage patients, appointments, and operations in one secure platform.'
                  : 'Enter your email and we will send a secure password reset link to your inbox.'}
              </p>
            </div>
          </div>
          <div className="auth-content">
            <div className="auth-header">
              <p className="auth-title">{mode === 'login' ? 'Welcome' : 'Forgot Password'}</p>
              <p className="auth-subtitle">
                {mode === 'login' ? 'Login with email' : 'We will send you a recovery link'}
              </p>
            </div>
            <form className="auth-form" onSubmit={mode === 'login' ? handleSubmit : handleForgotPassword}>
              <label className="input-group">
                <span className="input-icon" aria-hidden>
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@clinic.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (touched.email) {
                      setErrors((prev) => ({
                        ...prev,
                        email: emailRegex.test(event.target.value) ? undefined : 'Please enter a valid email address.',
                      }));
                    }
                  }}
                  onBlur={() => {
                    setTouched((prev) => ({ ...prev, email: true }));
                    validateEmailOnly();
                  }}
                />
              </label>
              {touched.email && errors.email ? <p className="auth-error">{errors.email}</p> : null}

              {mode === 'login' ? (
                <>
                  <label className="input-group">
                    <span className="input-icon" aria-hidden>
                      <Lock size={18} />
                    </span>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        if (touched.password) {
                          setErrors((prev) => ({
                            ...prev,
                            password: event.target.value ? undefined : 'Please enter your password.',
                          }));
                        }
                      }}
                      onBlur={() => {
                        setTouched((prev) => ({ ...prev, password: true }));
                        validateLogin();
                      }}
                    />
                  </label>
                  {touched.password && errors.password ? <p className="auth-error">{errors.password}</p> : null}

                  <div className="auth-row">
                    <label className="auth-check">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(event) => setRememberMe(event.target.checked)}
                      />
                      Remember me
                    </label>
                    <button
                      type="button"
                      className="auth-link-button"
                      onClick={() => {
                        setMode('forgot');
                        setFormError('');
                        setSuccess('');
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                </>
              ) : (
                <div className="auth-row auth-row-single">
                  <button
                    type="button"
                    className="auth-link-button"
                    onClick={() => {
                      setMode('login');
                      setFormError('');
                      setSuccess('');
                    }}
                  >
                    Back to login
                  </button>
                </div>
              )}

              {formError ? <p className="auth-error">{formError}</p> : null}
              {success ? <p className="auth-success">{success}</p> : null}
              <button className="auth-submit" type="submit" disabled={loading || forgotLoading}>
                {mode === 'login'
                  ? loading
                    ? 'Please wait...'
                    : 'Login'
                  : forgotLoading
                    ? 'Sending link...'
                    : 'Send reset link'}
              </button>
            </form>
            <div className="auth-footer">
              {mode === 'login' ? (
                <>
                  <span>Don&apos;t have an account?</span>
                  <Link href="/signup">Register now</Link>
                </>
              ) : (
                <>
                  <span>Remembered your password?</span>
                  <button
                    type="button"
                    className="auth-link-button"
                    onClick={() => {
                      setMode('login');
                      setFormError('');
                      setSuccess('');
                    }}
                  >
                    Return to login
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}
