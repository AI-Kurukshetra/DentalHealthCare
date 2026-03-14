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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false
  });

  const validate = () => {
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

    if (!validate()) {
      return;
    }

    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      setFormError(authError.message);
      setLoading(false);
      return;
    }

    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (!session) {
      setFormError('Login succeeded but the session was not established. Please try again.');
      setLoading(false);
      return;
    }

    if (rememberMe) {
      setSuccess('Login successful. Redirecting...');
    } else {
      setSuccess('Login successful. Redirecting...');
    }

    window.location.assign(redirectTarget.startsWith('/') ? redirectTarget : '/dashboard');
  };

  return (
    <main>
      <section className="auth-shell login-theme">
        <div className="auth-card">
          <div className="auth-media">
            <div className="auth-media-overlay">
              <p className="auth-brand">Dentora Cloud</p>
              <h1>Welcome Back</h1>
              <p>Log in to manage patients, appointments, and operations in one secure platform.</p>
            </div>
          </div>
          <div className="auth-content">
            <div className="auth-header">
              <p className="auth-title">Welcome</p>
              <p className="auth-subtitle">Login with email</p>
            </div>
            <form className="auth-form" onSubmit={handleSubmit}>
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
                        email: emailRegex.test(event.target.value) ? undefined : 'Please enter a valid email address.'
                      }));
                    }
                  }}
                  onBlur={() => {
                    setTouched((prev) => ({ ...prev, email: true }));
                    validate();
                  }}
                />
              </label>
              {touched.email && errors.email ? <p className="auth-error">{errors.email}</p> : null}

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
                        password: event.target.value ? undefined : 'Please enter your password.'
                      }));
                    }
                  }}
                  onBlur={() => {
                    setTouched((prev) => ({ ...prev, password: true }));
                    validate();
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
                <Link href="/contact">Forgot password?</Link>
              </div>
              {formError ? <p className="auth-error">{formError}</p> : null}
              {success ? <p className="auth-success">{success}</p> : null}
              <button className="auth-submit" type="submit" disabled={loading}>
                {loading ? 'Please wait...' : 'Login'}
              </button>
            </form>
            <div className="auth-footer">
              <span>Don&apos;t have an account?</span>
              <Link href="/signup">Register now</Link>
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